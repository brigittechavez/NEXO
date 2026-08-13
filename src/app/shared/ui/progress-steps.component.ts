import { Component, input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-steps',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Desktop: Horizontal -->
    <div class="hidden sm:flex items-center justify-between">
      @for (step of steps(); track step; let i = $index) {
        <div class="flex items-center" [class.flex-1]="i < steps().length - 1">
          <div class="flex flex-col items-center">
            <!-- Circle -->
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300"
              [class]="getCircleClass(i)">
              @if (i < currentStep()) {
                <!-- Checkmark -->
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              } @else {
                {{ i + 1 }}
              }
            </div>
            <!-- Label -->
            <span
              class="mt-2 text-xs font-medium text-center whitespace-nowrap transition-colors"
              [class]="getLabelClass(i)">
              {{ step }}
            </span>
          </div>
          <!-- Connector line -->
          @if (i < steps().length - 1) {
            <div
              class="flex-1 h-0.5 mx-3 rounded-full transition-colors duration-300"
              [class]="i < currentStep() ? 'bg-nexo-violet' : 'bg-surface dark:bg-dark-surface-high'"
            ></div>
          }
        </div>
      }
    </div>

    <!-- Mobile: Vertical -->
    <div class="flex sm:hidden flex-col space-y-1">
      @for (step of steps(); track step; let i = $index) {
        <div class="flex items-center gap-3">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all duration-300"
            [class]="getMobileCircleClass(i)">
            @if (i < currentStep()) {
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            } @else {
              {{ i + 1 }}
            }
          </div>
          <span
            class="text-sm font-medium transition-colors"
            [class]="getMobileLabelClass(i)">
            {{ step }}
          </span>
        </div>
        @if (i < steps().length - 1) {
          <div class="ml-4 w-0.5 h-4 rounded-full transition-colors"
               [class]="i < currentStep() ? 'bg-nexo-violet' : 'bg-surface dark:bg-dark-surface-high'"></div>
        }
      }
    </div>
  `,
})
export class ProgressStepsComponent {
  steps = input<string[]>([]);
  currentStep = input<number>(0);

  @HostBinding('class')
  get hostClasses(): string {
    return 'block';
  }

  getCircleClass(index: number): string {
    const base = 'transition-all duration-300';
    if (index < this.currentStep()) {
      return `${base} bg-nexo-violet text-white`;
    }
    if (index === this.currentStep()) {
      return `${base} bg-nexo-violet text-white ring-4 ring-nexo-violet/20`;
    }
    return `${base} bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted`;
  }

  getLabelClass(index: number): string {
    const base = 'transition-colors';
    if (index <= this.currentStep()) {
      return `${base} text-ink dark:text-dark-text`;
    }
    return `${base} text-muted-text dark:text-dark-muted`;
  }

  getMobileCircleClass(index: number): string {
    const base = 'transition-all duration-300';
    if (index < this.currentStep()) {
      return `${base} bg-nexo-violet text-white`;
    }
    if (index === this.currentStep()) {
      return `${base} bg-nexo-violet text-white ring-4 ring-nexo-violet/20`;
    }
    return `${base} bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted`;
  }

  getMobileLabelClass(index: number): string {
    const base = 'transition-colors';
    if (index <= this.currentStep()) {
      return `${base} text-ink dark:text-dark-text`;
    }
    return `${base} text-muted-text dark:text-dark-muted`;
  }
}
