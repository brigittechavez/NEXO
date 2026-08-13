import { Injectable } from '@angular/core';
import { Booking } from '../models/booking.model';

/**
 * Free cancellation window, in hours (requisito §33).
 *
 * Applies to paid *and* free sessions alike — a free slot still occupies real
 * time in the mentor's calendar.
 */
export const CANCELLATION_WINDOW_HOURS = 24;

export interface CancellationPolicy {
  /** Cancel from the platform, no penalty. */
  canCancel: boolean;
  /** Move the session to another slot. */
  canReschedule: boolean;
  /** Inside the window: the mentor has to agree to a reschedule. */
  requiresMentorApproval: boolean;
  /** Hours left until the session starts. Negative once it has started. */
  hoursUntilSession: number;
  /** Short, user-facing explanation of the applicable rule. */
  reason: string;
}

/**
 * Booking rules — cancellation and rescheduling.
 *
 * Kept free of Angular/DOM specifics so it can be unit tested with an injected
 * "now", and so the same rules can back a real API later.
 */
@Injectable({ providedIn: 'root' })
export class BookingService {
  /** Absolute start instant of a booking, combining its date and `HH:mm` time. */
  getSessionStart(booking: Pick<Booking, 'date' | 'time'>): Date {
    const [hours, minutes] = booking.time.split(':').map(Number);
    const start = new Date(booking.date);
    start.setHours(hours || 0, minutes || 0, 0, 0);
    return start;
  }

  /** Hours between `now` and the session start. Negative if already started. */
  hoursUntil(booking: Pick<Booking, 'date' | 'time'>, now: Date = new Date()): number {
    const diffMs = this.getSessionStart(booking).getTime() - now.getTime();
    return diffMs / (1000 * 60 * 60);
  }

  /**
   * Resolve the cancellation/reschedule rules for a booking.
   *
   * - More than 24 h out: cancel or reschedule freely.
   * - 24 h or less: no self-service cancellation; rescheduling needs the mentor.
   * - Already started, completed or cancelled: no actions left.
   */
  getCancellationPolicy(
    booking: Pick<Booking, 'date' | 'time' | 'status'>,
    now: Date = new Date()
  ): CancellationPolicy {
    const hoursUntilSession = this.hoursUntil(booking, now);

    if (booking.status === 'cancelled') {
      return {
        canCancel: false,
        canReschedule: false,
        requiresMentorApproval: false,
        hoursUntilSession,
        reason: 'Esta sesión ya fue cancelada.',
      };
    }

    if (booking.status === 'completed') {
      return {
        canCancel: false,
        canReschedule: false,
        requiresMentorApproval: false,
        hoursUntilSession,
        reason: 'Esta sesión ya se realizó.',
      };
    }

    if (hoursUntilSession <= 0) {
      return {
        canCancel: false,
        canReschedule: false,
        requiresMentorApproval: false,
        hoursUntilSession,
        reason: 'La sesión ya comenzó.',
      };
    }

    if (hoursUntilSession > CANCELLATION_WINDOW_HOURS) {
      return {
        canCancel: true,
        canReschedule: true,
        requiresMentorApproval: false,
        hoursUntilSession,
        reason: `Puedes cancelar o reprogramar sin costo hasta ${CANCELLATION_WINDOW_HOURS} horas antes.`,
      };
    }

    return {
      canCancel: false,
      canReschedule: true,
      requiresMentorApproval: true,
      hoursUntilSession,
      reason:
        `Faltan menos de ${CANCELLATION_WINDOW_HOURS} horas: ya no puedes cancelar desde la ` +
        'plataforma. Puedes solicitar una reprogramación y tu mentor decide si la acepta.',
    };
  }

  /** Convenience wrapper used by templates. */
  canCancel(booking: Pick<Booking, 'date' | 'time' | 'status'>, now: Date = new Date()): boolean {
    return this.getCancellationPolicy(booking, now).canCancel;
  }

  /**
   * Cancel a booking. Returns the updated booking, or `null` when the policy
   * forbids it — callers must surface the policy `reason` in that case.
   */
  cancel(booking: Booking, now: Date = new Date()): Booking | null {
    if (!this.getCancellationPolicy(booking, now).canCancel) return null;
    return { ...booking, status: 'cancelled' };
  }

  /**
   * Move a booking to a new slot. Returns the updated booking, or `null` when
   * rescheduling is not allowed or the requested slot is in the past.
   */
  reschedule(booking: Booking, date: Date, time: string, now: Date = new Date()): Booking | null {
    if (!this.getCancellationPolicy(booking, now).canReschedule) return null;

    const candidate = { ...booking, date, time };
    if (this.hoursUntil(candidate, now) <= 0) return null;

    return candidate;
  }
}
