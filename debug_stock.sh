#!/bin/bash
export PGPASSWORD=Yedroloski12.-
psql -h localhost -p 5432 -U postgres -d dev_db -f "C:\proyectos\Asterisk_Suite\asterisksuite_backend\debug_stock.sql"
