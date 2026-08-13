import { TestBed } from '@angular/core/testing';
import { BookingService, CANCELLATION_WINDOW_HOURS } from './booking.service';
import { Booking, BookingStatus } from '../models/booking.model';

const NOW = new Date('2026-08-12T10:00:00');

function bookingAt(offsetHours: number, status: BookingStatus = 'upcoming'): Booking {
  const start = new Date(NOW.getTime() + offsetHours * 60 * 60 * 1000);
  const time = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`;

  return {
    id: 'booking-test',
    mentorId: 'm1',
    menteeId: 'mentee-1',
    mentorshipId: 'ms1',
    date: start,
    time,
    duration: 60,
    status,
    objective: 'Objetivo de prueba',
    context: 'Contexto de prueba',
  };
}

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingService);
  });

  describe('getSessionStart', () => {
    it('combines the booking date with its HH:mm time', () => {
      const start = service.getSessionStart({ date: new Date(2026, 7, 20), time: '19:30' });
      expect(start.getFullYear()).toBe(2026);
      expect(start.getMonth()).toBe(7);
      expect(start.getDate()).toBe(20);
      expect(start.getHours()).toBe(19);
      expect(start.getMinutes()).toBe(30);
    });
  });

  describe('hoursUntil', () => {
    it('is positive for future sessions and negative for past ones', () => {
      expect(service.hoursUntil(bookingAt(48), NOW)).toBeCloseTo(48, 5);
      expect(service.hoursUntil(bookingAt(-3), NOW)).toBeCloseTo(-3, 5);
    });
  });

  describe('getCancellationPolicy', () => {
    it('allows free cancellation more than 24h before the session', () => {
      const policy = service.getCancellationPolicy(bookingAt(48), NOW);
      expect(policy.canCancel).toBe(true);
      expect(policy.canReschedule).toBe(true);
      expect(policy.requiresMentorApproval).toBe(false);
    });

    it('blocks cancellation within 24h but still allows a mentor-approved reschedule', () => {
      const policy = service.getCancellationPolicy(bookingAt(5), NOW);
      expect(policy.canCancel).toBe(false);
      expect(policy.canReschedule).toBe(true);
      expect(policy.requiresMentorApproval).toBe(true);
    });

    it('treats exactly 24h out as inside the restricted window', () => {
      const policy = service.getCancellationPolicy(bookingAt(CANCELLATION_WINDOW_HOURS), NOW);
      expect(policy.canCancel).toBe(false);
      expect(policy.requiresMentorApproval).toBe(true);
    });

    it('allows cancellation just outside the window', () => {
      expect(service.getCancellationPolicy(bookingAt(24.5), NOW).canCancel).toBe(true);
    });

    it('applies the same rule to free sessions', () => {
      // The policy never inspects price, so a free booking behaves identically.
      const free = { ...bookingAt(5), mentorshipId: 'ms-free' };
      expect(service.getCancellationPolicy(free, NOW).canCancel).toBe(false);
    });

    it('offers no actions once the session has started', () => {
      const policy = service.getCancellationPolicy(bookingAt(-1), NOW);
      expect(policy.canCancel).toBe(false);
      expect(policy.canReschedule).toBe(false);
    });

    it('offers no actions for completed sessions', () => {
      const policy = service.getCancellationPolicy(bookingAt(48, 'completed'), NOW);
      expect(policy.canCancel).toBe(false);
      expect(policy.canReschedule).toBe(false);
      expect(policy.reason).toContain('ya se realizó');
    });

    it('offers no actions for already cancelled sessions', () => {
      const policy = service.getCancellationPolicy(bookingAt(48, 'cancelled'), NOW);
      expect(policy.canCancel).toBe(false);
      expect(policy.canReschedule).toBe(false);
      expect(policy.reason).toContain('ya fue cancelada');
    });
  });

  describe('cancel', () => {
    it('marks a booking cancelled when outside the window', () => {
      const result = service.cancel(bookingAt(48), NOW);
      expect(result?.status).toBe('cancelled');
    });

    it('refuses to cancel inside the window', () => {
      expect(service.cancel(bookingAt(3), NOW)).toBeNull();
    });

    it('does not mutate the original booking', () => {
      const original = bookingAt(48);
      service.cancel(original, NOW);
      expect(original.status).toBe('upcoming');
    });
  });

  describe('reschedule', () => {
    it('moves a booking to a new future slot', () => {
      const target = new Date(2026, 7, 20);
      const result = service.reschedule(bookingAt(48), target, '17:00', NOW);
      expect(result?.time).toBe('17:00');
      expect(result?.date).toBe(target);
      expect(result?.status).toBe('upcoming');
    });

    it('allows rescheduling inside the 24h window (mentor approval required)', () => {
      const target = new Date(2026, 7, 25);
      expect(service.reschedule(bookingAt(5), target, '10:00', NOW)).not.toBeNull();
    });

    it('rejects a slot in the past', () => {
      const target = new Date(2026, 7, 1);
      expect(service.reschedule(bookingAt(48), target, '10:00', NOW)).toBeNull();
    });

    it('rejects rescheduling a completed session', () => {
      const target = new Date(2026, 7, 20);
      expect(service.reschedule(bookingAt(48, 'completed'), target, '10:00', NOW)).toBeNull();
    });
  });
});
