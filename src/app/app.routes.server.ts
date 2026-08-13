import { RenderMode, PrerenderFallback, ServerRoute } from '@angular/ssr';
import { ALL_MENTORS } from './core/data/mentors.data';

/**
 * Rendering strategy (requisito §81).
 *
 * Public, SEO-relevant pages are rendered ahead of the request; private,
 * per-user pages are left to the client. This is the whole hybrid policy — the
 * host only has to serve it (Netlify runs the server bundle as an Edge Function
 * automatically when SSR is enabled).
 *
 *   home · explorar · cómo funciona · auth  → Prerender (catch-all below)
 *   mentor/:id                              → Prerender + SSR fallback
 *   dashboard · progreso · workspace · …    → Client
 */
export const serverRoutes: ServerRoute[] = [
  {
    // The 18 mentors are static data, so every profile ships as real HTML at
    // build time. `fallback` (Server by default) means a mentor added later —
    // once profiles come from Supabase — is still server-rendered on demand
    // instead of 404ing, so this stays correct as the data source changes.
    path: 'mentor/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,
    getPrerenderParams: async () => ALL_MENTORS.map(mentor => ({ id: mentor.id })),
  },

  // Booking is a private, stateful flow behind an auth guard.
  {
    path: 'mentor/:id/reservar',
    renderMode: RenderMode.Client,
  },

  // Everything under /dashboard is per-user. A single pattern keeps new
  // dashboard routes from being prerendered by the catch-all by accident.
  {
    path: 'dashboard/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'progreso',
    renderMode: RenderMode.Client,
  },
  {
    path: 'mentorias',
    renderMode: RenderMode.Client,
  },
  {
    path: 'workspace',
    renderMode: RenderMode.Client,
  },
  {
    path: 'guardados',
    renderMode: RenderMode.Client,
  },
  {
    path: 'configuracion',
    renderMode: RenderMode.Client,
  },

  // Public pages: home, explorar, cómo funciona, login, registro, onboarding.
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
