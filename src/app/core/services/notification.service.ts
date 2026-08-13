import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly notifications = signal<Notification[]>([]);

  private idCounter = 0;

  addNotification(type: Notification['type'], title: string, message?: string): void {
    const id = `toast-${++this.idCounter}`;
    const notification: Notification = { id, type, title, message };
    this.notifications.update(current => [...current, notification]);

    setTimeout(() => this.removeNotification(id), 3000);
  }

  removeNotification(id: string): void {
    this.notifications.update(current => current.filter(n => n.id !== id));
  }

  clearAll(): void {
    this.notifications.set([]);
  }

  success(title: string, message?: string): void {
    this.addNotification('success', title, message);
  }

  error(title: string, message?: string): void {
    this.addNotification('error', title, message);
  }

  info(title: string, message?: string): void {
    this.addNotification('info', title, message);
  }
}
