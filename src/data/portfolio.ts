import type { ImageMetadata } from 'astro';
import gym from '../assets/gym.jpeg';
import church from '../assets/church-left-side.jpeg';
import art from '../assets/art.jpeg';
import food from '../assets/food.jpeg';

export interface Moment {
  title: string;
  image: ImageMetadata;
  objectPosition: string;
}

export const MOMENTS: Moment[] = [
  { title: 'Training', image: gym, objectPosition: '9% top' },
  { title: 'Sacred Art', image: church, objectPosition: '25% bottom' },
  { title: 'Lost in Art', image: art, objectPosition: '5% bottom' },
  { title: 'SLOW DINNER', image: food, objectPosition: '25% bottom' },
];

export const TICK = [
  'Java',
  'Spring Boot',
  'React',
  'PostgreSQL',
  'Docker',
  'SAML SSO',
  'Solr',
  'REST APIs',
  'Linux',
  'TOTP',
  'TypeScript',
  'Security-first',
];

export interface Project {
  n: string;
  hue: string;
  mark: string;
  group: string;
  scale: string;
  name: string;
  desc: string;
  tags: string[];
}

export const HL: Project[] = [
  {
    n: '01',
    hue: 'h-1',
    mark: 'MFA',
    group: 'Auth · Security',
    scale: 'Austria + Germany',
    name: 'TOTP Multi-Factor Auth',
    desc: "Rolled out across a platform serving library institutions throughout Austria and Germany, including Innsbruck's main public library.",
    tags: ['Spring Boot', 'Spring Security', 'TOTP'],
  },
  {
    n: '02',
    hue: 'h-2',
    mark: 'API',
    group: 'API · Integration',
    scale: 'Multi-tenant',
    name: 'Transactional Email API',
    desc: 'Adopted by multiple client institutions — resolving the delayed and dropped delivery the legacy SMTP setup failed to prioritise.',
    tags: ['Java', 'Spring Boot', 'Scaleway'],
  },
  {
    n: '03',
    hue: 'h-3',
    mark: 'SSO',
    group: 'Auth · Enterprise',
    scale: 'Federated access',
    name: 'SAML SSO Integration',
    desc: "Federated access for a Vorarlberg library partner's customers to the shared online catalog system.",
    tags: ['SAML', 'Spring Boot', 'Java'],
  },
  {
    n: '04',
    hue: 'h-4',
    mark: '★',
    group: 'Full Stack · UX',
    scale: 'Per-institution',
    name: 'Book Star-Rating System',
    desc: 'Optional anonymous-rating prevention with per-institution admin controls. Very positive client feedback.',
    tags: ['Spring Boot', 'PHP', 'Drupal'],
  },
  {
    n: '05',
    hue: 'h-5',
    mark: 'SLR',
    group: 'Search · Feature',
    scale: 'Tiroler Landesmuseen',
    name: 'Solr Autocomplete Search',
    desc: "Autocomplete search and a reusable Drupal filtering module for Tiroler Landesmuseen — one of Innsbruck's largest cultural institutions.",
    tags: ['Solr', 'Drupal', 'JS'],
  },
];

export interface ExperienceEntry {
  kind: 'current' | 'role' | 'education';
  hash: string;
  refPt: string;
  refText: string;
  date: string;
  title: string;
  org: string;
  bullets: string[];
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    kind: 'current',
    hash: 'a4f2e1c',
    refPt: 'HEAD →',
    refText: 'main',
    date: '2024 — NOW',
    title: 'Full-Stack Developer',
    org: 'LITTERA Software & Consulting · Hall in Tirol, AT',
    bullets: [
      'Develop and optimise multi-layer web applications — performance, stability, maintainability.',
      'Design and implement RESTful APIs with authentication, documentation, and versioning.',
      'Shipped MFA (TOTP), SAML SSO with external partners, star-rating system, Scaleway email API, RFID migration, Solr autocomplete.',
      'Mentored and supported an intern through onboarding, feedback, and code reviews.',
    ],
  },
  {
    kind: 'role',
    hash: '3e9a17f',
    refPt: 'tag:',
    refText: 'collab',
    date: '2023',
    title: 'Software Developer',
    org: 'Collaborative Project · Syria',
    bullets: [
      'Implemented a full Gantt chart module using dhtmlxGantt (pure PHP, no framework), delivered within 6 months.',
    ],
  },
  {
    kind: 'education',
    hash: '8c1d09b',
    refPt: 'tag:',
    refText: 'edu',
    date: '2016 — 2022',
    title: 'B.Sc. Computer Science',
    org: 'Tishreen University · Syria · EQF 6',
    bullets: [
      'Software Engineering & Information Systems.',
      'Focus on database design, network administration, and software development & analysis.',
    ],
  },
];

export interface SkillDomain {
  name: string;
  ghost?: string;
  note: string;
  items: [string, 1 | 2 | 3][];
}

export const SKILLS: SkillDomain[] = [
  {
    name: 'Backend',
    note: 'daily driver',
    items: [
      ['Java', 3],
      ['Spring Boot', 3],
      ['REST APIs', 3],
      ['PHP / Symfony', 3],
      ['Node', 2],
      ['Spring Security', 2],
      ['Drupal', 2],
      ['Slim Framework', 2],
      ['JUnit', 2],
    ],
  },
  {
    name: 'Frontend',
    note: 'ships UI solo',
    items: [
      ['JavaScript', 3],
      ['TypeScript', 3],
      ['jQuery', 3],
      ['HTML / CSS', 3],
      ['Astro', 3],
      ['Tailwind', 2],
      ['React', 2],
    ],
  },
  {
    name: 'Data / DevOps',
    ghost: 'DevOps',
    note: 'production-grade',
    items: [
      ['Git', 3],
      ['Docker', 3],
      ['PostgreSQL', 3],
      ['SQL', 3],
      ['MariaDB', 3],
      ['Linux', 2],
      ['Solr', 2],
      ['Nginx', 2],
      ['GitHub Actions', 2],
    ],
  },
  {
    name: 'Security',
    ghost: 'Security',
    note: 'security-first',
    items: [
      ['Cyber Security', 2],
      ['JWT', 2],
      ['SSO', 2],
      ['Python', 1],
    ],
  },
];
