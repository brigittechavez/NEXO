import { Injectable, inject, DOCUMENT } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export interface SeoData {
  title: string;
  description: string;
  /** Absolute or root-relative path used for the canonical link and og:url. */
  path?: string;
  image?: string;
}

const SITE_NAME = 'NEXO';
const SITE_URL = 'https://nexo-mentoring.com';

/**
 * Social sharing image. Kept as PNG on purpose: several crawlers still do not
 * render WebP previews reliably.
 */
const DEFAULT_OG_IMAGE = '/assets/images/social/og-nexo.png';

const DEFAULT_SEO: SeoData = {
  title: 'NEXO — Encuentra a quien ya recorrió tu camino',
  description:
    'NEXO conecta a quien tiene un objetivo con mentores que ya lo lograron. Encuentra tu mentor, reserva una sesión y convierte la experiencia en avances concretos.',
};

/**
 * Per-route SEO for the public pages (§82).
 *
 * Routes declare their metadata in `data.seo`; dynamic pages (a mentor profile)
 * call `setAll()` once they know what they are rendering. Anything without
 * metadata falls back to the site defaults, so a title never leaks from the
 * previous page.
 *
 * Runs on the server too — Title and Meta are platform-agnostic — so crawlers
 * receive the right tags in the prerendered HTML rather than after hydration.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly document = inject(DOCUMENT);

  /** Starts listening to navigation. Called once from the root component. */
  init(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        const snapshot = this.deepestRoute().snapshot;
        const seo = snapshot.data['seo'] as SeoData | undefined;

        // A route without metadata resets to the defaults instead of keeping
        // whatever the previous page set.
        this.setAll(seo ?? DEFAULT_SEO, snapshot.url.map(segment => segment.path).join('/'));
      });
  }

  setTitle(title: string): void {
    this.titleService.setTitle(title);
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
  }

  setDescription(description: string): void {
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
  }

  setAll(config: SeoData, fallbackPath = ''): void {
    this.setTitle(config.title);
    this.setDescription(config.description);

    const path = config.path ?? (fallbackPath ? `/${fallbackPath}` : '/');
    const url = `${SITE_URL}${path === '/' ? '' : path}`;

    this.metaService.updateTag({ property: 'og:url', content: url });
    this.metaService.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.setCanonical(url);

    // Crawlers need an absolute URL; routes may pass a root-relative path.
    const image = config.image ?? DEFAULT_OG_IMAGE;
    const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;

    this.metaService.updateTag({ property: 'og:image', content: imageUrl });
    this.metaService.updateTag({ name: 'twitter:image', content: imageUrl });
    this.metaService.updateTag({ property: 'og:image:alt', content: config.title });
  }

  private setCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  private deepestRoute(): ActivatedRoute {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
}
