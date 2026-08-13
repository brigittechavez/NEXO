import { Component, input, HostBinding } from '@angular/core';

@Component({
  selector: 'nx-progress-bar',
  standalone: true,
  template: `
    <div class="w-full" [class]="trackClasses">
      <div class="flex items-center justify-between mb-1.5">
        @if (label()) {
          <span class="text-sm font-medium text-muted-text dark:text-dark-muted">{{ label() }}</span>
        }
        @if (showValue()) {
          <span class="text-sm font-semibold text-ink dark:text-dark-text">{{ value() }}%</span>
        }
      </div>
      <div [class]="barTrackClasses">
        <div
          [class]="barFillClasses"
          [style.width.%]="clampedValue()"
        ></div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .bar-fill {
      transition: width 800ms cubic-bezier(0.4, 0, 0.2, 1);
    }
  `],
})
export class ProgressBarComponent {
  value = input<number>(0);
  color = input<'violet' | 'cyan' | 'lime'>('violet');
  size = input<'sm' | 'md' | 'lg'>('md');
  label = input<string>('');
  showValue = input<boolean>(true);

  clampedValue = () => Math.max(0, Math.min(100, this.value()));

  @HostBinding('class')
  get hostClasses(): string {
    return 'block';
  }

  get trackClasses(): string {
    return '';
  }

  get barTrackClasses(): string {
    const sizeMap: Record<string, string> = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    };
    return `w-full rounded-full bg-surface dark:bg-dark-surface-high overflow-hidden ${sizeMap[this.size()]}`;
  }

  get barFillClasses(): string {
    const colorMap: Record<string, string> = {
      violet: 'bg-nexo-violet',
      cyan: 'bg-electric-cyan',
      lime: 'bg-acid-lime',
    };
    return `h-full rounded-full bar-fill ${colorMap[this.color()]}`;
  }
}
