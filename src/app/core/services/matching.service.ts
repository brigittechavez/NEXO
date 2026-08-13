import { Injectable } from '@angular/core';
import { MentorDetail } from '../data/mentors.data';
import { Goal } from '../models/goal.model';

export interface MatchResult {
  mentorId: string;
  percentage: number;
  explanation: string;
  tags: string[];
}

export interface MatchingWeights {
  experience: number;
  trajectorySimilarity: number;
  rating: number;
  price: number;
  availability: number;
  affinity: number;
}

const DEFAULT_WEIGHTS: MatchingWeights = {
  experience: 30,
  trajectorySimilarity: 25,
  rating: 20,
  price: 10,
  availability: 10,
  affinity: 5,
};

@Injectable({ providedIn: 'root' })
export class MatchingService {
  private weights: MatchingWeights = { ...DEFAULT_WEIGHTS };

  constructor() {}

  setWeights(weights: Partial<MatchingWeights>): void {
    this.weights = { ...this.weights, ...weights };
  }

  getWeights(): MatchingWeights {
    return { ...this.weights };
  }

  resetWeights(): void {
    this.weights = { ...DEFAULT_WEIGHTS };
  }

  calculateMatch(mentor: MentorDetail, menteeGoal: Goal): MatchResult {
    const experienceScore = this.calculateExperienceScore(mentor, menteeGoal);
    const trajectoryScore = this.calculateTrajectoryScore(mentor, menteeGoal);
    const ratingScore = this.calculateRatingScore(mentor);
    const priceScore = this.calculatePriceScore(mentor);
    const availabilityScore = this.calculateAvailabilityScore(mentor);
    const affinityScore = this.calculateAffinityScore(mentor, menteeGoal);

    const totalPercentage =
      experienceScore * this.weights.experience / 100 +
      trajectoryScore * this.weights.trajectorySimilarity / 100 +
      ratingScore * this.weights.rating / 100 +
      priceScore * this.weights.price / 100 +
      availabilityScore * this.weights.availability / 100 +
      affinityScore * this.weights.affinity / 100;

    const percentage = Math.min(Math.round(totalPercentage), 100);
    const explanation = this.generateExplanation(mentor, menteeGoal, percentage);
    const tags = this.generateMatchTags(mentor, menteeGoal, percentage);

    return {
      mentorId: mentor.id,
      percentage,
      explanation,
      tags,
    };
  }

  private calculateExperienceScore(mentor: MentorDetail, goal: Goal): number {
    const categoryGoals: Record<string, number[]> = {
      tecnologia: [3, 5, 8],
      negocios: [5, 8, 12],
      marketing: [3, 5, 7],
      ciencia: [5, 8, 10],
      carrera: [3, 5, 8],
      liderazgo: [5, 10, 15],
      productividad: [3, 5, 7],
    };

    const targets = categoryGoals[goal.category] || [3, 5, 8];
    const experience = mentor.experience;

    if (experience >= targets[2]) return 100;
    if (experience >= targets[1]) return 80;
    if (experience >= targets[0]) return 60;
    return Math.max(30, (experience / targets[0]) * 60);
  }

  private calculateTrajectoryScore(mentor: MentorDetail, goal: Goal): number {
    const goalKeywords = this.extractKeywords(goal.title + ' ' + goal.description);
    const mentorKeywords = new Set([
      ...mentor.specialties.map(s => s.toLowerCase()),
      ...mentor.tags.map(t => t.toLowerCase()),
    ]);

    let matches = 0;
    goalKeywords.forEach(kw => {
      if (mentorKeywords.has(kw)) matches++;
    });

    const matchRatio = matches / Math.max(goalKeywords.length, 1);
    return Math.min(Math.round(matchRatio * 120), 100);
  }

  private calculateRatingScore(mentor: MentorDetail): number {
    if (mentor.rating >= 4.9) return 100;
    if (mentor.rating >= 4.8) return 90;
    if (mentor.rating >= 4.7) return 80;
    if (mentor.rating >= 4.5) return 70;
    return Math.round(mentor.rating * 15);
  }

