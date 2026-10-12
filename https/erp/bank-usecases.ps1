<#
  Casos de uso de conceptos y movimientos bancarios.
  Ejecuta contra el backend real y muestra resultados en consola.

  Uso:
    powershell -ExecutionPolicy Bypass -File https/erp/bank-usecases.ps1
    powershell -ExecutionPolicy Bypass -File https/erp/bank-usecases.ps1 -Tenant dev -AccountId <uuid>

  Requisitos:
    - Backend corriendo en -BaseUrl
    - Migración y seeds aplicados al tenant:
        npx tsx prisma/seeds/apply-bank-migration.ts <tenant>
        npx tsx prisma/seeds/seed-all.ts <tenant>
#>

param(
  [string]$BaseUrl = 'http://localhost:3000/api',
  [string]$Tenant  = 'dev',
  [string]$Email   = 'admin@mail.com',
  [string]$Password= '123456',
  [string]$AccountId = ''
)

$ErrorActionPreference = 'Stop'
$script:passed = 0
$script:failed = 0

function Section($t) { Write-Host "`n================ $t ================" -ForegroundColor Cyan }
function Ok($t)      { Write-Host "  [OK] $t" -ForegroundColor Green; $script:passed++ }
function Fail($t)    { Write-Host "  [FALLO] $t" -ForegroundColor Red; $script:failed++ }
function Info($t)    { Write-Host "  $t" -ForegroundColor DarkGray }

function Assert-Equal($actual, $expected, $label) {
  if ([decimal]$actual -eq [decimal]$expected) { Ok "$label ($actual)" }
  else { Fail "$label -> esperado $expected, obtenido $actual" }
}

# ── Login ─────────────────────────────────────────────────────
Section 'LOGIN'
$login = Invoke-RestMethod -Method Post -Uri "$BaseUrl/auth/login" `
  -Headers @{ 'x-tenant' = $Tenant } -ContentType 'application/json' `
  -Body (@{ email = $Email; password = $Password } | ConvertTo-Json)
$H = @{ Authorization = "Bearer $($login.accessToken)"; 'x-tenant' = $Tenant }
Ok "Token obtenido para $Email"

# ── Cuenta bancaria ───────────────────────────────────────────
Section 'CUENTA BANCARIA'
$accounts = Invoke-RestMethod -Method Get -Uri "$BaseUrl/erp/bank-accounts" -Headers $H
if (-not $AccountId) {
  $acc = $accounts | Where-Object { $_.active } | Select-Object -First 1
} else {
  $acc = $accounts | Where-Object { $_.id -eq $AccountId }
}
if (-not $acc) { throw "No se encontro cuenta bancaria. Crea una o pasa -AccountId." }
$accId = $acc.id
Info "Cuenta: $($acc.bank_name) - $($acc.name) [$($acc.currency_code)] saldo=$($acc.balance)"

# ── Conceptos ─────────────────────────────────────────────────
Section 'CONCEPTOS'
$concepts = Invoke-RestMethod -Method Get -Uri "$BaseUrl/erp/bank-concepts" -Headers $H
$comision = $concepts | Where-Object { $_.code -eq 'COMISION' }
$retencion = $concepts | Where-Object { $_.code -eq 'RETENCION_BANCARIA' }
$credito = $concepts | Where-Object { $_.code -eq 'ACRED_NO_IDENT' }
foreach ($c in @($comision, $retencion, $credito)) {
  if (-not $c) { throw "Falta un concepto requerido. Ejecuta seed-all para el tenant." }
}
Ok "Conceptos disponibles: COMISION, RETENCION_BANCARIA, ACRED_NO_IDENT"

# ── CASO 1: movimiento manual DEBITO con IVA ──────────────────
Section 'CASO 1 - Movimiento manual (comision con IVA)'
$balance0 = [decimal](Invoke-RestMethod -Method Get -Uri "$BaseUrl/erp/bank-accounts/$accId" -Headers $H).balance
$body = @{
  nature = 'DEBIT'; bank_concept_id = $comision.id; amount = 1210; base_amount = 1000
  currency_code = $acc.currency_code; reference = 'OP-CASE1'; description = 'Comision caso 1'
  date = (Get-Date).ToString('yyyy-MM-dd')
} | ConvertTo-Json
$mov1 = Invoke-RestMethod -Method Post -Uri "$BaseUrl/erp/bank-accounts/$accId/movements" `
  -Headers $H -ContentType 'application/json' -Body $body
Info "type=$($mov1.type) nature=$($mov1.nature) amount=$($mov1.amount) base=$($mov1.base_amount) iva=$($mov1.tax_amount) total=$($mov1.total_amount)"
Assert-Equal $mov1.tax_amount 210 'IVA calculado'
Assert-Equal $mov1.amount -1210 'Importe debitado'
$balance1 = [decimal](Invoke-RestMethod -Method Get -Uri "$BaseUrl/erp/bank-accounts/$accId" -Headers $H).balance
Assert-Equal $balance1 ($balance0 - 1210) 'Saldo tras debito'

# ── CASO 2: movimiento manual CREDITO ─────────────────────────
Section 'CASO 2 - Movimiento manual (acreditacion no identificada)'
$body = @{
  nature = 'CREDIT'; bank_concept_id = $credito.id; amount = 5000
  currency_code = $acc.currency_code; description = 'Acreditacion sin identificar'
  date = (Get-Date).ToString('yyyy-MM-dd')
} | ConvertTo-Json
$mov2 = Invoke-RestMethod -Method Post -Uri "$BaseUrl/erp/bank-accounts/$accId/movements" `
  -Headers $H -ContentType 'application/json' -Body $body
