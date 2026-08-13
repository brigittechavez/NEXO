import { Injectable, signal, computed } from '@angular/core';
import { MentorDetail, ALL_MENTORS } from '../data/mentors.data';

@Injectable({ providedIn: 'root' })
export class MentorService {
  readonly mentors = signal<MentorDetail[]>(ALL_MENTORS);
  readonly loaded = signal<boolean>(true);

  readonly featuredMentors = computed(() =>
    [...this.mentors()]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
  );

  getMentorById(id: string): MentorDetail | undefined {
    return this.mentors().find(m => m.id === id);
  }

  getMentorsByCategory(categorySlug: string): MentorDetail[] {
    return this.mentors().filter(m => m.category === categorySlug);
  }

  searchMentors(query: string): MentorDetail[] {
    const lower = query.toLowerCase();
    return this.mentors().filter(m =>
      m.name.toLowerCase().includes(lower) ||
      m.title.toLowerCase().includes(lower) ||
      m.bio.toLowerCase().includes(lower) ||
      m.specialties.some(s => s.toLowerCase().includes(lower)) ||
      m.tags.some(t => t.toLowerCase().includes(lower))
    );
  }

  getMentorsByPriceRange(min: number, max: number): MentorDetail[] {
    return this.mentors().filter(m => m.price >= min && m.price <= max);
  }

  getFreeMentors(): MentorDetail[] {
    return this.mentors().filter(m =>
      m.mentorshipDetails.some(ms => ms.isFree)
    );
  }

  getTopRatedMentors(minRating: number = 4.7): MentorDetail[] {
    return this.mentors().filter(m => m.rating >= minRating);
  }
}
