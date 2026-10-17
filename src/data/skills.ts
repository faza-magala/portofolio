import { SkillItem } from '../types/portfolio';

/**
 * Technical skills grouped by category with honest proficiency indicators.
 * Proficiencies:
 * - 'Proficient': Hands-on experience building projects and working with core patterns.
 * - 'Learning': Currently actively practicing and applying in code.
 * - 'Exploring': Investigating foundational concepts and best practices.
 */
export const skillsData: SkillItem[] = [
  // Frontend
  {
    name: 'TypeScript',
    category: 'frontend',
    proficiency: 'Proficient',
    description: 'Type safety, generics, interfaces, strict configuration',
    isFocus: true,
  },
  {
    name: 'React',
    category: 'frontend',
    proficiency: 'Proficient',
    description: 'Hooks, component lifecycles, state management, accessibility',
    isFocus: true,
  },
  {
    name: 'HTML5 & Semantic Markup',
    category: 'frontend',
    proficiency: 'Proficient',
    description: 'Accessible semantic structures, WCAG 2.2 standards, SEO tags',
  },
  {
    name: 'Tailwind CSS',
    category: 'frontend',
    proficiency: 'Proficient',
    description: 'Responsive utilities, custom design tokens, modern layouts',
  },
  {
    name: 'JavaScript (ES6+)',
    category: 'frontend',
    proficiency: 'Proficient',
    description: 'Asynchronous patterns, DOM events, modern language features',
  },
  {
    name: 'Next.js',
    category: 'frontend',
    proficiency: 'Learning',
    description: 'App Router, Server Components, client-server data fetching',
  },

  // Backend
  {
    name: 'Node.js',
    category: 'backend',
    proficiency: 'Proficient',
    description: 'Runtime environment, asynchronous I/O, npm ecosystem',
    isFocus: true,
  },
  {
    name: 'Express.js',
    category: 'backend',
    proficiency: 'Proficient',
    description: 'REST API design, routing, custom middleware, error handling',
  },
  {
    name: 'RESTful API Design',
    category: 'backend',
    proficiency: 'Proficient',
    description: 'HTTP methods, status codes, payload validation, statelessness',
  },
  {
    name: 'Authentication & Security',
    category: 'backend',
    proficiency: 'Learning',
    description: 'JWT validation, bcrypt password hashing, CORS, rate limiting',
  },

  // Databases
  {
    name: 'PostgreSQL',
    category: 'databases',
    proficiency: 'Proficient',
    description: 'Relational schema design, SQL queries, foreign keys, indexing',
    isFocus: true,
  },
  {
    name: 'Prisma ORM',
    category: 'databases',
    proficiency: 'Learning',
    description: 'Type-safe queries, migrations, relational modeling',
  },
  {
    name: 'MongoDB',
    category: 'databases',
    proficiency: 'Exploring',
    description: 'Document data model, Mongoose schemas, aggregation basics',
  },

  // Tools & Workflow
  {
    name: 'Git & GitHub',
    category: 'tools',
    proficiency: 'Proficient',
    description: 'Branching strategies, pull requests, semantic commit messages',
  },
  {
    name: 'Vite',
    category: 'tools',
    proficiency: 'Proficient',
    description: 'Fast HMR, modern build pipelines, Rollup chunking',
  },
  {
    name: 'ESLint & Prettier',
    category: 'tools',
    proficiency: 'Proficient',
    description: 'Automated code standards, static analysis, formatting consistency',
  },
  {
    name: 'Docker Basics',
    category: 'tools',
    proficiency: 'Learning',
    description: 'Containerizing Node applications, docker-compose for local dev',
  },
  {
    name: 'Vercel Deployment',
    category: 'tools',
    proficiency: 'Proficient',
    description: 'CI/CD preview deployments, environment variables, security headers',
  },
];
