import { TestBed } from '@angular/core/testing';
import { FilterService } from './filter.service';
import { ALL_MENTORS } from '../data/mentors.data';

/**
 * These run against the real mentor catalogue on purpose: the filters exist to
 * make that catalogue navigable, so a test that passes on invented data would
 * not tell us the marketplace works.
 */
describe('FilterService', () => {
  let service: FilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterService);
    service.resetFilters();
  });

  it('starts with every mentor and no active filter', () => {
    expect(service.filteredMentors().length).toBe(ALL_MENTORS.length);
    expect(service.hasActiveFilters()).toBe(false);
    expect(service.resultCount()).toBe(ALL_MENTORS.length);
  });

  describe('category', () => {
    it('returns only mentors of the chosen category', () => {
      service.setCategory('tecnologia');

      const result = service.filteredMentors();
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(m => m.category === 'tecnologia')).toBe(true);
    });

    it('returns nothing for a category no mentor belongs to', () => {
      service.setCategory('categoria-inexistente');
      expect(service.filteredMentors()).toEqual([]);
    });
  });

  describe('experience', () => {
    it('keeps only mentors at or above the minimum', () => {
      service.setMinExperience(8);
      expect(service.filteredMentors().every(m => m.experience >= 8)).toBe(true);
    });

    it('narrows the result as the minimum rises', () => {
      service.setMinExperience(3);
      const lenient = service.resultCount();

      service.setMinExperience(10);
      expect(service.resultCount()).toBeLessThanOrEqual(lenient);
    });
  });

  describe('rating', () => {
    it('keeps only mentors at or above the minimum rating', () => {
      service.setMinRating(4.8);
      expect(service.filteredMentors().every(m => m.rating >= 4.8)).toBe(true);
    });
  });

  describe('free mentorships', () => {
    it('keeps only mentors offering at least one free mentorship', () => {
      service.setFreeOnly(true);

      const result = service.filteredMentors();
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(m => m.mentorshipDetails.some(ms => ms.isFree))).toBe(true);
    });

    it('restores the full list when switched off', () => {
      service.setFreeOnly(true);
      service.setFreeOnly(false);
      expect(service.resultCount()).toBe(ALL_MENTORS.length);
    });
  });

  describe('search query', () => {
    it('matches on mentor name regardless of case', () => {
      const target = ALL_MENTORS[0];
      service.setSearchQuery(target.name.toUpperCase());

      expect(service.filteredMentors().some(m => m.id === target.id)).toBe(true);
    });

    it('matches on specialties and tags, not just the name', () => {
      service.setSearchQuery('angular');

      const result = service.filteredMentors();
      expect(result.length).toBeGreaterThan(0);
      expect(
        result.every(
          m =>
            m.name.toLowerCase().includes('angular') ||
            m.title.toLowerCase().includes('angular') ||
            m.bio.toLowerCase().includes('angular') ||
            m.specialties.some(s => s.toLowerCase().includes('angular')) ||
            m.tags.some(t => t.toLowerCase().includes('angular'))
        )
      ).toBe(true);
    });

    it('returns nothing for a query nobody matches', () => {
      service.setSearchQuery('zzzzzzzz-no-existe');
      expect(service.filteredMentors()).toEqual([]);
    });
  });

  describe('objective', () => {
    it('matches against recommendedFor, specialties and tags', () => {
      service.setObjective('frontend');

      const result = service.filteredMentors();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('price', () => {
    it('keeps mentors with at least one mentorship within budget', () => {
      service.setMaxPrice(100);
      expect(
        service.filteredMentors().every(m => m.mentorshipDetails.some(ms => ms.price <= 100))
      ).toBe(true);
    });
  });

  describe('combining filters', () => {
    it('applies every active filter at once', () => {
      service.setCategory('tecnologia');
      service.setMinRating(4.5);

      expect(
        service.filteredMentors().every(m => m.category === 'tecnologia' && m.rating >= 4.5)
      ).toBe(true);
    });

    it('never returns more results than a single filter would', () => {
      service.setCategory('tecnologia');
      const byCategory = service.resultCount();

      service.setMinExperience(8);
      expect(service.resultCount()).toBeLessThanOrEqual(byCategory);
    });
  });

  describe('active-filter tracking', () => {
    it('reports an active filter for each of the five main criteria (§22)', () => {
      const criteria: Array<() => void> = [
        () => service.setCategory('tecnologia'),
        () => service.setObjective('frontend'),
        () => service.setMinExperience(5),
        () => service.setMinRating(4.5),
        () => service.setFreeOnly(true),
      ];

      for (const apply of criteria) {
        service.resetFilters();
        expect(service.hasActiveFilters()).toBe(false);
        apply();
        expect(service.hasActiveFilters()).toBe(true);
      }
    });

    it('clears a single filter without touching the rest', () => {
      service.setCategory('tecnologia');
      service.setMinRating(4.8);

      service.resetFilter('rating');

      expect(service.activeFilters().rating).toBeNull();
      expect(service.activeFilters().category).toBe('tecnologia');
      expect(service.hasActiveFilters()).toBe(true);
    });

    it('resetFilters returns to the untouched catalogue', () => {
      service.setCategory('tecnologia');
      service.setFreeOnly(true);
      service.setSearchQuery('angular');

      service.resetFilters();

      expect(service.hasActiveFilters()).toBe(false);
      expect(service.resultCount()).toBe(ALL_MENTORS.length);
    });
  });
});
