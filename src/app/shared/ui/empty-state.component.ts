import { Component, input, output, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Empty state, at two scales.
 *
 * `page`   — a whole view has nothing to show (no saved mentors, no results).
 * `inline` — a section inside a card is empty; the page around it is not.
 *
 * Both share the same voice and geometry so an empty NEXO never looks like a
 * broken NEXO. Anything smaller than `inline` should just be a sentence.
 */
@Component({
  selector: 'nx-empty-state',
  standalone: true,
  template: `
    <div [class]="containerClass()">
      <div [class]="iconWrapClass()">
        <div [class]="iconClass()" [innerHTML]="icon()"></div>
      </div>

      <h2 [class]="titleClass()">{{ title() }}</h2>

      @if (message()) {
        <p [class]="messageClass()">{{ message() }}</p>
      }

      @if (actionLabel()) {
        <button [class]="size() === 'page' ? 'btn-primary btn-md' : 'btn-primary btn-sm'" (click)="handleAction()">
          {{ actionLabel() }}
        </button>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  private readonly router = inject(Router);

  icon = input<string>(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 15h8"/><circle cx="9" cy="9.5" r="0.5" fill="currentColor"/><circle cx="15" cy="9.5" r="0.5" fill="currentColor"/></svg>'
  );
  title = input<string>('Sin resultados');
  message = input<string>(
    'No encontramos lo que buscas. Prueba con otros términos o explora nuestras categorías.'
  );
  actionLabel = input<string>('');
  actionRoute = input<string>('');
  size = input<'page' | 'inline'>('page');

  action = output<void>();

  protected readonly containerClass = computed(() =>
    this.size() === 'page' ? 'text-center py-16 px-6' : 'text-center py-10 px-4'
  );

  protected readonly iconWrapClass = computed(() => {
    const base =
      'rounded-full bg-soft-lavender/30 dark:bg-nexo-violet/10 flex items-center justify-center mx-auto';
    return this.size() === 'page' ? `w-20 h-20 mb-6 ${base}` : `w-12 h-12 mb-4 ${base}`;
  });

  protected readonly iconClass = computed(() =>
    this.size() === 'page' ? 'w-10 h-10 text-nexo-violet' : 'w-6 h-6 text-nexo-violet'
  );

  protected readonly titleClass = computed(() =>
    this.size() === 'page'
      ? 'font-serif text-heading-lg text-ink dark:text-dark-text mb-3'
      : 'text-base font-semibold text-ink dark:text-dark-text mb-1'
  );

  protected readonly messageClass = computed(() =>
    this.size() === 'page'
      ? 'text-muted-text dark:text-dark-muted text-base max-w-md mx-auto mb-8 leading-relaxed text-balance'
      : 'text-sm text-muted-text dark:text-dark-muted max-w-sm mx-auto mb-5 leading-relaxed'
  );

  protected handleAction(): void {
    if (this.actionRoute()) {
      this.router.navigate([this.actionRoute()]);
    }
    this.action.emit();
  }
}
