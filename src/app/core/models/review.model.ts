export interface Review {
  id: string;
  mentorId: string;
  menteeName: string;
  rating: number;
  comment: string;
  tags: string[];
  date: Date;
}
