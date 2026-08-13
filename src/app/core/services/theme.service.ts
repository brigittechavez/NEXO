import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'nexo-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    // Runs in an injection context, so `effect()` is valid here. Guarded so the
    // server never touches `document` / `localStorage`.
    if (!this.isBrowser) return;

    effect(() => {
      const currentTheme = this.theme();
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(currentTheme);
      root.style.colorScheme = currentTheme;
      try {
        localStorage.setItem(STORAGE_KEY, currentTheme);
      } catch {
        // Storage unavailable (private mode / quota) — theme still applies for this session.
      }
    });
  }

  toggleTheme(): void {
    this.theme.update(current => (current === 'light' ? 'dark' : 'light'));
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  private getInitialTheme(): Theme {
    if (!isPlatformBrowser(this.platformId)) return 'light';

    // The inline script in index.html already resolved and applied the theme
    // before first paint; mirror whatever it decided to avoid a mismatch.
    const applied = document.documentElement.classList.contains('dark') ? 'dark' : null;
    if (applied) return applied;

    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // Ignore and fall through to the system preference.
    }

    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
