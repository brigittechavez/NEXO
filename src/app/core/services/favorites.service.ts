import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_KEY = 'nexo_favorites';

/**
 * Saved mentors ("Guardar mentor").
 *
 * Persistence is local for now. When Supabase credentials are configured this
 * is the single place to swap `localStorage` for the `favorites` table — every
 * consumer reads through the `favorites` signal.
 */
@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly favoritesSignal = signal<string[]>(this.read());

  readonly favorites = this.favoritesSignal.asReadonly();

  private read(): string[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
    } catch {
      return [];
    }
  }

  isFavorite(mentorId: string): boolean {
    return this.favoritesSignal().includes(mentorId);
  }

  toggleFavorite(mentorId: string): void {
    this.favoritesSignal.update(current => {
      const exists = current.includes(mentorId);
      const next = exists
        ? current.filter(id => id !== mentorId)
        : [...current, mentorId];
      this.persist(next);
      return next;
    });
  }

  getFavorites(): string[] {
    return this.favoritesSignal();
  }

  private persist(favorites: string[]): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Storage full or unavailable — state still lives in the signal for this session.
    }
  }
}
