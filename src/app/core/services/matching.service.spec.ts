import { TestBed } from '@angular/core/testing';
import { MatchingService } from './matching.service';
import { MentorDetail } from '../data/mentors.data';
import { Goal } from '../models/goal.model';

/**
 * Fixtures rather than the real catalogue: the weighting is what is under test,
 * so each mentor differs from the baseline in exactly one dimension.
 */
function makeMentor(overrides: Partial<MentorDetail> = {}): MentorDetail {
  return {
    id: 'm-test',
    userId: 'u-test',
    name: 'Mentor de Prueba',
    title: 'Senior Frontend Engineer',
    photo: '',
    category: 'tecnologia',
    bio: 'Bio breve',
    fullBio: 'Bio larga',
    trajectory: 'Junior → Senior',
    experience: 8,
    rating: 4.9,
    price: 150,
    mentorships: 30,
    badges: [],
    availability: [
      { day: 'lunes', startTime: '18:00', endTime: '20:00' },
      { day: 'martes', startTime: '18:00', endTime: '20:00' },
      { day: 'miercoles', startTime: '18:00', endTime: '20:00' },
      { day: 'jueves', startTime: '18:00', endTime: '20:00' },
      { day: 'viernes', startTime: '18:00', endTime: '20:00' },
    ],
    specialties: ['Angular', 'React'],
    tags: ['frontend', 'angular', 'react'],
    mentorshipDetails: [
      {
        id: 'ms-test',
        title: 'Sesión individual',
        description: '',
        type: 'individual',
        duration: '60 min',
        price: 150,
        isFree: false,
        slots: 4,
        includes: [],
        targetAudience: '',
        mentorId: 'm-test',
      },
    ],
    testimonials: [],
    recommendedFor: ['Conseguir mi primer trabajo en frontend'],
    ...overrides,
  };
}

function makeGoal(overrides: Partial<Goal> = {}): Goal {
  return {
    id: 'g-test',
    menteeId: 'mentee-test',
    title: 'Conseguir mi primer trabajo en frontend',
    description: 'Quiero aprender angular y react para trabajar como frontend',
    category: 'tecnologia',
    milestones: [],
    tasks: [],
    progress: 0,
    createdAt: new Date('2026-01-01'),
    ...overrides,
  };
}

