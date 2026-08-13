import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/public-layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
        data: {
          seo: {
            title: 'NEXO — Encuentra a quien ya recorrió tu camino',
            description:
              'Conecta con mentores que ya lograron lo que tú quieres conseguir. Reserva una sesión y convierte su experiencia en objetivos, tareas y progreso real.',
            path: '/',
          }
        }
      },
      {
        path: 'explorar',
        loadComponent: () => import('./features/mentors/mentors.component').then(m => m.MentorsComponent),
        data: {
          seo: {
            title: 'Explorar mentores | NEXO',
            description:
              'Filtra por categoría, objetivo, experiencia y valoración para encontrar al mentor que ya recorrió el camino que tú quieres empezar.',
            path: '/explorar',
          }
        }
      },
      {
        // The profile sets its own metadata from the mentor it renders.
        path: 'mentor/:id',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'mentor/:id/reservar',
        loadComponent: () => import('./features/booking/booking.component').then(m => m.BookingComponent),
        canActivate: [authGuard]
      },
      {
        path: 'como-funciona',
        loadComponent: () => import('./features/how-it-works/how-it-works.component').then(m => m.HowItWorksComponent),
        data: {
          seo: {
            title: 'Cómo funciona | NEXO',
            description:
              'Descubre cómo NEXO te conecta con un mentor con experiencia real y cómo el acompañamiento continúa después de la sesión con objetivos, tareas y seguimiento.',
            path: '/como-funciona',
          }
        }
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent),
        data: {
          seo: {
            title: 'Entrar | NEXO',
            description: 'Accede a tu cuenta de NEXO para continuar con tus mentorías y tu progreso.',
            path: '/login',
          }
        }
      },
      {
        path: 'registro',
        loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent),
        data: {
          seo: {
            title: 'Crear cuenta | NEXO',
            description: 'Crea tu cuenta en NEXO como mentee o como mentor y empieza a avanzar hacia tu objetivo.',
            path: '/registro',
          }
        }
      },
      {
        path: 'recuperar-contrasena',
        loadComponent: () => import('./features/auth/forgot-password.component').then(m => m.ForgotPasswordComponent)
      }
    ]
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./layouts/public-layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: 'mentee',
        loadComponent: () => import('./features/onboarding/onboarding.component').then(m => m.OnboardingComponent)
      },
      {
        path: 'mentor',
        loadComponent: () => import('./features/onboarding/onboarding.component').then(m => m.OnboardingComponent)
      }
    ]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./layouts/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard-mentee/dashboard-mentee.component').then(m => m.DashboardMenteeComponent),
        canActivate: [roleGuard],
        data: { role: 'mentee' }
      },
      {
        path: 'sesion/:id',
        loadComponent: () => import('./features/dashboard-mentee/session-detail.component').then(m => m.SessionDetailComponent),
        canActivate: [authGuard]
      },
      {
        path: 'tareas',
        loadComponent: () => import('./features/dashboard-mentee/tasks.component').then(m => m.TasksComponent),
        canActivate: [authGuard]
      },
      {
        path: 'objetivos',
        loadComponent: () => import('./features/dashboard-mentee/goals.component').then(m => m.GoalsComponent),
        canActivate: [authGuard]
      },
      {
        path: 'mentor',
        loadComponent: () => import('./features/dashboard-mentor/dashboard-mentor.component').then(m => m.DashboardMentorComponent),
        canActivate: [roleGuard],
        data: { role: 'mentor' }
      },
      {
        path: 'mentor/mentees',
        loadComponent: () => import('./features/dashboard-mentor/mentees-management.component').then(m => m.MenteesManagementComponent),
        canActivate: [roleGuard],
        data: { role: 'mentor' }
      },
      {
        path: 'mentor/seguimientos',
        loadComponent: () => import('./features/dashboard-mentor/follow-ups.component').then(m => m.FollowUpsComponent),
        canActivate: [roleGuard],
        data: { role: 'mentor' }
      },
      {
        path: 'mentor/disponibilidad',
        loadComponent: () => import('./features/dashboard-mentor/availability-management.component').then(m => m.AvailabilityManagementComponent),
        canActivate: [roleGuard],
        data: { role: 'mentor' }
      },
      {
        path: 'mentor/mentorias',
        loadComponent: () => import('./features/dashboard-mentor/mentorship-management.component').then(m => m.MentorshipManagementComponent),
        canActivate: [roleGuard],
        data: { role: 'mentor' }
      }
    ]
  },
  {
    path: 'progreso',
    loadComponent: () => import('./layouts/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard-mentee/progress.component').then(m => m.MenteeProgressComponent)
      }
    ]
  },
  {
    path: 'mentorias',
    loadComponent: () => import('./layouts/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/mentorship/mentorship.component').then(m => m.MentorshipComponent)
      }
    ]
  },
  {
    path: 'workspace',
    loadComponent: () => import('./layouts/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard-mentee/workspace.component').then(m => m.WorkspaceComponent)
      }
    ]
  },
  {
    path: 'configuracion',
    loadComponent: () => import('./layouts/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },
  {
    path: 'guardados',
    loadComponent: () => import('./layouts/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard-mentee/saved-mentors.component').then(m => m.SavedMentorsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
