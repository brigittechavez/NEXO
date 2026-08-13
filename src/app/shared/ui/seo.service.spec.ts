import { TestBed } from '@angular/core/testing';
import { Title, Meta } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { DOCUMENT } from '@angular/core';
import { SeoService } from './seo.service';
import { routes } from '../../app.routes';

describe('SeoService', () => {
  let seo: SeoService;
  let title: Title;
  let meta: Meta;
  let router: Router;
  let document: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });

    seo = TestBed.inject(SeoService);
    title = TestBed.inject(Title);
    meta = TestBed.inject(Meta);
    router = TestBed.inject(Router);
    document = TestBed.inject(DOCUMENT);

    seo.init();
  });

  function canonical(): string | null {
    return document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null;
  }

  describe('setAll', () => {
    it('sets title, description and canonical together', () => {
      seo.setAll({
        title: 'Página de prueba',
        description: 'Descripción de prueba',
        path: '/prueba',
      });

      expect(title.getTitle()).toBe('Página de prueba');
      expect(meta.getTag('name="description"')?.content).toBe('Descripción de prueba');
      expect(canonical()).toBe('https://nexo-mentoring.com/prueba');
    });

    it('mirrors the title and description into Open Graph and Twitter tags', () => {
      seo.setAll({ title: 'Un título', description: 'Una descripción', path: '/x' });

      expect(meta.getTag('property="og:title"')?.content).toBe('Un título');
      expect(meta.getTag('property="og:description"')?.content).toBe('Una descripción');
      expect(meta.getTag('name="twitter:title"')?.content).toBe('Un título');
    });

    it('sets og:image only when one is provided', () => {
      seo.setAll({ title: 'A', description: 'B', path: '/a', image: 'https://x/img.png' });
      expect(meta.getTag('property="og:image"')?.content).toBe('https://x/img.png');
    });

    it('does not double the slash for the homepage', () => {
      seo.setAll({ title: 'Inicio', description: 'D', path: '/' });
      expect(canonical()).toBe('https://nexo-mentoring.com');
    });

    it('reuses a single canonical link element', () => {
      seo.setAll({ title: 'A', description: 'B', path: '/a' });
      seo.setAll({ title: 'C', description: 'D', path: '/c' });

      expect(document.querySelectorAll('link[rel="canonical"]').length).toBe(1);
      expect(canonical()).toBe('https://nexo-mentoring.com/c');
    });
  });

  describe('per-route metadata', () => {
    it('applies the metadata declared on the explore route', async () => {
      await router.navigateByUrl('/explorar');

      expect(title.getTitle()).toBe('Explorar mentores | NEXO');
      expect(canonical()).toBe('https://nexo-mentoring.com/explorar');
    });

    it('applies the metadata declared on "cómo funciona"', async () => {
      await router.navigateByUrl('/como-funciona');
      expect(title.getTitle()).toBe('Cómo funciona | NEXO');
    });

    it('does not leak the previous page title onto a route without metadata', async () => {
      await router.navigateByUrl('/explorar');
      expect(title.getTitle()).toBe('Explorar mentores | NEXO');

      // The booking flow declares no SEO data; it must fall back, not inherit.
      await router.navigateByUrl('/login');
      await router.navigateByUrl('/mentor/m1/reservar');

      expect(title.getTitle()).not.toBe('Explorar mentores | NEXO');
    });

    it('gives every public route a non-empty title and description', async () => {
      for (const url of ['/', '/explorar', '/como-funciona', '/login', '/registro']) {
        await router.navigateByUrl(url);

        expect(title.getTitle().length).toBeGreaterThan(0);
        expect(meta.getTag('name="description"')?.content?.length ?? 0).toBeGreaterThan(0);
      }
    });
  });
});
