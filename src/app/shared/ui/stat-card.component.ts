import { Component, input } from '@angular/core';

@Component({
  selector: 'nx-stat-card',
  standalone: true,
  template: `
    <div class="bg-white dark:bg-dark-surface rounded-card-lg p-5 shadow-soft-sm flex items-start gap-4">
      @if (icon()) {
        <div class="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-nexo-violet/10">
          <span [innerHTML]="icon()" class="w-5 h-5 text-nexo-violet"></span>
        </div>
      }
      <div class="min-w-0 flex-1">
        <p class="text-2xl font-bold text-ink dark:text-dark-text tracking-tight leading-none">{{ value() }}</p>
        <p class="text-sm text-muted-text dark:text-dark-muted mt-1.5">{{ label() }}</p>
        @if (trend()) {
          <div class="flex items-center gap-1 mt-2" [class]="trend()!.direction === 'up' ? 'text-green-600' : 'text-red-500'">
            @if (trend()!.direction === 'up') {
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                <polyline points="17 18 23 18 23 12"/>
              </svg>
            }
            <span class="text-xs font-semibold">{{ trend()!.value }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class StatCardComponent {
  label = input<string>('');
  value = input<string | number>('');
  icon = input<string>('');
  trend = input<{ direction: 'up' | 'down'; value: string } | null>(null);
}
