import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CardComponent } from '../../shared/ui/card.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { BadgeComponent } from '../../shared/ui/badge.component';

interface TimeSlot {
  hour: number;
  label: string;
  enabled: boolean;
}

interface DaySchedule {
  day: string;
  dayShort: string;
  slots: TimeSlot[];
  enabled: boolean;
}

interface BlockedDay {
  date: Date;
  reason: string;
}

@Component({
  selector: 'app-availability-management',
  standalone: true,
  imports: [FormsModule, DatePipe, CardComponent, ButtonComponent, BadgeComponent],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-ink dark:text-dark-text">Disponibilidad</h1>
        <p class="text-sm text-muted-text dark:text-dark-muted mt-1">Configura tu horario semanal para que los alumnos puedan agendar sesiones</p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 p-1 bg-surface dark:bg-dark-surface-high rounded-pill mb-6 max-w-sm">
        <button
          class="flex-1 px-4 py-2 text-sm font-semibold rounded-pill transition-all duration-200"
          [class]="activeTab() === 'schedule' ? 'bg-white dark:bg-dark-surface text-ink dark:text-dark-text shadow-soft-sm' : 'text-muted-text dark:text-dark-muted hover:text-ink dark:hover:text-dark-text'"
          (click)="activeTab.set('schedule')"
        >
          Horario semanal
        </button>
        <button
          class="flex-1 px-4 py-2 text-sm font-semibold rounded-pill transition-all duration-200"
          [class]="activeTab() === 'exceptions' ? 'bg-white dark:bg-dark-surface text-ink dark:text-dark-text shadow-soft-sm' : 'text-muted-text dark:text-dark-muted hover:text-ink dark:hover:text-dark-text'"
          (click)="activeTab.set('exceptions')"
        >
          Excepciones
        </button>
      </div>

      <!-- Weekly Schedule -->
      @if (activeTab() === 'schedule') {
        <nx-card [hover]="false">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-lg font-bold text-ink dark:text-dark-text">Horario semanal recurrente</h3>
            <nx-button size="sm" variant="primary" (clicked)="saveSchedule()">Guardar cambios</nx-button>
          </div>
          <p class="text-sm text-muted-text dark:text-dark-muted mb-6">
            Activa o desactiva bloques de tiempo para cada día. Los alumnos solo podran agendar en horarios disponibles.
          </p>

          <!-- Day cards -->
          <div class="space-y-4">
            @for (day of schedule(); track day.day) {
              <div class="border border-surface dark:border-dark-surface-high rounded-xl p-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <button
                      class="relative w-11 h-6 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-nexo-violet focus:ring-offset-2"
                      [class]="day.enabled ? 'bg-nexo-violet' : 'bg-surface dark:bg-dark-surface-high'"
                      (click)="toggleDay(day.day)"
                    >
                      <span
                        class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
                        [style.transform]="day.enabled ? 'translateX(20px)' : 'translateX(0)'"
                      ></span>
                    </button>
                    <span class="font-semibold text-ink dark:text-dark-text">{{ day.day }}</span>
                    @if (getActiveSlotCount(day) > 0) {
                      <nx-badge variant="lavender" size="sm">{{ getActiveSlotCount(day) }} bloques</nx-badge>
                    }
                  </div>
                </div>

                @if (day.enabled) {
                  <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 ml-14">
                    @for (slot of day.slots; track slot.hour) {
                      <button
                        class="px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 text-center"
                        [class]="slot.enabled
                          ? 'bg-nexo-violet text-white'
                          : 'bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted hover:bg-nexo-violet/10'"
                        (click)="toggleSlot(day.day, slot.hour)"
                      >
                        {{ slot.label }}
                      </button>
                    }
                  </div>
                }
              </div>
            }
          </div>

          <!-- Quick actions -->
          <div class="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-surface dark:border-dark-surface-high">
            <span class="text-sm text-muted-text dark:text-dark-muted mr-2">Acciones rapidas:</span>
            <nx-button size="sm" variant="ghost" (clicked)="setWeekdayEvenings()">Lunes a viernes noches</nx-button>
            <nx-button size="sm" variant="ghost" (clicked)="setWeekendMornings()">Sabados mananas</nx-button>
            <nx-button size="sm" variant="ghost" (clicked)="clearAll()">Limpiar todo</nx-button>
          </div>
        </nx-card>
      }

      <!-- Exceptions -->
      @if (activeTab() === 'exceptions') {
        <div class="space-y-6">
          <!-- Add blocked day -->
          <nx-card [hover]="false">
            <h3 class="text-lg font-bold text-ink dark:text-dark-text mb-4">Agregar excepcion</h3>
            <p class="text-sm text-muted-text dark:text-dark-muted mb-4">
              Bloquea dias especiales (feriados, vacaciones) o agrega horas extraordinarias
            </p>
            <div class="flex flex-col sm:flex-row gap-3">
              <div class="flex-1">
                <input
                  type="date"
                  [(ngModel)]="newException.date"
                  class="w-full px-4 py-2.5 rounded-pill border border-surface dark:border-dark-surface-high bg-white dark:bg-dark-surface text-ink dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-nexo-violet focus:border-transparent"
                />
              </div>
              <select
                [(ngModel)]="newException.type"
                class="px-4 py-2.5 rounded-pill border border-surface dark:border-dark-surface-high bg-white dark:bg-dark-surface text-ink dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-nexo-violet focus:border-transparent"
              >
                <option value="blocked">Dia bloqueado</option>
                <option value="extra">Horas extra</option>
              </select>
              <input
                type="text"
                [(ngModel)]="newException.reason"
                placeholder="Motivo (opcional)"
                class="flex-1 px-4 py-2.5 rounded-pill border border-surface dark:border-dark-surface-high bg-white dark:bg-dark-surface text-ink dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-nexo-violet focus:border-transparent"
              />
              <nx-button size="md" variant="primary" (clicked)="addException()">Agregar</nx-button>
            </div>
          </nx-card>

          <!-- Blocked days list -->
          <nx-card [hover]="false">
            <h3 class="text-lg font-bold text-ink dark:text-dark-text mb-4">Dias bloqueados</h3>
            @if (blockedDays().length === 0) {
              <div class="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted-text/40 mx-auto mb-2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <p class="text-muted-text dark:text-dark-muted text-sm">No hay dias bloqueados</p>
              </div>
            } @else {
              <div class="space-y-2">
                @for (bd of blockedDays(); track bd.date.toISOString()) {
                  <div class="flex items-center justify-between p-3 rounded-xl bg-surface/50 dark:bg-dark-surface-high/50">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-red-500">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-ink dark:text-dark-text">{{ bd.date | date:'dd MMMM yyyy' }}</p>
                        @if (bd.reason) {
                          <p class="text-xs text-muted-text dark:text-dark-muted">{{ bd.reason }}</p>
                        }
                      </div>
                    </div>
                    <button
                      class="text-muted-text hover:text-red-500 transition-colors"
                      (click)="removeException(bd.date)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                }
              </div>
            }
          </nx-card>
        </div>
      }
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class AvailabilityManagementComponent {
  protected readonly activeTab = signal<'schedule' | 'exceptions'>('schedule');

  protected readonly schedule = signal<DaySchedule[]>([
    { day: 'Lunes', dayShort: 'L', enabled: true, slots: this.generateSlots(8, 21) },
    { day: 'Martes', dayShort: 'M', enabled: true, slots: this.generateSlots(8, 21) },
    { day: 'Miercoles', dayShort: 'X', enabled: true, slots: this.generateSlots(8, 21) },
    { day: 'Jueves', dayShort: 'J', enabled: true, slots: this.generateSlots(8, 21) },
    { day: 'Viernes', dayShort: 'V', enabled: false, slots: this.generateSlots(8, 21) },
    { day: 'Sabado', dayShort: 'S', enabled: true, slots: this.generateSlots(9, 14) },
    { day: 'Domingo', dayShort: 'D', enabled: false, slots: this.generateSlots(9, 14) },
  ]);

  protected readonly blockedDays = signal<BlockedDay[]>([
    { date: new Date('2025-09-15'), reason: 'Fiestas Patrias' },
    { date: new Date('2025-10-08'), reason: 'Batalla de Angamos' },
  ]);

  protected newException = {
    date: '',
    type: 'blocked' as 'blocked' | 'extra',
    reason: '',
  };

  protected generateSlots(start: number, end: number): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const preEnabled = [18, 19, 20];
    for (let h = start; h < end; h++) {
      slots.push({
        hour: h,
        label: `${h.toString().padStart(2, '0')}:00`,
        enabled: preEnabled.includes(h),
      });
    }
    return slots;
  }

  protected toggleDay(dayName: string): void {
    this.schedule.update(s =>
      s.map(d => d.day === dayName ? { ...d, enabled: !d.enabled } : d)
    );
  }

  protected toggleSlot(dayName: string, hour: number): void {
    this.schedule.update(s =>
      s.map(d =>
        d.day === dayName
          ? { ...d, slots: d.slots.map(sl => sl.hour === hour ? { ...sl, enabled: !sl.enabled } : sl) }
          : d
      )
    );
  }

  protected getActiveSlotCount(day: DaySchedule): number {
    return day.slots.filter(s => s.enabled).length;
  }

  protected setWeekdayEvenings(): void {
    this.schedule.update(s =>
      s.map(d => ({
        ...d,
        enabled: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'].includes(d.day),
        slots: d.slots.map(sl => ({
          ...sl,
          enabled: sl.hour >= 18 && sl.hour <= 20,
        })),
      }))
    );
  }

  protected setWeekendMornings(): void {
    this.schedule.update(s =>
      s.map(d => ({
        ...d,
        enabled: ['Sabado', 'Domingo'].includes(d.day),
        slots: d.slots.map(sl => ({
          ...sl,
          enabled: sl.hour >= 9 && sl.hour <= 12,
        })),
      }))
    );
  }

  protected clearAll(): void {
    this.schedule.update(s =>
      s.map(d => ({
        ...d,
        enabled: false,
        slots: d.slots.map(sl => ({ ...sl, enabled: false })),
      }))
    );
  }

  protected addException(): void {
    if (!this.newException.date) return;
    const date = new Date(this.newException.date);
    this.blockedDays.update(bds => [...bds, { date, reason: this.newException.reason }]);
    this.newException = { date: '', type: 'blocked', reason: '' };
  }

  protected removeException(date: Date): void {
    this.blockedDays.update(bds => bds.filter(bd => bd.date.getTime() !== date.getTime()));
  }

  protected saveSchedule(): void {
    // Mock save
  }
}
