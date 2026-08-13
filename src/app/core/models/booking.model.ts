export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  mentorId: string;
  menteeId: string;
  mentorshipId: string;
  date: Date;
  time: string;
  duration: number;
  status: BookingStatus;
  objective: string;
  context: string;
}
