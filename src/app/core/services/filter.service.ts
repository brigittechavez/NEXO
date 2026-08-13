import { Injectable, signal, computed } from '@angular/core';
import { ALL_MENTORS } from '../data/mentors.data';

export interface MentorFilters {
  category: string | null;
  objective: string | null;
  experience: number | null;
  rating: number | null;
  freeOnly: boolean;
  maxPrice: number | null;
  searchQuery: string;
}

const DEFAULT_FILTERS: MentorFilters = {
  category: null,
  objective: null,
  experience: null,
  rating: null,
  freeOnly: false,
  maxPrice: null,
  searchQuery: '',
};

@Injectable({ providedIn: 'root' })
export class FilterService {
  readonly activeFilters = signal<MentorFilters>({ ...DEFAULT_FILTERS });

  readonly filteredMentors = computed(() => {
    const filters = this.activeFilters();
    let result = [...ALL_MENTORS];

    if (filters.category) {
      result = result.filter(m => m.category === filters.category);
    }

    if (filters.experience) {
      result = result.filter(m => m.experience >= filters.experience!);
    }

    if (filters.rating) {
      result = result.filter(m => m.rating >= filters.rating!);
    }

    if (filters.freeOnly) {
      result = result.filter(m => m.mentorshipDetails.some(ms => ms.isFree));
    }

    if (filters.maxPrice) {
      result = result.filter(m =>
        m.mentorshipDetails.some(ms => ms.price <= filters.maxPrice!)
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.title.toLowerCase().includes(query) ||
        m.bio.toLowerCase().includes(query) ||
        m.specialties.some(s => s.toLowerCase().includes(query)) ||
        m.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    if (filters.objective) {
      const objectiveLower = filters.objective.toLowerCase();
      result = result.filter(m =>
        m.recommendedFor.some(r => r.toLowerCase().includes(objectiveLower)) ||
        m.specialties.some(s => s.toLowerCase().includes(objectiveLower)) ||
        m.tags.some(t => t.toLowerCase().includes(objectiveLower))
      );
    }

    return result;
  });

  readonly hasActiveFilters = computed(() => {
    const f = this.activeFilters();
    return (
      f.category !== null ||
      f.objective !== null ||
      f.experience !== null ||
      f.rating !== null ||
      f.freeOnly ||
      f.maxPrice !== null ||
      f.searchQuery !== ''
    );
  });

  readonly resultCount = computed(() => this.filteredMentors().length);

  setFilter<K extends keyof MentorFilters>(key: K, value: MentorFilters[K]): void {
    this.activeFilters.update(f => ({ ...f, [key]: value }));
  }

  setCategory(category: string | null): void {
    this.setFilter('category', category);
  }

  setObjective(objective: string | null): void {
    this.setFilter('objective', objective);
  }

  setMinExperience(years: number | null): void {
    this.setFilter('experience', years);
  }

  setMinRating(rating: number | null): void {
    this.setFilter('rating', rating);
  }

  setFreeOnly(free: boolean): void {
    this.setFilter('freeOnly', free);
  }

  setMaxPrice(price: number | null): void {
    this.setFilter('maxPrice', price);
  }

  setSearchQuery(query: string): void {
    this.setFilter('searchQuery', query);
  }

  resetFilters(): void {
    this.activeFilters.set({ ...DEFAULT_FILTERS });
  }

  resetFilter<K extends keyof MentorFilters>(key: K): void {
    this.activeFilters.update(f => ({
      ...f,
      [key]: DEFAULT_FILTERS[key],
    }));
  }
}