Assert-Equal $mov2.amount 5000 'Importe acreditado'
$balance2 = [decimal](Invoke-RestMethod -Method Get -Uri "$BaseUrl/erp/bank-accounts/$accId" -Headers $H).balance
Assert-Equal $balance2 ($balance1 + 5000) 'Saldo tras credito'

# ── CASO 3: anulacion (revierte el saldo) ─────────────────────
Section 'CASO 3 - Anular el movimiento del caso 1'
Invoke-RestMethod -Method Post -Uri "$BaseUrl/erp/bank-accounts/$accId/movements/$($mov1.id)/cancel" `
  -Headers $H -ContentType 'application/json' -Body '{}' | Out-Null
$balance3 = [decimal](Invoke-RestMethod -Method Get -Uri "$BaseUrl/erp/bank-accounts/$accId" -Headers $H).balance
Assert-Equal $balance3 ($balance2 + 1210) 'Saldo restaurado tras anular'

# ── CASO 4: COBRO con comision + retencion ────────────────────
Section 'CASO 4 - Cobro por transferencia con comision y retencion'
$balanceBefore4 = [decimal](Invoke-RestMethod -Method Get -Uri "$BaseUrl/erp/bank-accounts/$accId" -Headers $H).balance
$payload = @{
  type = 'COLLECTION'; payment_method = 'BANK_TRANSFER'; date = (Get-Date).ToString('yyyy-MM-dd')
  amount = 100000; currency_code = $acc.currency_code; bank_account_id = $accId
  description = 'Caso 4 - cobro cliente'
  bank_charges = @(
    @{ bank_concept_id = $comision.id; nature = 'DEBIT'; base_amount = 1000 },
    @{ bank_concept_id = $retencion.id; nature = 'DEBIT'; base_amount = 500
       retention = @{ jurisdiction = 'CABA'; tax_code = 'IIBB'; certificate_number = 'CERT-001'; period = '2026-10' } }
  )
} | ConvertTo-Json -Depth 8
$pay = Invoke-RestMethod -Method Post -Uri "$BaseUrl/erp/payments" -Headers $H -ContentType 'application/json' -Body $payload
Invoke-RestMethod -Method Post -Uri "$BaseUrl/erp/payments/$($pay.id)/confirm" -Headers $H -ContentType 'application/json' -Body '{}' | Out-Null
$balanceAfter4 = [decimal](Invoke-RestMethod -Method Get -Uri "$BaseUrl/erp/bank-accounts/$accId" -Headers $H).balance
Assert-Equal $balanceAfter4 ($balanceBefore4 + 100000 - 1210 - 500) 'Neto bancario del cobro'
$movs = Invoke-RestMethod -Method Get -Uri "$BaseUrl/erp/bank-accounts/$accId/movements" -Headers $H
$collect = $movs | Where-Object { $_.reference_type -eq 'payment' } | Select-Object -First 1
Info "Operacion: gross=$($collect.operation.gross_amount) charges=$($collect.operation.charges_amount) retentions=$($collect.operation.retentions_amount) net=$($collect.operation.net_amount)"
Assert-Equal $collect.operation.gross_amount 100000 'Gross de la operacion'
Assert-Equal $collect.operation.charges_amount 1210 'Cargos de la operacion'
Assert-Equal $collect.operation.retentions_amount 500 'Retenciones de la operacion'
Assert-Equal $collect.operation.net_amount 98290 'Neto de la operacion'

# ── CASO 5: GASTO con comision ────────────────────────────────
Section 'CASO 5 - Pago/gasto por transferencia con comision'
$balanceBefore5 = [decimal](Invoke-RestMethod -Method Get -Uri "$BaseUrl/erp/bank-accounts/$accId" -Headers $H).balance
$payload = @{
  type = 'EXPENSE'; payment_method = 'BANK_TRANSFER'; date = (Get-Date).ToString('yyyy-MM-dd')
  amount = 20000; currency_code = $acc.currency_code; bank_account_id = $accId
  description = 'Caso 5 - gasto con comision'
  bank_charges = @( @{ bank_concept_id = $comision.id; nature = 'DEBIT'; base_amount = 500 } )
} | ConvertTo-Json -Depth 8
$pay5 = Invoke-RestMethod -Method Post -Uri "$BaseUrl/erp/payments" -Headers $H -ContentType 'application/json' -Body $payload
Invoke-RestMethod -Method Post -Uri "$BaseUrl/erp/payments/$($pay5.id)/confirm" -Headers $H -ContentType 'application/json' -Body '{}' | Out-Null
$balanceAfter5 = [decimal](Invoke-RestMethod -Method Get -Uri "$BaseUrl/erp/bank-accounts/$accId" -Headers $H).balance
Assert-Equal $balanceAfter5 ($balanceBefore5 - 20000 - 605) 'Saldo tras gasto + comision con IVA'

# ── CASO 6: reporte de gastos bancarios ───────────────────────
Section 'CASO 6 - Reporte de gastos bancarios'
$rep = Invoke-RestMethod -Method Get -Uri "$BaseUrl/erp/treasury/bank-expenses" -Headers $H
Info "total_expenses=$($rep.summary.total_expenses) commissions=$($rep.summary.commissions) taxes=$($rep.summary.taxes) iva=$($rep.summary.iva) retentions=$($rep.summary.retentions)"
if ($rep.summary.count -ge 1) { Ok 'Reporte devuelve movimientos con concepto' } else { Fail 'Reporte sin movimientos' }

# ── Resumen ───────────────────────────────────────────────────
Section 'RESUMEN'
Write-Host "  Casos OK: $script:passed   Fallos: $script:failed" -ForegroundColor Yellow
if ($script:failed -gt 0) { exit 1 }
