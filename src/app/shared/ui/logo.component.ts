import { Component, input, computed } from '@angular/core';

/** Intrinsic pixel sizes of the brand files, used to derive width from height. */
const RATIO = {
  full: 2048 / 768, // nexo-logo.png  — symbol + wordmark
  mark: 1, // nexo-mark-ui.webp — symbol only, square
} as const;

/**
 * NEXO brand mark.
 *
 * `full`  — symbol + wordmark. Public header, footer, auth and onboarding.
 * `mark`  — symbol alone, for tight surfaces such as the dashboard sidebar.
 *
 * Width is derived from the declared height so the intrinsic ratio is always
 * preserved and the reserved box never shifts once the file loads.
 */
@Component({
  selector: 'app-logo',
  standalone: true,
  template: `
    <img
      [src]="src()"
      [width]="width()"
      [height]="height()"
      [alt]="alt()"
      [attr.aria-hidden]="alt() ? null : 'true'"
      [attr.fetchpriority]="priority() ? 'high' : null"
      [attr.loading]="priority() ? null : 'lazy'"
      [attr.decoding]="priority() ? null : 'async'"
      class="block h-auto max-w-full select-none"
      [style.width.px]="width()"
    />
  `,
})
export class LogoComponent {
  variant = input<'full' | 'mark'>('full');

  /** Rendered height in px; width follows the file's own proportion. */
  height = input<number>(28);

  /**
   * Accessible name. Leave empty when the logo sits next to visible "NEXO"
   * text, so screen readers do not announce the brand twice.
   */
  alt = input<string>('NEXO');

  /** Set on above-the-fold logos (header) to avoid lazy-loading the LCP area. */
  priority = input<boolean>(false);

  /**
   * The mark is served from a UI-sized WebP (256 px, ~11 KB) rather than the
   * 1254 px master PNG, which is 60x heavier and loads on every page. The master
   * stays in place as the source for the favicon and app icons.
   */
  protected readonly src = computed(() =>
    this.variant() === 'mark'
      ? '/assets/images/brand/nexo-mark-ui.webp'
      : '/assets/images/brand/nexo-logo.png'
  );

  protected readonly width = computed(() => Math.round(this.height() * RATIO[this.variant()]));
}
