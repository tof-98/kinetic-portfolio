export const TICK = [
  'Java', 'Spring Boot', 'React', 'PostgreSQL', 'Docker',
  'SAML SSO', 'Solr', 'REST APIs', 'Linux', 'TOTP', 'TypeScript', 'Security-first',
];

export interface Project {
  n: string;
  hue: string;
  size: 'big' | 'med';
  glyph: [string, string];
  group: string;
  scale: string;
  name: string;
  desc: string;
  tags: string[];
}

export const HL: Project[] = [
  {
    n: '01', hue: 'h-1', size: 'big', glyph: ['TOTP', 'MFA'],
    group: 'Auth · Security', scale: 'Austria + Germany',
    name: 'TOTP Multi-Factor Auth',
    desc: 'Rolled out across a platform serving library institutions throughout Austria and Germany, including Innsbruck\'s main public library.',
    tags: ['Spring Boot', 'Spring Security', 'TOTP'],
  },
  {
    n: '02', hue: 'h-2', size: 'big', glyph: ['EMAIL', 'API'],
    group: 'API · Integration', scale: 'Multi-tenant',
    name: 'Transactional Email API',
    desc: 'Adopted by multiple client institutions — resolving the delayed and dropped delivery the legacy SMTP setup failed to prioritise.',
    tags: ['Java', 'Spring Boot', 'Scaleway'],
  },
  {
    n: '03', hue: 'h-3', size: 'med', glyph: ['SAML', 'SSO'],
    group: 'Auth · Enterprise', scale: 'Federated access',
    name: 'SAML SSO Integration',
    desc: 'Federated access for a Vorarlberg library partner\'s customers to the shared online catalog system.',
    tags: ['SAML', 'Spring Boot', 'Java'],
  },
  {
    n: '04', hue: 'h-4', size: 'med', glyph: ['STAR', 'RATINGS'],
    group: 'Full Stack · UX', scale: 'Per-institution',
    name: 'Book Star-Rating System',
    desc: 'Optional anonymous-rating prevention with per-institution admin controls. Very positive client feedback.',
    tags: ['Spring Boot', 'PHP', 'Drupal'],
  },
  {
    n: '05', hue: 'h-5', size: 'med', glyph: ['SOLR', 'SEARCH'],
    group: 'Search · Feature', scale: 'Tiroler Landesmuseen',
    name: 'Solr Autocomplete Search',
    desc: 'Autocomplete search and a reusable Drupal filtering module for Tiroler Landesmuseen — one of Innsbruck\'s largest cultural institutions.',
    tags: ['Solr', 'Drupal', 'JS'],
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
    name: 'Backend', note: 'daily driver',
    items: [['Java', 3], ['Spring Boot', 3], ['REST APIs', 3], ['PHP / Symfony', 2], ['Drupal', 2]],
  },
  {
    name: 'Frontend', note: 'ships UI solo',
    items: [['JavaScript', 3], ['React', 2], ['TypeScript', 2]],
  },
  {
    name: 'Data / DevOps', ghost: 'DevOps', note: 'production-grade',
    items: [['PostgreSQL', 3], ['Git', 3], ['Linux', 2], ['Solr', 2]],
  },
  {
    name: 'Security / AI', ghost: 'Security', note: 'security-first',
    items: [['Cyber Security', 2], ['AI Agentic', 2], ['Python', 1]],
  },
];
