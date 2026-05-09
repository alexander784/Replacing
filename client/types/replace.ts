export interface User {
  id: number;
  email: string;
  role: 'student' | 'admin';
  student_number?: string;
}

export interface IDReplacement {
  id: number;
  full_name: string;
  student_number: string;
  course: string;
  year_of_study: string;
  id_photo?: string;       
  reason?: string;
  
  status: 'pending' | 'approved' | 'rejected';
  status_display?: string; 
  
  rejection_reason?: string; 
  reviewed_by?: string;        
  reviewed_by_name?: string;
  
  created_at: string;
  updated_at: string;
}

export interface IDReplacementCreate {
  full_name: string;
  student_number: string;
  course: string;
  year_of_study: string;
  reason?: string;
  id_photo: File;
}

export interface AdminReplacementDetail extends IDReplacement {
  student: number;          
  rejection_reason?: string;
}

export interface ReplacementListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IDReplacement[];
}

export type ReplacementStatus = 'pending' | 'approved' | 'rejected';

export const ReplacementStatusConfig = {
  pending: {
    label: 'Pending',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
  },
  approved: {
    label: 'Approved',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
  },
};