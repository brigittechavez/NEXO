import { Component, input, HostBinding } from '@angular/core';

@Component({
  selector: 'nx-metric-card',
  standalone: true,
  template: `
    <div class="bg-white dark:bg-dark-surface rounded-card-lg p-5 shadow-soft-sm">
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center justify-center w-10 h-10 rounded-xl" [class]="iconBgClass">
          <span class="w-5 h-5 text-white" [innerHTML]="icon()"></span>
        </div>
        @if (trend() !== 'none') {
          <div class="flex items-center gap-1" [class]="trendClass">
            @if (trend() === 'up') {
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                <polyline points="17 18 23 18 23 12"/>
              </svg>
            }
            <span class="text-xs font-semibold">{{ trendValue() }}</span>
          </div>
        }
      </div>
      <div>
        <p class="text-3xl font-bold text-ink dark:text-dark-text tracking-tight">{{ value() }}</p>
        <p class="text-sm text-muted-text dark:text-dark-muted mt-1">{{ label() }}</p>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
})
export class MetricCardComponent {
  label = input<string>('');
  value = input<string | number>('');
  icon = input<string>('');
  trend = input<'up' | 'down' | 'none'>('none');
  trendValue = input<string>('');
  color = input<'violet' | 'cyan' | 'lime' | 'dark'>('violet');

  @HostBinding('class')
  get hostClasses(): string {
    return 'block';
  }

  get iconBgClass(): string {
    const map: Record<string, string> = {
      violet: 'bg-nexo-violet',
      cyan: 'bg-electric-cyan',
      lime: 'bg-acid-lime/20',
      dark: 'bg-dark-surface-high',
    };
    return map[this.color()];
  }

  get trendClass(): string {
    if (this.trend() === 'up') return 'text-green-600';
    return 'text-red-500';
  }
}
