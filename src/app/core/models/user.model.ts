export type UserRole = 'mentee' | 'mentor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  createdAt: Date;
}

export interface Profile extends User {
  bio: string;
  location: string;
  phone?: string;
  linkedin?: string;
  website?: string;
  yearsExperience?: number;
  availability?: string[];
}
