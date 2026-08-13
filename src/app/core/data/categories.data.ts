export interface CategoryObjectives {
  categorySlug: string;
  objectives: string[];
}

export const CATEGORY_OBJECTIVES: CategoryObjectives[] = [
  {
    categorySlug: 'tecnologia',
    objectives: [
      'Conseguir mi primer trabajo en frontend',
      'Cambiar hacia data science',
      'Prepararme para entrevistas técnicas',
      'Aprender Angular o React desde cero',
      'Mejorar la arquitectura de mi proyecto actual',
    ],
  },
  {
    categorySlug: 'negocios',
    objectives: [
      'Crear mi primera startup',
      'Validar una idea de negocio',
      'Buscar inversión para mi empresa',
      'Mejorar la estrategia comercial de mi negocio',
      'Aprender sobre lean startup',
    ],
  },
  {
    categorySlug: 'marketing',
    objectives: [
      'Crear mi marca personal',
      'Diseñar mi estrategia de marketing digital',
      'Aprender growth marketing desde cero',
      'Mejorar el rendimiento de mis campañas',
      'Generar contenido que conecte con mi audiencia',
    ],
  },
  {
    categorySlug: 'ciencia',
    objectives: [
      'Iniciar un doctorado en el extranjero',
      'Publicar en revistas de alto impacto',
      'Definir mi carrera en investigación',
      'Transicionar de ciencias puras a data science',
      'Aprender metodología de investigación',
    ],
  },
  {
    categorySlug: 'carrera',
    objectives: [
      'Prepararme para entrevistas de trabajo',
      'Reorientar mi carrera profesional',
      'Construir mi portafolio profesional',
      'Negociar mejoras salariales',
      'Desarrollar mi marca personal en LinkedIn',
    ],
  },
  {
    categorySlug: 'liderazgo',
    objectives: [
      'Desarrollar mi estilo de liderazgo',
      'Mejorar la cultura de mi equipo',
      'Gestionar el cambio organizacional',
      'Prepararme para un rol gerencial',
      'Aprender a dar feedback efectivo',
    ],
  },
  {
    categorySlug: 'productividad',
    objectives: [
      'Crear hábitos de productividad sostenibles',
      'Optimizar mi rutina diaria de trabajo',
      'Mejorar mi gestión del tiempo',
      'Aprender metodologías de trabajo efectivas',
      'Reducir el procrastinación y aumentar el enfoque',
    ],
  },
];
