import { ProjectItem } from '../types/portfolio';

/**
 * Featured and sample portfolio projects.
 * NOTE: As required, these sample entries are clearly labeled as editable templates
 * to preserve authenticity until the developer deploys their own repositories and live demos.
 * Links gracefully handle undefined / missing states without dead anchors.
 */
export const projectsData: ProjectItem[] = [
  {
    id: 'project-task-management',
    title: 'FlowTask - Collaborative Kanban Board',
    shortDescription:
      'A full-stack task management application with drag-and-drop boards, priority tagging, and optimistic UI updates.',
    fullDescription:
      'Built as an architectural exploration of state management and responsive UI design. Features dynamic task filtering, subtask progress tracking, and client-side persistence with planned backend synchronization.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
    category: 'Full-Stack',
    featured: true,
    sampleNotice: 'Sample Project Template - Ready for your repo & demo URL',
    // Realistic placeholders: set to undefined or empty to showcase graceful button disabling/handling
    liveDemoUrl: undefined,
    sourceCodeUrl: 'https://github.com/alexrivera-dev',
    highlights: [
      'Accessible keyboard drag-and-drop interface',
      'Optimistic state updates for instant user feedback',
      'Normalized relational schema for users, boards, and cards',
    ],
    imagePlaceholder: {
      accentColor: '#3898EC',
      label: 'FlowTask Board UI',
      codeSnippet: `interface TaskItem {\n  id: string;\n  status: 'todo' | 'in_progress' | 'done';\n  priority: 'low' | 'medium' | 'high';\n}`,
    },
  },
  {
    id: 'project-finance-dashboard',
    title: 'ClearLedger - Personal Finance Tracker',
    shortDescription:
      'An intuitive dashboard for tracking monthly expenses, visualizing cash flow, and setting savings targets.',
    fullDescription:
      'Focused on data visualization and performance when rendering interactive expense summaries. Implements responsive charts, monthly categorization, and CSV export functionality.',
    techStack: ['TypeScript', 'React', 'Tailwind CSS', 'Express.js', 'REST APIs'],
    category: 'Frontend',
    featured: true,
    sampleNotice: 'Sample Project Template - Ready for your repo & demo URL',
    liveDemoUrl: undefined,
    sourceCodeUrl: 'https://github.com/alexrivera-dev',
    highlights: [
      'Custom SVG data visualizations with zero heavy chart dependencies',
      'Client-side currency formatting with Intl.NumberFormat',
      'Strict input validation for transaction values and dates',
    ],
    imagePlaceholder: {
      accentColor: '#60B5FF',
      label: 'ClearLedger Analytics',
      codeSnippet: `const balance = useMemo(() => {\n  return transactions.reduce((acc, curr) =>\n    curr.type === 'income' ? acc + curr.val : acc - curr.val, 0\n  );\n}, [transactions]);`,
    },
  },
  {
    id: 'project-rest-api-service',
    title: 'PulseAPI - Health & Metric Monitoring Service',
    shortDescription:
      'A lightweight RESTful service providing system metric ingestion, API health pings, and structured JSON logs.',
    fullDescription:
      'Designed with clean layered architecture (controllers, services, repositories) emphasizing input sanitization, rate-limiting middleware, and structured error responses.',
    techStack: ['Node.js', 'Express.js', 'TypeScript', 'PostgreSQL', 'Docker'],
    category: 'Backend / API',
    featured: true,
    sampleNotice: 'Sample Project Template - Ready for your repo & demo URL',
    liveDemoUrl: undefined,
    sourceCodeUrl: 'https://github.com/alexrivera-dev',
    highlights: [
      'Configurable express-rate-limit protecting public endpoints',
      'Graceful error handling avoiding stack trace leakage in production',
      'Automated integration tests with Jest and Supertest',
    ],
    imagePlaceholder: {
      accentColor: '#172B4D',
      label: 'PulseAPI Architecture',
      codeSnippet: `app.use(rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 100,\n  standardHeaders: true,\n}));`,
    },
  },
];
