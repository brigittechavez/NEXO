export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  mentorCount: number;
}

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Tecnología', slug: 'tecnologia', icon: '⚡', description: 'Desarrollo, datos, IA, producto', mentorCount: 4 },
  { id: '2', name: 'Negocios y emprendimiento', slug: 'negocios', icon: '↗', description: 'Startups, finanzas, estrategia', mentorCount: 3 },
  { id: '3', name: 'Marketing y comunicación', slug: 'marketing', icon: '→', description: 'Branding, digital, contenido', mentorCount: 2 },
  { id: '4', name: 'Ciencia e investigación', slug: 'ciencia', icon: '✦', description: 'Investigación, datos, academia', mentorCount: 3 },
  { id: '5', name: 'Carrera y empleabilidad', slug: 'carrera', icon: '●', description: 'Transiciones, CV, entrevistas', mentorCount: 2 },
  { id: '6', name: 'Liderazgo y management', slug: 'liderazgo', icon: '+', description: 'Equipos, cultura, gestión', mentorCount: 2 },
  { id: '7', name: 'Productividad y desarrollo profesional', slug: 'productividad', icon: '→', description: 'Hábitos, carrera, growth', mentorCount: 2 },
];
