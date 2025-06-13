export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  college_id: string;
  created_at: string;
}

export interface College {
  id: string;
  name: string;
  location: string;
  created_at: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  deadline: string;
  college_id: string;
  posted_by: string;
  created_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  student_id: string;
  applied_at: string;
  job?: Job;
}

export interface JobWithApplicationStatus extends Job {
  is_applied: boolean;
  applications_count?: number;
}

export interface ApplicationWithJob extends JobApplication {
  job: Job;
}
