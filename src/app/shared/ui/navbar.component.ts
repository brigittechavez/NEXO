import { Component, signal, inject, PLATFORM_ID, afterNextRender } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LogoComponent } from './logo.component';
import { ThemeSwitcherComponent } from './theme-switcher.component';

@Component({
  selector: 'nx-navbar',
  standalone: true,
  imports: [RouterLink, LogoComponent, ThemeSwitcherComponent],
  template: `
    <nav
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      [class]="navClasses()"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 md:h-18">
          <a routerLink="/" class="flex items-center gap-2 group" (click)="closeMobileMenu()">
            <app-logo variant="mark" [height]="28" alt="" [priority]="true" />
            <span class="font-serif text-xl font-bold text-ink dark:text-dark-text">NEXO</span>
          </a>

          <div class="hidden md:flex items-center gap-8">
            <a
              routerLink="/explorar"
              class="text-sm font-medium text-muted-text hover:text-ink dark:hover:text-dark-text transition-colors duration-200"
            >
              Explorar
            </a>
            <a
              routerLink="/como-funciona"
              class="text-sm font-medium text-muted-text hover:text-ink dark:hover:text-dark-text transition-colors duration-200"
            >
              Cómo funciona
            </a>
          </div>

          <div class="hidden md:flex items-center gap-3">
            <nx-theme-switcher />
            <a
              routerLink="/login"
              class="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-nexo-violet rounded-pill transition-all duration-200 hover:bg-electric-indigo hover:shadow-soft-md active:scale-[0.98]"
            >
              Entrar
            </a>
          </div>

          <button
            type="button"
            class="md:hidden relative inline-flex items-center justify-center w-10 h-10 rounded-full text-muted-text hover:text-ink dark:hover:text-dark-text hover:bg-surface dark:hover:bg-dark-surface-high transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexo-violet"
            (click)="toggleMobileMenu()"
            [attr.aria-expanded]="mobileMenuOpen()"
            aria-label="Menu"
          >
            @if (!mobileMenuOpen()) {
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            }
          </button>
        </div>
      </div>

      @if (mobileMenuOpen()) {
        <div
          class="md:hidden fixed inset-0 top-16 bg-off-white/98 dark:bg-dark-bg/98 backdrop-blur-sm z-40 animate-fade-in"
          (click)="closeMobileMenu()"
        >
          <div class="flex flex-col items-center justify-center gap-8 pt-20">
            <a
              routerLink="/explorar"
              class="text-2xl font-serif font-bold text-ink dark:text-dark-text hover:text-nexo-violet dark:hover:text-nexo-violet transition-colors duration-200"
              (click)="closeMobileMenu()"
            >
              Explorar
            </a>
            <a
              routerLink="/como-funciona"
              class="text-2xl font-serif font-bold text-ink dark:text-dark-text hover:text-nexo-violet dark:hover:text-nexo-violet transition-colors duration-200"
              (click)="closeMobileMenu()"
            >
              Cómo funciona
            </a>
            <div class="flex flex-col items-center gap-4 mt-4">
              <nx-theme-switcher />
              <a
                routerLink="/login"
                class="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-nexo-violet rounded-pill transition-all duration-200 hover:bg-electric-indigo hover:shadow-soft-md active:scale-[0.98]"
                (click)="closeMobileMenu()"
              >
                Entrar
              </a>
            </div>
          </div>
        </div>
      }
    </nav>
  `,
})
export class NavbarComponent {
  private readonly platformId = inject(PLATFORM_ID);

  readonly scrolled = signal(false);
  readonly mobileMenuOpen = signal(false);

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        const onScroll = () => {
          this.scrolled.set(window.scrollY > 20);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      }
    });
  }

  navClasses(): string {
    const scrolled = this.scrolled();
    return [
      scrolled
        ? 'bg-off-white/90 dark:bg-dark-bg/90 backdrop-blur-md shadow-soft-sm border-b border-surface dark:border-dark-surface'
        : 'bg-transparent',
    ].join(' ');
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
