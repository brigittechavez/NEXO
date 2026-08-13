import { Component, inject, signal, PLATFORM_ID, afterNextRender, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LogoComponent } from './logo.component';
import { AvatarComponent } from './avatar.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'nx-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LogoComponent, AvatarComponent],
  template: `
    <button
      type="button"
      class="lg:hidden fixed top-4 left-4 z-50 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-dark-surface shadow-soft-sm text-muted-text hover:text-ink dark:hover:text-dark-text transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexo-violet"
      (click)="toggleSidebar()"
      [attr.aria-expanded]="sidebarOpen()"
      aria-controls="nav-principal"
      [attr.aria-label]="sidebarOpen() ? 'Cerrar menú' : 'Abrir menú'"
    >
      @if (!sidebarOpen()) {
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      } @else {
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      }
    </button>

    @if (sidebarOpen()) {
      <div
        class="lg:hidden fixed inset-0 bg-ink/30 dark:bg-black/50 z-30 backdrop-blur-sm"
        (click)="closeSidebar()"
      ></div>
    }

    <!-- Hiding it with visibility when closed on mobile keeps the off-screen
         drawer out of the tab order and the accessibility tree; it becomes
         visible again at lg, where the sidebar is permanent. -->
    <aside
      id="nav-principal"
      class="fixed top-0 left-0 h-full w-64 bg-white dark:bg-dark-surface border-r border-surface dark:border-dark-surface-high z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:visible"
      [class.-translate-x-full]="!sidebarOpen()"
      [class.invisible]="!sidebarOpen()"
      [class.translate-x-0]="sidebarOpen()"
    >
      <div class="flex items-center gap-2 px-6 h-16 border-b border-surface dark:border-dark-surface-high">
        <a routerLink="/" class="flex items-center gap-2">
          <app-logo [size]="24" />
          <span class="font-serif text-lg font-bold text-ink dark:text-dark-text">NEXO</span>
        </a>
      </div>

      <nav class="flex-1 px-3 py-6 space-y-1">
        @for (item of navItems; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-nexo-violet/10 text-nexo-violet dark:bg-nexo-violet/20"
            [routerLinkActiveOptions]="{ exact: item.exact }"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-text hover:text-ink dark:hover:text-dark-text hover:bg-surface dark:hover:bg-dark-surface-high transition-all duration-200"
            (click)="closeSidebar()"
          >
            <span class="flex-shrink-0 w-5 h-5" [innerHTML]="item.icon"></span>
            {{ item.label }}
          </a>
        }
      </nav>

      <div class="border-t border-surface dark:border-dark-surface-high p-4">
        <div class="flex items-center gap-3 mb-3">
          <nx-avatar [name]="userName()" size="sm" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-ink dark:text-dark-text truncate">{{ userName() }}</p>
            <p class="text-xs text-muted-text dark:text-dark-muted truncate">{{ userEmail() }}</p>
          </div>
        </div>
        <button
          type="button"
          class="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-muted-text hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-200"
          (click)="logout()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class SidebarComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly sidebarOpen = signal(false);

  /** Escape closes the mobile drawer, as any overlay is expected to. */
  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.sidebarOpen()) this.sidebarOpen.set(false);
  }

  readonly navItems = [
    {
      route: '/dashboard',
      label: 'Dashboard',
      exact: true,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    },
    {
      route: '/mentorias',
      label: 'Mis mentorías',
      exact: false,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>',
    },
    {
      route: '/progreso',
      label: 'Progreso',
      exact: false,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    },
    {
      route: '/guardados',
      label: 'Guardados',
      exact: false,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>',
    },
    {
      route: '/configuracion',
      label: 'Configuración',
      exact: false,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    },
  ];

  userName = signal('Usuario');
  userEmail = signal('usuario@nexo.com');

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        const user = this.authService.currentUser();
        if (user) {
          this.userName.set(user.name);
          this.userEmail.set(user.email);
        }
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  async logout(): Promise<void> {
    // Await the sign-out before navigating: with Supabase configured this is a
    // real network call, and leaving before it settles would navigate away with
    // the session still open.
    await this.authService.logout();
    await this.router.navigate(['/']);
  }
}
