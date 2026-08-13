import { Component, inject, OnDestroy } from '@angular/core';
import { Notification, NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'nx-toast',
  standalone: true,
  template: `
    <!-- The live region must exist before a message arrives, so it lives on the
         container rather than on each toast. -->
    <div
      class="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
      role="status"
      aria-live="polite"
      aria-atomic="false"
    >
      @for (notification of notifications(); track notification.id) {
        <div
          class="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-card-sm shadow-soft-lg border-l-4 animate-slide-up"
          [class]="getToastClass(notification.type)"
        >
          <div class="flex-shrink-0 mt-0.5">
            @switch (notification.type) {
              @case ('success') {
                <svg class="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              }
              @case ('error') {
                <svg class="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              }
              @case ('info') {
                <svg class="w-5 h-5 text-nexo-violet" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              }
            }
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-ink dark:text-dark-text">{{ notification.title }}</p>
            @if (notification.message) {
              <p class="text-xs text-muted-text dark:text-dark-muted mt-0.5">{{ notification.message }}</p>
            }
          </div>
          <button
            type="button"
            class="flex-shrink-0 text-muted-text hover:text-ink dark:hover:text-dark-text transition-colors"
            (click)="dismiss(notification.id)"
            aria-label="Cerrar notificación"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class ToastComponent implements OnDestroy {
  private notificationService = inject(NotificationService);
  private timers = new Map<string, ReturnType<typeof setTimeout>>();

  notifications = this.notificationService.notifications;

  getToastClass(type: Notification['type']): string {
    const base = 'bg-white dark:bg-dark-surface border-surface dark:border-dark-surface-high';
    switch (type) {
      case 'success':
        return `${base} border-l-emerald-500`;
      case 'error':
        return `${base} border-l-red-500`;
      case 'info':
        return `${base} border-l-nexo-violet`;
      default:
        return base;
    }
  }

  constructor() {
    this.notifications().forEach(n => this.scheduleRemoval(n.id));
  }

  dismiss(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this.notificationService.removeNotification(id);
  }

  private scheduleRemoval(id: string): void {
    const timer = setTimeout(() => {
      this.notificationService.removeNotification(id);
      this.timers.delete(id);
    }, 3000);
    this.timers.set(id, timer);
  }

  ngOnDestroy(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
  }
}
