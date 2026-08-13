import { Component, inject } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'nx-theme-switcher',
  standalone: true,
  template: `
    <button
      type="button"
      (click)="themeService.toggleTheme()"
      class="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted hover:text-ink dark:hover:text-dark-text transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexo-violet focus-visible:ring-offset-2 focus-visible:ring-offset-off-white"
      [attr.aria-label]="themeService.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      @if (themeService.theme() === 'dark') {
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      } @else {
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      }
    </button>
  `,
})
export class ThemeSwitcherComponent {
  protected readonly themeService = inject(ThemeService);
}
