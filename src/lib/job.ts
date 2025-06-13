export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  deadline: string;
  college_id: string;
  posted_by: string;
  created_at: string;
  updated_at?: string;
  status?: 'active' | 'inactive';
  applications_count?: number;
}

export interface JobApplication {
  id: string;
  job_id: string;
  student_id: string;
  applied_at: string;
  student?: {
    id: string;
    name: string;
    email: string;
    college_id: string;
  };
}

export interface Student {
  id: string;
  name: string;
  email: string;
  college_id: string;
  created_at: string;
}
