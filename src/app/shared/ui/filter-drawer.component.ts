import { Component, input, output, signal, HostBinding, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../core/models/category.model';

export interface FilterState {
  category: string | null;
  objective: string;
  experience: string;
  minRating: number;
  freeOnly: boolean;
}

const DEFAULT_FILTER_STATE: FilterState = {
  category: null,
  objective: '',
  experience: '',
  minRating: 0,
  freeOnly: false,
};

@Component({
  selector: 'nx-filter-drawer',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (isOpen()) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-ink/40 dark:bg-ink/60 z-40 transition-opacity duration-300"
        [class.opacity-0]="!visible()"
        [class.pointer-events-none]="!visible()"
        (click)="close.emit()"
      ></div>

      <!-- Drawer -->
      <div
        class="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-dark-surface rounded-t-card-xl shadow-soft-lg transform transition-transform duration-300 ease-out max-h-[85vh] overflow-hidden flex flex-col"
        [class.translate-y-full]="!visible()"
      >
        <!-- Handle -->
        <div class="flex justify-center pt-3 pb-2">
          <div class="w-10 h-1 rounded-full bg-surface dark:bg-dark-surface-high"></div>
        </div>

        <!-- Header -->
        <div class="flex items-center justify-between px-5 pb-4 border-b border-surface dark:border-dark-surface-high">
          <h2 class="text-lg font-bold text-ink dark:text-dark-text">Filtros</h2>
          @if (hasActiveFilters()) {
            <button
              (click)="clearAll()"
              class="text-sm text-nexo-violet font-semibold hover:underline"
            >
              Limpiar todo
            </button>
          }
        </div>

        <!-- Scrollable content -->
        <div class="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          <!-- Categoria -->
          <div>
            <label class="block text-sm font-semibold text-ink dark:text-dark-text mb-3">Categoria</label>
            <div class="flex flex-wrap gap-2">
              <button
                (click)="setFilter('category', null)"
                class="px-3.5 py-2 rounded-pill text-sm font-medium transition-all duration-200"
                [class]="localFilters().category === null
                  ? 'bg-nexo-violet text-white'
                  : 'bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted hover:bg-soft-lavender/30'"
              >
                Todos
              </button>
              @for (cat of categories(); track cat.slug) {
                <button
                  (click)="setFilter('category', cat.slug)"
                  class="px-3.5 py-2 rounded-pill text-sm font-medium transition-all duration-200"
                  [class]="localFilters().category === cat.slug
                    ? 'bg-nexo-violet text-white'
                    : 'bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted hover:bg-soft-lavender/30'"
                >
                  {{ cat.name }}
                </button>
              }
            </div>
          </div>

          <!-- Objetivo -->
          <div>
            <label class="block text-sm font-semibold text-ink dark:text-dark-text mb-3">Objetivo</label>
            <input
              type="text"
              placeholder="Buscar por especialidad o area..."
              [ngModel]="localFilters().objective"
              (ngModelChange)="setFilter('objective', $event)"
              class="w-full px-4 py-3 bg-surface dark:bg-dark-surface-high text-ink dark:text-dark-text placeholder-muted-text dark:placeholder-dark-muted rounded-input border-0 text-sm font-sans transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-nexo-violet/30"
            />
          </div>

          <!-- Experiencia -->
          <div>
            <label class="block text-sm font-semibold text-ink dark:text-dark-text mb-3">Experiencia</label>
            <div class="flex gap-2">
              @for (opt of experienceOptions; track opt.value) {
                <button
                  (click)="setFilter('experience', opt.value)"
                  class="flex-1 px-3 py-2.5 rounded-pill text-sm font-medium transition-all duration-200 text-center"
                  [class]="localFilters().experience === opt.value
                    ? 'bg-nexo-violet text-white'
                    : 'bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted hover:bg-soft-lavender/30'"
                >
                  {{ opt.label }}
                </button>
              }
            </div>
          </div>

          <!-- Valoracion minima -->
          <div>
            <label class="block text-sm font-semibold text-ink dark:text-dark-text mb-3">
              Valoracion minima
              @if (localFilters().minRating > 0) {
                <span class="text-nexo-violet ml-1">{{ localFilters().minRating }}+</span>
              }
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              [ngModel]="localFilters().minRating"
              (ngModelChange)="setFilter('minRating', $event)"
              class="w-full h-2 bg-surface dark:bg-dark-surface-high rounded-full appearance-none cursor-pointer accent-nexo-violet"
            />
            <div class="flex justify-between text-xs text-muted-text dark:text-dark-muted mt-1">
              <span>Todas</span>
              <span>4.5+</span>
              <span>5.0</span>
            </div>
          </div>

          <!-- Mentoría gratuita -->
          <div class="flex items-center justify-between">
            <div>
              <label class="block text-sm font-semibold text-ink dark:text-dark-text">Solo mentorías gratuitas</label>
              <p class="text-xs text-muted-text dark:text-dark-muted mt-0.5">Muestra mentores con sesiones sin costo</p>
            </div>
            <button
              (click)="setFilter('freeOnly', !localFilters().freeOnly)"
              class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200"
              [class]="localFilters().freeOnly ? 'bg-nexo-violet' : 'bg-surface dark:bg-dark-surface-high'"
              role="switch"
              [attr.aria-checked]="localFilters().freeOnly"
            >
              <span
                class="inline-block h-5 w-5 transform rounded-full bg-white shadow-soft-sm transition-transform duration-200"
                [class.translate-x-6]="localFilters().freeOnly"
                [class.translate-x-1]="!localFilters().freeOnly"
              ></span>
            </button>
          </div>
        </div>

        <!-- Footer buttons -->
        <div class="flex gap-3 px-5 py-4 border-t border-surface dark:border-dark-surface-high bg-white dark:bg-dark-surface">
          <button
            (click)="clearAll()"
            class="flex-1 py-3 px-4 bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted font-semibold text-sm rounded-pill transition-all duration-200 hover:bg-soft-lavender/30"
          >
            Limpiar
          </button>
          <button
            (click)="applyFilters()"
            class="flex-1 py-3 px-4 bg-nexo-violet text-white font-semibold text-sm rounded-pill transition-all duration-200 hover:bg-electric-indigo active:scale-[0.98]"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #5B4BFF;
      cursor: pointer;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(91, 75, 255, 0.3);
    }
    input[type="range"]::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #5B4BFF;
      cursor: pointer;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(91, 75, 255, 0.3);
    }
  `],
})
export class FilterDrawerComponent implements OnChanges {
  isOpen = input<boolean>(false);
  categories = input<Category[]>([]);
  initialFilters = input<FilterState>({ ...DEFAULT_FILTER_STATE });

  filterChange = output<FilterState>();
  close = output<void>();

  protected visible = signal(false);
  protected localFilters = signal<FilterState>({ ...DEFAULT_FILTER_STATE });

  protected readonly experienceOptions = [
    { value: '', label: 'Cualquiera' },
    { value: 'junior', label: 'Junior (1-3 años)' },
    { value: 'senior', label: 'Senior (5+ años)' },
  ];

  @HostBinding('class')
  get hostClasses(): string {
    return 'block';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (this.isOpen()) {
        this.localFilters.set({ ...this.initialFilters() });
        setTimeout(() => this.visible.set(true), 10);
      } else {
        this.visible.set(false);
      }
    }
  }

  protected setFilter<K extends keyof FilterState>(key: K, value: FilterState[K]): void {
    this.localFilters.update(f => ({ ...f, [key]: value }));
  }

  protected hasActiveFilters(): boolean {
    const f = this.localFilters();
    return (
      f.category !== null ||
      f.objective !== '' ||
      f.experience !== '' ||
      f.minRating > 0 ||
      f.freeOnly
    );
  }

  protected clearAll(): void {
    this.localFilters.set({ ...DEFAULT_FILTER_STATE });
  }

  protected applyFilters(): void {
    this.filterChange.emit({ ...this.localFilters() });
    this.close.emit();
  }
}
