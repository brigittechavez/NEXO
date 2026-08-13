import { Component, input, output, signal, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'nx-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="relative">
      <svg
        class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text dark:text-dark-muted pointer-events-none"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        [placeholder]="placeholder()"
        [ngModel]="query()"
        (ngModelChange)="onInputChange($event)"
        class="w-full pl-12 pr-10 py-3.5 bg-surface dark:bg-dark-surface-high text-ink dark:text-dark-text placeholder-muted-text dark:placeholder-dark-muted rounded-card-lg border-0 text-base font-sans transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-nexo-violet/30 focus:bg-white dark:focus:bg-dark-surface-high shadow-soft-sm"
      />
      @if (query()) {
        <button
          (click)="clearSearch()"
          class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-surface dark:hover:bg-dark-surface-high transition-colors"
        >
          <svg
            class="text-muted-text dark:text-dark-muted"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      }
    </div>
  `,
})
export class SearchBarComponent implements OnInit, OnDestroy {
  placeholder = input<string>('¿Qué quieres lograr?');

  searchChange = output<string>();

  query = signal('');
  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(value => {
        this.searchChange.emit(value);
      });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  onInputChange(value: string): void {
    this.query.set(value);
    this.searchSubject.next(value);
  }

  clearSearch(): void {
    this.query.set('');
    this.searchChange.emit('');
  }
}
