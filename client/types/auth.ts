// types/auth.ts
export interface User {
  id: number;
  email: string;
  role: 'student' | 'admin';
  student_number?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirm_password: string;
  student_number: string;
}