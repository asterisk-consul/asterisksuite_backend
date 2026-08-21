-- Debug warehouse_stock_movements for the specific product
-- Query 1: What warehouse_id values are in warehouse_stock_movements for product_id = '9cf0049d-aa35-463c-90a9-e044a3f39696'
SELECT 
    'MOVEMENTS' as source,
    wsm.warehouse_id,
    w.name as warehouse_name,
    wsm.direction,
    wsm.movement_type,
    wsm.quantity,
    wsm.reference_type,
    wsm.reference_id,
    wsm.created_at,
    wsm.notes
FROM tenant.warehouse_stock_movements wsm
JOIN tenant.warehouses w ON w.id = wsm.warehouse_id
WHERE wsm.product_id = '9cf0049d-aa35-463c-90a9-e044a3f39696'
  AND wsm.deleted_at IS NULL
ORDER BY wsm.created_at DESC;

-- Query 2: What warehouse_id values are in warehouse_stock for the same product
SELECT 
    'STOCK' as source,
    ws.warehouse_id,
    w.name as warehouse_name,
    ws.quantity,
    ws.reserved_quantity,
    ws.created_at,
    ws.updated_at
FROM tenant.warehouse_stock ws
JOIN tenant.warehouses w ON w.id = ws.warehouse_id
WHERE ws.product_id = '9cf0049d-aa35-463c-90a9-e044a3f39696'
  AND ws.deleted_at IS NULL
ORDER BY ws.updated_at DESC;

-- Query 3: All warehouses to see the actual IDs
SELECT 
    'WAREHOUSES' as source,
    id,
    name,
    code,
    active,
    created_at
FROM tenant.warehouses
WHERE deleted_at IS NULL
ORDER BY name;
