import { Component, input, HostBinding } from '@angular/core';

@Component({
  selector: 'nx-card',
  standalone: true,
  template: `<ng-content />`,
  host: {
    '[attr.tabindex]': '0',
  },
})
export class CardComponent {
  hover = input<boolean>(true);

  @HostBinding('class')
  get hostClasses(): string {
    const base =
      'block bg-white dark:bg-dark-surface rounded-card-lg p-6 transition-all duration-200';

    const hoverStyle = this.hover()
      ? 'shadow-soft-sm hover:shadow-soft-md hover:-translate-y-0.5'
      : 'shadow-soft-sm';

    return `${base} ${hoverStyle}`.trim();
  }
}
