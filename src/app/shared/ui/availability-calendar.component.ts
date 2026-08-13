import { Component, input, output, signal, HostBinding } from '@angular/core';
import { Availability } from '../../core/models/mentor.model';

@Component({
  selector: 'nx-availability-calendar',
  standalone: true,
  template: `
    <div>
      <h3 class="font-heading font-bold text-ink dark:text-dark-text text-xl mb-2">
        Próximos slots disponibles
      </h3>
      <p class="text-sm text-muted-text dark:text-dark-muted mb-6">
        Elige un horario que te funcione
      </p>

      <div class="space-y-4">
        @for (slot of availability(); track slot.day) {
          <div class="bg-white dark:bg-dark-surface rounded-card-lg p-4 border border-surface/50 dark:border-dark-surface-high/50">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-semibold text-ink dark:text-dark-text">{{ slot.day }}</h4>
              <span class="text-xs text-muted-text dark:text-dark-muted">
                {{ slot.startTime }} - {{ slot.endTime }}
              </span>
            </div>
            <div class="flex flex-wrap gap-2">
              @for (time of generateSlots(slot); track time) {
                <button
                  class="px-3 py-1.5 text-sm font-medium rounded-pill border transition-all duration-200"
                  [class]="isSelected(slot.day, time)
                    ? 'bg-nexo-violet text-white border-nexo-violet'
                    : 'bg-surface/50 dark:bg-dark-surface-high/50 text-ink dark:text-dark-text border-transparent hover:border-nexo-violet/30 hover:bg-nexo-violet/5'"
                  (click)="selectSlot(slot.day, time)"
                >
                  {{ time }}
                </button>
              }
            </div>
          </div>
        }
      </div>

      @if (availability().length === 0) {
        <div class="text-center py-10 bg-surface/30 dark:bg-dark-surface-high/30 rounded-card-lg">
          <svg class="w-12 h-12 text-muted-text/40 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <p class="text-muted-text dark:text-dark-muted text-sm">No hay horarios disponibles por el momento</p>
        </div>
      }
    </div>
  `,
})
export class AvailabilityCalendarComponent {
  availability = input.required<Availability[]>();
  slotSelected = output<{ day: string; time: string }>();

  protected readonly selectedSlot = signal<{ day: string; time: string } | null>(null);

  protected isSelected(day: string, time: string): boolean {
    const sel = this.selectedSlot();
    return sel?.day === day && sel?.time === time;
  }

  protected selectSlot(day: string, time: string): void {
    this.selectedSlot.set({ day, time });
    this.slotSelected.emit({ day, time });
  }

  protected generateSlots(slot: Availability): string[] {
    const [startH] = slot.startTime.split(':').map(Number);
    const [endH] = slot.endTime.split(':').map(Number);
    const slots: string[] = [];
    for (let h = startH; h < endH; h++) {
      slots.push(`${String(h).padStart(2, '0')}:00`);
      if (h + 1 < endH || endH - startH > 1) {
        slots.push(`${String(h).padStart(2, '0')}:30`);
      }
    }
    return slots;
  }

  @HostBinding('class')
  get hostClasses(): string {
    return 'block';
  }
}
