import { Component, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from '../../shared/ui/navbar.component';
import { FooterComponent } from '../../shared/ui/footer.component';
import { ToastComponent } from '../../shared/ui/toast.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastComponent],
  template: `
    <a
      href="#contenido"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-5 focus:py-3 focus:bg-nexo-violet focus:text-white focus:rounded-pill focus:font-semibold focus:shadow-soft-lg"
    >
      Saltar al contenido
    </a>

    <div class="min-h-screen flex flex-col">
      <nx-navbar />
      <main id="contenido" class="flex-1 pt-16">
        <div class="route-shell" [class.route-enter]="entering()">
          <router-outlet />
        </div>
      </main>
      <nx-footer />
      <nx-toast />
    </div>
  `,
  styles: `
    /* Content is visible by default so server-rendered HTML is never blank and
       the page stays readable if hydration never happens. The editorial enter
       animation is layered on top, in the browser only. */
    .route-shell {
      opacity: 1;
    }

    .route-shell.route-enter {
      animation: route-enter 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    @keyframes route-enter {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .route-shell.route-enter {
        animation: none;
      }
    }
  `,
})
export class PublicLayoutComponent {
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly entering = signal(false);

  constructor() {
    if (!this.isBrowser) return;

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        // Restart the animation on each navigation: drop the class, then re-add
        // it on the next frame so the browser replays the keyframes.
        this.entering.set(false);
        requestAnimationFrame(() => this.entering.set(true));
      });
  }
}