  private calculatePriceScore(mentor: MentorDetail): number {
    const freeMentorships = mentor.mentorshipDetails.filter(ms => ms.isFree);
    if (freeMentorships.length > 0) return 100;

    const minPrice = Math.min(...mentor.mentorshipDetails.map(ms => ms.price));
    if (minPrice <= 100) return 90;
    if (minPrice <= 150) return 80;
    if (minPrice <= 200) return 70;
    if (minPrice <= 250) return 60;
    return 50;
  }

  private calculateAvailabilityScore(mentor: MentorDetail): number {
    const slots = mentor.availability.length;
    if (slots >= 5) return 100;
    if (slots >= 4) return 85;
    if (slots >= 3) return 70;
    if (slots >= 2) return 55;
    return 40;
  }

  private calculateAffinityScore(mentor: MentorDetail, goal: Goal): number {
    const mentorTags = mentor.tags;
    const goalCategory = goal.category;

    const categoryTagMap: Record<string, string[]> = {
      tecnologia: ['frontend', 'backend', 'data', 'angular', 'react', 'python', 'javascript'],
      negocios: ['emprendimiento', 'startups', 'ventas', 'negociación', 'fintech'],
      marketing: ['marketing', 'digital', 'growth', 'branding', 'contenido'],
      ciencia: ['ciencia', 'investigación', 'academia', 'data', 'estadística'],
      carrera: ['carrera', 'entrevistas', 'cv', 'linkedin', 'transición'],
      liderazgo: ['liderazgo', 'hr', 'personas', 'cultura', 'equipos'],
      productividad: ['productividad', 'hábitos', 'tiempo', 'enfoque', 'metodologías'],
    };

    const relevantTags = categoryTagMap[goalCategory] || [];
    const matches = mentorTags.filter(t => relevantTags.includes(t)).length;

    return Math.min(Math.round((matches / Math.max(relevantTags.length, 1)) * 150), 100);
  }

  private extractKeywords(text: string): string[] {
    const stopWords = new Set([
      'el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'al', 'en', 'con', 'por',
      'para', 'como', 'que', 'es', 'mi', 'su', 'se', 'no', 'más', 'este', 'esta',
      'yo', 'tu', 'el', 'ella', 'nos', 'vos', 'ser', 'estar', 'haber', 'tener',
    ]);

    return text
      .toLowerCase()
      .replace(/[^\w\sáéíóúñ]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));
  }

  private generateExplanation(mentor: MentorDetail, goal: Goal, percentage: number): string {
    if (percentage >= 85) {
      return `${mentor.name} es un excelente match para tu objetivo. Su experiencia en ${mentor.specialties[0]} y su trayectoria se alinean directamente con tu meta de "${goal.title.toLowerCase()}".`;
    }
    if (percentage >= 70) {
      return `${mentor.name} tiene una buena alineación con tu objetivo. Su perfil en ${mentor.specialties.slice(0, 2).join(' y ')} puede aportarte valor significativo.`;
    }
    if (percentage >= 50) {
      return `${mentor.name} puede ser útil para partes de tu objetivo, especialmente en áreas como ${mentor.specialties[0]}. Considera si su enfoque se adapta a lo que necesitas.`;
    }
    return `${mentor.name} tiene experiencia en áreas complementarias a tu objetivo. Podría aportar perspectivas diferentes pero útiles.`;
  }

  private generateMatchTags(mentor: MentorDetail, goal: Goal, percentage: number): string[] {
    const tags: string[] = [];

    if (percentage >= 85) tags.push('Excelente match');
    else if (percentage >= 70) tags.push('Buen match');
    else tags.push('Match parcial');

    if (mentor.experience >= 8) tags.push('Experiencia sólida');
    if (mentor.rating >= 4.8) tags.push('Altamente calificado');

    const hasRelevantSpecialty = mentor.specialties.some(s =>
      goal.description.toLowerCase().includes(s.toLowerCase()) ||
      goal.title.toLowerCase().includes(s.toLowerCase())
    );
    if (hasRelevantSpecialty) tags.push('Especialidad relevante');

    return tags.slice(0, 3);
  }
}
