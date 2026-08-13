import { Component, input, HostBinding } from '@angular/core';

@Component({
  selector: 'nx-skeleton',
  standalone: true,
  template: '',
  host: {
    '[attr.aria-busy]': 'true',
    role: 'status',
  },
})
export class SkeletonComponent {
  width = input<string>('100%');
  height = input<string>('20px');
  borderRadius = input<string>('8px');

  @HostBinding('class')
  get hostClasses(): string {
    return 'block animate-pulse bg-surface dark:bg-dark-surface-high';
  }

  @HostBinding('style')
  get hostStyles(): Record<string, string> {
    return {
      width: this.width(),
      height: this.height(),
      'border-radius': this.borderRadius(),
    };
  }
}
