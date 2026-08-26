export interface MaintenanceOrderWithRelations {
  id: string;
  company_id: string;
  number: string;
  asset_type: string;
  asset_id: string;
  vehicle_id?: string | null;
  tire_id?: string | null;
  category: string;
  maintenance_type: string;
  priority: string;
  status: string;
  title: string;
  description?: string | null;
  reported_problem?: string | null;
  diagnosis?: string | null;
  solution?: string | null;
  scheduled_at?: Date | null;
  reported_at?: Date | null;
  started_at?: Date | null;
  completed_at?: Date | null;
  odometer?: number | null;
  reported_by?: string | null;
  assigned_to?: string | null;
  supplier_id?: string | null;
  estimated_cost?: number | null;
  actual_cost?: number | null;
  parts_cost?: number | null;
  labor_cost?: number | null;
  services_cost?: number | null;
  vehicle_unavailable?: boolean;
  unavailable_from?: Date | null;
  unavailable_until?: Date | null;
  notes?: string | null;
  created_by?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  tasks?: any[];
  parts?: any[];
  labor?: any[];
  services?: any[];
  status_history?: any[];
  vehicle?: { id: string; plate: string; brand?: string | null; model?: string | null };
  tire?: { id: string; serial_number: string; product?: { name: string } };
  supplier?: { id: string; name: string };
}

export interface MaintenanceOrderStats {
  total: number;
  pending: number;
  scheduled: number;
  in_progress: number;
  waiting_parts: number;
  waiting_supplier: number;
  completed: number;
  cancelled: number;
  critical: number;
  high: number;
  overdue: number;
  this_month_cost: number;
  this_year_cost: number;
}

export interface CreateMaintenanceOrderInput {
  asset_type: string;
  asset_id: string;
  vehicle_id?: string;
  tire_id?: string;
  category: string;
  maintenance_type: string;
  priority?: string;
  title: string;
  description?: string;
  reported_problem?: string;
  scheduled_at?: Date;
  odometer?: number;
  reported_by?: string;
  assigned_to?: string;
  supplier_id?: string;
  estimated_cost?: number;
  vehicle_unavailable?: boolean;
  unavailable_from?: Date;
  unavailable_until?: Date;
  notes?: string;
  tasks?: Array<{
    description: string;
    assigned_to?: string;
    estimated_hours?: number;
    notes?: string;
  }>;
  parts?: Array<{
    product_id: string;
    warehouse_id: string;
    quantity: number;
    unit_cost: number;
  }>;
  labor?: Array<{
    employee_id: string;
    description: string;
    hours: number;
    hourly_cost: number;
  }>;
  services?: Array<{
    supplier_id: string;
    description: string;
    quantity: number;
    unit_cost: number;
    document_id?: string;
  }>;
}
