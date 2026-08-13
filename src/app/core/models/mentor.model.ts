export type MentorshipType = 'virtual' | 'presencial' | 'hibrido';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: Date;
}

export interface Availability {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Mentor {
  id: string;
  userId: string;
  name: string;
  title: string;
  photo: string;
  category: string;
  bio: string;
  trajectory: string;
  experience: number;
  rating: number;
  price: number;
  mentorships: number;
  badges: Badge[];
  availability: Availability[];
  specialties: string[];
  tags: string[];
}
