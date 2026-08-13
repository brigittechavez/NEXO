import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/ui/sidebar.component';
import { ToastComponent } from '../../shared/ui/toast.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, ToastComponent],
  template: `
    <a
      href="#contenido"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-5 focus:py-3 focus:bg-nexo-violet focus:text-white focus:rounded-pill focus:font-semibold focus:shadow-soft-lg"
    >
      Saltar al contenido
    </a>

    <div class="min-h-screen bg-off-white dark:bg-dark-bg">
      <nx-sidebar />
      <div class="lg:pl-64 min-h-screen transition-all duration-300">
        <!-- Extra top padding on small screens leaves room for the fixed menu
             button, which otherwise sits on top of each page heading on mobile. -->
        <main id="contenido" class="p-4 pt-20 sm:p-6 sm:pt-20 md:p-8 md:pt-20 lg:p-10">
          <router-outlet />
        </main>
      </div>
      <nx-toast />
    </div>
  `,
})
export class DashboardLayoutComponent {}
