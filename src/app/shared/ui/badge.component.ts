import { Component, input, HostBinding } from '@angular/core';

@Component({
  selector: 'nx-badge',
  standalone: true,
  template: `<ng-content />`,
})
export class BadgeComponent {
  variant = input<'violet' | 'cyan' | 'lime' | 'lavender' | 'dark'>('violet');
  size = input<'sm' | 'md'>('sm');

  @HostBinding('class')
  get hostClasses(): string {
    const base =
      'inline-flex items-center font-semibold font-sans rounded-pill whitespace-nowrap';

    const sizeMap: Record<string, string> = {
      sm: 'px-3 py-1 text-xs',
      md: 'px-4 py-1.5 text-sm',
    };

    const variantMap: Record<string, string> = {
      violet: 'bg-nexo-violet/10 text-nexo-violet',
      cyan: 'bg-electric-cyan/10 text-electric-cyan',
      lime: 'bg-acid-lime/15 text-ink',
      lavender: 'bg-soft-lavender/40 text-nexo-violet',
      dark: 'bg-dark-surface-high text-dark-text',
    };

    return `${base} ${sizeMap[this.size()]} ${variantMap[this.variant()]}`.trim();
  }
}
