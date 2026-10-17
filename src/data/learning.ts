import { LearningItem } from '../types/portfolio';

/**
 * Honest, transparent learning journey and current technical milestones.
 * Shows dedication to growth without exaggerating senior experience.
 */
export const learningJourneyData: LearningItem[] = [
  {
    id: 'learning-typescript',
    title: 'Deepening TypeScript & Type Systems',
    status: 'In Progress',
    description:
      'Moving beyond basic type annotations into advanced generics, conditional types, template literal types, and type narrowing patterns in real-world libraries.',
    topics: ['Generic constraints', 'Discriminated unions', 'Utility types', 'Strict tsconfig setup'],
    resourcesOrGoals: 'Reading TypeScript Handbook & refactoring legacy JavaScript utility libraries.',
  },
  {
    id: 'learning-backend-security',
    title: 'Secure Authentication & Web Application Security',
    status: 'In Progress',
    description:
      'Understanding the mechanics of modern authentication: secure cookie storage, CSRF tokens, JWT rotation strategies, and defensive coding against OWASP Top 10 vulnerabilities.',
    topics: ['HTTP-only cookies', 'CORS policies', 'Rate limiting', 'SQL injection mitigation'],
    resourcesOrGoals: 'Building minimal proof-of-concept auth microservices with Node.js and Express.',
  },
  {
    id: 'learning-react-architecture',
    title: 'Maintainable Component Design & Accessibility',
    status: 'Milestone',
    description:
      'Focusing on high-cohesion component structures, custom hook extraction, reducing unnecessary re-renders, and meeting WCAG 2.2 AA accessibility guidelines.',
    topics: ['Compound components', 'Custom hooks', 'ARIA landmarks & keyboard navigation', 'Performance profiling'],
    resourcesOrGoals: 'Auditing personal projects with Lighthouse and screen readers (NVDA/VoiceOver).',
  },
  {
    id: 'learning-devops-ci',
    title: 'Deployment Workflows & Cloud Fundamentals',
    status: 'Planned',
    description:
      'Learning the fundamentals of modern web deployment pipelines, automated linting/testing in GitHub Actions, and container orchestration basics.',
    topics: ['GitHub Actions CI/CD', 'Vercel edge caching', 'Docker multi-stage builds', 'Environment isolation'],
    resourcesOrGoals: 'Setting up automated check suites on all upcoming GitHub repositories.',
  },
];
