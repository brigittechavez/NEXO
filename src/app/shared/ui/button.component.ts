import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'nx-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="buttonClasses()"
      [attr.aria-busy]="loading() ? 'true' : null"
      (click)="onClick()"
    >
      <ng-content />
    </button>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
      }
      button {
        width: 100%;
      }
    `,
  ],
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary' | 'ghost' | 'dark'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  type = input<'button' | 'submit' | 'reset'>('button');

  clicked = output<void>();

  // Class names are spelled out in full, never interpolated: Tailwind scans the
  // source for literal strings, so `btn-${variant}` would be purged from the
  // stylesheet and the button would render unstyled.
  private static readonly VARIANTS = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    dark: 'btn-dark',
  } as const;

  private static readonly SIZES = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  } as const;

  /**
   * Composes the shared `.btn-*` classes from styles.css rather than repeating
   * their declarations, so a `<button>` here and an `<a class="btn-primary">`
   * elsewhere render identically and can only ever change together.
   */
  protected readonly buttonClasses = computed(
    () => `${ButtonComponent.VARIANTS[this.variant()]} ${ButtonComponent.SIZES[this.size()]}`
  );

  protected onClick(): void {
    if (this.disabled()) return;
    this.clicked.emit();
  }
}
