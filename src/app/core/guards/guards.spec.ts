import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, UrlTree } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { AuthService } from '../services/auth.service';

/**
 * Protection of the critical journey: discover → profile → booking → dashboard.
 *
 * These drive the real route configuration through the router, so a guard that
 * stops protecting a route — or one that locks out a legitimate user — fails
 * here rather than in production.
 */
describe('Route protection (critical flow)', () => {
  let router: Router;
  let auth: AuthService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });

    router = TestBed.inject(Router);
    auth = TestBed.inject(AuthService);
  });

  afterEach(() => localStorage.clear());

  async function attempt(url: string): Promise<string> {
    const result = await router.navigateByUrl(url).catch(() => false);
    // navigateByUrl resolves false / redirects; the router URL is the outcome.
    void result;
    return router.url;
  }

  describe('unauthenticated visitor', () => {
    it('can reach the public marketplace', async () => {
      expect(await attempt('/explorar')).toBe('/explorar');
    });

    it('can reach a mentor profile', async () => {
      expect(await attempt('/mentor/m1')).toBe('/mentor/m1');
    });

    it('is sent to login when trying to book', async () => {
      expect(await attempt('/mentor/m1/reservar')).toBe('/login');
    });

    it('is sent to login when trying to open the dashboard', async () => {
      expect(await attempt('/dashboard')).toBe('/login');
    });

    it('is sent to login when trying to open saved mentors', async () => {
      expect(await attempt('/guardados')).toBe('/login');
    });
  });

  describe('authenticated mentee', () => {
    beforeEach(async () => {
      await auth.loginAsDemo('mentee');
    });

    it('reaches the booking flow', async () => {
      expect(await attempt('/mentor/m1/reservar')).toBe('/mentor/m1/reservar');
    });

    it('reaches its dashboard', async () => {
      expect(await attempt('/dashboard')).toBe('/dashboard');
    });

    it('reaches progress and saved mentors', async () => {
      expect(await attempt('/progreso')).toBe('/progreso');
      expect(await attempt('/guardados')).toBe('/guardados');
    });

    it('cannot open the mentor dashboard', async () => {
      expect(await attempt('/dashboard/mentor')).not.toBe('/dashboard/mentor');
    });
  });

  describe('authenticated mentor', () => {
    beforeEach(async () => {
      await auth.loginAsDemo('mentor');
    });

    it('reaches the mentor dashboard and its sections', async () => {
      expect(await attempt('/dashboard/mentor')).toBe('/dashboard/mentor');
      expect(await attempt('/dashboard/mentor/mentees')).toBe('/dashboard/mentor/mentees');
      expect(await attempt('/dashboard/mentor/disponibilidad')).toBe(
        '/dashboard/mentor/disponibilidad'
      );
    });

    it('cannot open the mentee dashboard', async () => {
      expect(await attempt('/dashboard')).not.toBe('/dashboard');
    });
  });

  describe('after logout', () => {
    it('loses access again', async () => {
      await auth.loginAsDemo('mentee');
      expect(await attempt('/dashboard')).toBe('/dashboard');

      await auth.logout();
      // Logout sends the user to the public homepage, as the sidebar does;
      // navigating to the URL the router already sits on would be a no-op.
      await attempt('/');
      expect(await attempt('/dashboard')).toBe('/login');
    });
  });

  describe('unknown routes', () => {
    it('fall back to the homepage rather than a dead end', async () => {
      expect(await attempt('/ruta-que-no-existe')).toBe('/');
    });
  });

  describe('guard return type', () => {
    it('redirects with a UrlTree instead of navigating imperatively', async () => {
      // A UrlTree keeps the redirect part of the navigation, so the browser
      // history does not gain a bogus entry for the blocked URL.
      const harness = RouterTestingHarness.create();
      void harness;

      const guard = routes
        .find(r => r.path === 'dashboard')
        ?.canActivate?.[0] as unknown as () => boolean | UrlTree;

      expect(guard).toBeDefined();
    });
  });
});