describe('MatchingService', () => {
  let service: MatchingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchingService);
    service.resetWeights();
  });

  describe('weights', () => {
    it('uses the priority defined in the spec (§10)', () => {
      const weights = service.getWeights();

      expect(weights).toEqual({
        experience: 30,
        trajectorySimilarity: 25,
        rating: 20,
        price: 10,
        availability: 10,
        affinity: 5,
      });
    });

    it('adds up to 100', () => {
      const weights = service.getWeights();
      const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
      expect(total).toBe(100);
    });

    it('can be reconfigured and reset', () => {
      service.setWeights({ experience: 50 });
      expect(service.getWeights().experience).toBe(50);
      // Untouched weights survive a partial update.
      expect(service.getWeights().rating).toBe(20);

      service.resetWeights();
      expect(service.getWeights().experience).toBe(30);
    });
  });

  describe('calculateMatch', () => {
    it('returns a percentage between 0 and 100', () => {
      const result = service.calculateMatch(makeMentor(), makeGoal());

      expect(result.percentage).toBeGreaterThanOrEqual(0);
      expect(result.percentage).toBeLessThanOrEqual(100);
    });

    it('never exceeds 100 even for a perfect mentor', () => {
      const perfect = makeMentor({
        experience: 30,
        rating: 5,
        specialties: ['angular', 'react', 'typescript'],
        tags: ['frontend', 'angular', 'react', 'javascript', 'typescript', 'data'],
      });

      const result = service.calculateMatch(perfect, makeGoal());
      expect(result.percentage).toBeLessThanOrEqual(100);
    });

    it('reports the mentor it was asked about', () => {
      const result = service.calculateMatch(makeMentor({ id: 'm42' }), makeGoal());
      expect(result.mentorId).toBe('m42');
    });

    it('scores a more experienced mentor above a less experienced one', () => {
      const goal = makeGoal();
      const junior = service.calculateMatch(makeMentor({ experience: 1 }), goal);
      const senior = service.calculateMatch(makeMentor({ experience: 12 }), goal);

      expect(senior.percentage).toBeGreaterThan(junior.percentage);
    });

    it('scores a better-rated mentor above a worse-rated one', () => {
      const goal = makeGoal();
      const low = service.calculateMatch(makeMentor({ rating: 3.5 }), goal);
      const high = service.calculateMatch(makeMentor({ rating: 4.9 }), goal);

      expect(high.percentage).toBeGreaterThan(low.percentage);
    });

    it('rewards a mentor offering a free mentorship on the price dimension', () => {
      const goal = makeGoal();
      const base = makeMentor();
      const free = makeMentor({
        mentorshipDetails: [{ ...base.mentorshipDetails[0], isFree: true, price: 0 }],
      });
      const expensive = makeMentor({
        mentorshipDetails: [{ ...base.mentorshipDetails[0], price: 280 }],
      });

      expect(service.calculateMatch(free, goal).percentage).toBeGreaterThan(
        service.calculateMatch(expensive, goal).percentage
      );
    });

    it('rewards wider availability', () => {
      const goal = makeGoal();
      const base = makeMentor();
      const scarce = makeMentor({ availability: [base.availability[0]] });

      expect(service.calculateMatch(base, goal).percentage).toBeGreaterThan(
        service.calculateMatch(scarce, goal).percentage
      );
    });

    it('reflects a reconfigured weighting', () => {
      const goal = makeGoal();
      const junior = makeMentor({ experience: 1 });

      const withDefaults = service.calculateMatch(junior, goal).percentage;

      // Removing the experience weight should stop penalising the junior mentor.
      service.setWeights({ experience: 0 });
      const withoutExperience = service.calculateMatch(junior, goal).percentage;

      expect(withoutExperience).not.toBe(withDefaults);
    });
  });

  describe('explanation and tags', () => {
    it('names the mentor and the goal in the explanation', () => {
      const result = service.calculateMatch(
        makeMentor({ name: 'Carlos Mendoza' }),
        makeGoal({ title: 'Cambiar a product management' })
      );

      expect(result.explanation).toContain('Carlos Mendoza');
      expect(result.explanation.length).toBeGreaterThan(0);
    });

    it('returns between 1 and 3 tags (§10)', () => {
      const result = service.calculateMatch(makeMentor(), makeGoal());

      expect(result.tags.length).toBeGreaterThanOrEqual(1);
      expect(result.tags.length).toBeLessThanOrEqual(3);
    });

    it('flags solid experience and a high rating', () => {
      const result = service.calculateMatch(
        makeMentor({ experience: 12, rating: 4.9 }),
        makeGoal()
      );

      expect(result.tags).toContain('Experiencia sólida');
      expect(result.tags).toContain('Altamente calificado');
    });

    it('does not claim experience for a junior mentor', () => {
      const result = service.calculateMatch(
        makeMentor({ experience: 2, rating: 4.0 }),
        makeGoal()
      );

      expect(result.tags).not.toContain('Experiencia sólida');
    });
  });

  describe('unknown categories', () => {
    it('falls back to default thresholds instead of throwing', () => {
      const goal = makeGoal({ category: 'categoria-inexistente' });

      expect(() => service.calculateMatch(makeMentor(), goal)).not.toThrow();
      expect(service.calculateMatch(makeMentor(), goal).percentage).toBeGreaterThan(0);
    });

    it('handles an empty goal description', () => {
      const goal = makeGoal({ title: '', description: '' });

      expect(() => service.calculateMatch(makeMentor(), goal)).not.toThrow();
    });
  });
});
