SELECT 'tax_categories' as tabla, COUNT(*) as total FROM tenant.tax_categories;
SELECT 'taxes' as tabla, COUNT(*) as total FROM tenant.taxes;
SELECT 'tax_category_taxes' as tabla, COUNT(*) as total FROM tenant.tax_category_taxes;
SELECT tc.code as category, t.code as tax, t.rate, tct.active FROM tenant.tax_category_taxes tct JOIN tenant.tax_categories tc ON tc.id = tct.tax_category_id JOIN tenant.taxes t ON t.id = tct.tax_id;
