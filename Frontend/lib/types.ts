export type Role = "student" | "faculty" | "admin";

export interface User {
  user_id: number;
  full_name: string;
  email: string;
  role: Role;
  created_at?: string;
}

export interface LoginResponse {
  token: string;
  user_id: number;
  role: Role;
}

export type EquipmentCategory = "lab" | "cafeteria" | "library";
export type EquipmentStatus = "Available" | "Low Stock" | "Maintenance";

export interface Equipment {
  item_id: number;
  service_name: string;
  category: EquipmentCategory;
  status: EquipmentStatus;
  last_updated_by: number | null;
  updated_at: string;
}

export interface Notice {
  notice_id: number;
  title: string;
  body: string;
  created_by: number;
  created_at: string;
}
