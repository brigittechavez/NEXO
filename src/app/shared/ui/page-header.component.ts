import { Component, input, computed, contentChild, TemplateRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';

/**
 * Page header, at two scales.
 *
 * `editorial` — public pages, where the headline is the composition.
 * `app`       — dashboard pages, which must stay functional and quiet (§43):
 *               same structure, smaller type, tighter spacing.
 */
@Component({
  selector: 'nx-page-header',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet],
  template: `
    <div [class]="wrapperClass()">
      @if (breadcrumbs().length > 0) {
        <nav class="flex items-center gap-2 text-sm text-muted-text dark:text-dark-muted mb-4" aria-label="Breadcrumb">
          @for (crumb of breadcrumbs(); track crumb.label; let last = $last) {
            @if (!last && crumb.route) {
              <a [routerLink]="crumb.route" class="hover:text-nexo-violet transition-colors">{{ crumb.label }}</a>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            } @else {
              <span class="text-ink dark:text-dark-text font-medium">{{ crumb.label }}</span>
            }
          }
        </nav>
      }

      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 [class]="titleClass()">{{ title() }}</h1>
          @if (subtitle()) {
            <p [class]="subtitleClass()">{{ subtitle() }}</p>
          }
        </div>
        @if (actions()) {
          <div class="flex items-center gap-3 flex-shrink-0">
            <ng-container [ngTemplateOutlet]="actions()!"></ng-container>
          </div>
        }
      </div>
    </div>
  `,
})
export class PageHeaderComponent {
  title = input.required<string>();
  subtitle = input<string>('');
  breadcrumbs = input<Array<{ label: string; route?: string }>>([]);
  size = input<'editorial' | 'app'>('editorial');

  actions = contentChild<TemplateRef<unknown>>('actions');

  protected readonly wrapperClass = computed(() =>
    this.size() === 'editorial' ? 'mb-8 md:mb-10' : 'mb-6'
  );

  protected readonly titleClass = computed(() =>
    this.size() === 'editorial'
      ? 'font-serif text-display-sm md:text-display-md text-ink dark:text-dark-text mb-2 text-balance'
      : 'font-serif text-2xl md:text-3xl font-bold text-ink dark:text-dark-text text-balance'
  );

  protected readonly subtitleClass = computed(() =>
    this.size() === 'editorial'
      ? 'text-muted-text dark:text-dark-muted text-lg max-w-2xl'
      : 'text-muted-text dark:text-dark-muted mt-1 max-w-2xl'
  );
}
