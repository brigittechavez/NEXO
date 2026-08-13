export type MentorshipType = 'individual' | 'package' | 'continuous';

export interface Mentorship {
  id: string;
  title: string;
  description: string;
  type: MentorshipType;
  duration: string;
  price: number;
  isFree: boolean;
  slots: number;
  includes: string[];
  targetAudience: string;
  mentorId: string;
}
