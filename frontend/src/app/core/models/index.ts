export interface User {
  id?: string;
  _id?: string;
  userId: string;
  name: string;
  email: string;
  role: 'Admin' | 'General User';
  department: string;
  isActive: boolean;
  avatar?: string;
  lastLogin?: Date | string;
  createdAt?: Date | string;
}

export interface AppRecord {
  id?: string;
  _id?: string;
  title: string;
  category: 'Finance' | 'HR' | 'Operations' | 'IT' | 'Marketing' | 'Sales';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedTo?: string;
  createdBy?: string;
  description?: string;
  amount?: number;
  dueDate?: Date | string;
  tags?: string[];
  accessLevel: 'all' | 'admin';
  createdAt?: Date | string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface RecordsResponse {
  records: AppRecord[];
  total: number;
  role: string;
}

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
