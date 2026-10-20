import { db, schema } from './index';
import { hashPassword } from '../utils/crypto';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

export async function seedDatabase() {
  console.log('Seeding initial portfolio CMS database...');

  // 1. Seed or Verify Administrator User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin12345!';
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';

  const existingAdmin = await db.select().from(schema.users).where(eq(schema.users.email, adminEmail)).get();

  if (!existingAdmin) {
    const passwordHash = await hashPassword(adminPassword);
    await db.insert(schema.users).values({
      id: 'user-admin-default',
      username: adminUsername,
      email: adminEmail,
      passwordHash,
      role: 'admin',
    });
    console.log(`[SEED] Created default admin account: ${adminEmail}`);
  } else {
    console.log(`[SEED] Admin account ${adminEmail} already exists.`);
  }

  // 2. Seed Profile Information
  const existingProfile = await db.select().from(schema.profile).where(eq(schema.profile.id, 'default')).get();
  if (!existingProfile) {
    await db.insert(schema.profile).values({
      id: 'default',
      name: 'Faza Ghaisan Abdillah',
      role: 'Software Engineer',
      eyebrow: 'SOFTWARE ENGINEER',
      headline: 'Building digital experiences that are simple, useful, and impactful.',
      shortBio: "I'm a software engineer who enjoys turning ideas into functional, user-friendly web applications. I'm continuously learning, building projects, and improving my engineering skills.",
      fullBio: JSON.stringify([
        "I began my programming journey driven by curiosity about how modern software powers everyday life. Over time, that curiosity evolved into a dedicated commitment to building reliable web applications across the entire stack.",
        "On the frontend, I focus on crafting clean, accessible interfaces using React, TypeScript, and semantic HTML. On the backend, I enjoy structuring clean RESTful APIs, modeling relational databases, and understanding how data securely flows through distributed systems.",
        "I prioritize clean architecture, readability, and continuous self-improvement over shortcuts. When I'm not writing code, I'm reading engineering blogs, exploring open-source codebases, or sharpening my problem-solving skills.",
      ]),
      location: 'Bandung, Indonesia (Open to Remote)',
      available: true,
      statusLabel: 'Open to junior roles & internships',
      preferredStyle: 'Clean code, modern TypeScript, and pragmatic architecture',
      learningFocus: 'Full-stack system architecture, TypeScript depth & secure APIs',
      avatarUrl: '',
      avatarInitials: 'FG',
    });
    console.log('[SEED] Profile data inserted.');
  }

  // 3. Seed Site Settings
  const existingSettings = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.id, 'default')).get();
  if (!existingSettings) {
    await db.insert(schema.siteSettings).values({
      id: 'default',
      siteTitle: 'Faza Ghaisan Abdillah | Software Engineer',
      siteDescription: 'Personal portfolio of Faza Ghaisan Abdillah, an aspiring Fullstack Software Engineer specializing in React, TypeScript, Node.js, and modern web application development.',
      siteUrl: 'https://faza-portfolio.vercel.app',
      contactEmail: 'faza.ghaisan@example.com',
      githubUrl: 'https://github.com/faza-magala',
      linkedinUrl: 'https://linkedin.com/in/faza-ghaisan',
      collaborativeInvite: 'Whether you have a question, an opportunity, or just want to discuss software engineering, feel free to reach out!',
      footerText: 'Faza Ghaisan Abdillah. Crafted with React, Hono, and Turso.',
    });
    console.log('[SEED] Site settings inserted.');
  }

  // 4. Seed Skills
  const existingSkills = await db.select().from(schema.skills).all();
  if (existingSkills.length === 0) {
    const skillsList = [
      { name: 'TypeScript', category: 'frontend', proficiency: 'Proficient', description: 'Type safety, generics, interfaces, strict configuration', isFocus: true, displayOrder: 1 },
      { name: 'React', category: 'frontend', proficiency: 'Proficient', description: 'Hooks, component lifecycles, state management, accessibility', isFocus: true, displayOrder: 2 },
      { name: 'HTML5 & Semantic Markup', category: 'frontend', proficiency: 'Proficient', description: 'Accessible semantic structures, WCAG 2.2 standards, SEO tags', isFocus: false, displayOrder: 3 },
      { name: 'Tailwind CSS', category: 'frontend', proficiency: 'Proficient', description: 'Responsive utilities, custom design tokens, modern layouts', isFocus: false, displayOrder: 4 },
      { name: 'JavaScript (ES6+)', category: 'frontend', proficiency: 'Proficient', description: 'Asynchronous patterns, DOM events, modern language features', isFocus: false, displayOrder: 5 },
      { name: 'Next.js', category: 'frontend', proficiency: 'Learning', description: 'App Router, Server Components, client-server data fetching', isFocus: false, displayOrder: 6 },
      { name: 'Node.js', category: 'backend', proficiency: 'Proficient', description: 'Runtime environment, asynchronous I/O, npm ecosystem', isFocus: true, displayOrder: 7 },
      { name: 'Hono / Express.js', category: 'backend', proficiency: 'Proficient', description: 'REST API design, routing, custom middleware, error handling', isFocus: true, displayOrder: 8 },
      { name: 'RESTful API Design', category: 'backend', proficiency: 'Proficient', description: 'HTTP methods, status codes, payload validation, statelessness', isFocus: false, displayOrder: 9 },
      { name: 'Authentication & Security', category: 'backend', proficiency: 'Learning', description: 'Session tokens, Argon2/scrypt password hashing, CORS, rate limiting', isFocus: false, displayOrder: 10 },
      { name: 'PostgreSQL & SQLite', category: 'databases', proficiency: 'Proficient', description: 'Relational schema design, SQL queries, foreign keys, indexing', isFocus: true, displayOrder: 11 },
      { name: 'Drizzle ORM & Prisma', category: 'databases', proficiency: 'Proficient', description: 'Type-safe queries, migrations, relational modeling', isFocus: false, displayOrder: 12 },
      { name: 'Turso (LibSQL)', category: 'databases', proficiency: 'Proficient', description: 'Edge SQLite database, replication, serverless integration', isFocus: false, displayOrder: 13 },
      { name: 'Git & GitHub', category: 'tools', proficiency: 'Proficient', description: 'Branching strategies, pull requests, semantic commit messages', isFocus: false, displayOrder: 14 },
      { name: 'Vite', category: 'tools', proficiency: 'Proficient', description: 'Fast HMR, modern build pipelines, Rollup chunking', isFocus: false, displayOrder: 15 },
      { name: 'Docker Basics', category: 'tools', proficiency: 'Learning', description: 'Containerizing Node applications, docker-compose for local dev', isFocus: false, displayOrder: 16 },
      { name: 'Vercel Deployment', category: 'tools', proficiency: 'Proficient', description: 'CI/CD preview deployments, environment variables, security headers', isFocus: false, displayOrder: 17 },
    ];

    for (const skill of skillsList) {
      await db.insert(schema.skills).values({
        id: `skill-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        description: skill.description,
        isFocus: skill.isFocus,
        displayOrder: skill.displayOrder,
      });
    }
    console.log(`[SEED] Inserted ${skillsList.length} skills.`);
  }

  // 5. Seed Projects
  const existingProjects = await db.select().from(schema.projects).all();
  if (existingProjects.length === 0) {
    const projectsList = [
      {
        id: 'project-portfolio-cms',
        slug: 'full-stack-portfolio-cms',
        title: 'Full-Stack Developer Portfolio CMS',
        shortDescription: 'Production-ready full-stack portfolio with secure administration dashboard, Turso SQLite database, Hono API, and Cloudinary media management.',
        fullDescription: 'Built with React 18, TypeScript, Tailwind CSS, Hono, Drizzle ORM, Turso, and Cloudinary. Implements server-side session authentication with scrypt, CSRF protection, rate limiting, and a dynamic admin CMS allowing complete CRUD management without modifying source code.',
        category: 'Full-Stack',
        techStack: JSON.stringify(['React', 'TypeScript', 'Hono', 'Drizzle ORM', 'Turso', 'Tailwind CSS']),
        featured: true,
        status: 'published',
        liveDemoUrl: 'https://faza-portfolio.vercel.app',
        sourceCodeUrl: 'https://github.com/faza-magala/portofolio',
        coverImageUrl: '',
        highlights: JSON.stringify([
          'Full-featured admin dashboard with real-time statistics',
          'Database-driven CMS with normalized relational schema on Turso',
          'Strict Zod validation on both client and server',
          'Zero-leak security architecture with HttpOnly session cookies',
        ]),
        displayOrder: 1,
      },
      {
        id: 'project-flowtask',
        slug: 'flowtask-collaborative-kanban-board',
        title: 'FlowTask - Collaborative Kanban Board',
        shortDescription: 'A full-stack task management application with drag-and-drop boards, priority tagging, and optimistic UI updates.',
        fullDescription: 'Built as an architectural exploration of state management and responsive UI design. Features dynamic task filtering, subtask progress tracking, and client-side persistence with planned backend synchronization.',
        category: 'Full-Stack',
        techStack: JSON.stringify(['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL']),
        featured: true,
        status: 'published',
        liveDemoUrl: '',
        sourceCodeUrl: 'https://github.com/faza-magala',
        coverImageUrl: '',
        highlights: JSON.stringify([
          'Accessible keyboard drag-and-drop interface',
          'Optimistic state updates for instant user feedback',
          'Normalized relational schema for users, boards, and cards',
        ]),
        displayOrder: 2,
      },
      {
        id: 'project-clearledger',
        slug: 'clearledger-personal-finance-tracker',
        title: 'ClearLedger - Personal Finance Tracker',
        shortDescription: 'An intuitive dashboard for tracking monthly expenses, visualizing cash flow, and setting savings targets.',
        fullDescription: 'Focused on data visualization and performance when rendering interactive expense summaries. Implements responsive charts, monthly categorization, and CSV export functionality.',
        category: 'Frontend',
        techStack: JSON.stringify(['TypeScript', 'React', 'Tailwind CSS', 'Express.js', 'REST APIs']),
        featured: true,
        status: 'published',
        liveDemoUrl: '',
        sourceCodeUrl: 'https://github.com/faza-magala',
        coverImageUrl: '',
        highlights: JSON.stringify([
          'Custom SVG data visualizations with zero heavy chart dependencies',
          'Client-side currency formatting with Intl.NumberFormat',
          'Strict input validation for transaction values and dates',
        ]),
        displayOrder: 3,
      },
      {
        id: 'project-pulseapi',
        slug: 'pulseapi-health-metric-monitoring-service',
        title: 'PulseAPI - Health & Metric Monitoring Service',
        shortDescription: 'A lightweight RESTful service providing system metric ingestion, API health pings, and structured JSON logs.',
        fullDescription: 'Designed with clean layered architecture (controllers, services, repositories) emphasizing input sanitization, rate-limiting middleware, and structured error responses.',
        category: 'Backend / API',
        techStack: JSON.stringify(['Node.js', 'Express.js', 'TypeScript', 'PostgreSQL', 'Docker']),
        featured: true,
        status: 'published',
        liveDemoUrl: '',
        sourceCodeUrl: 'https://github.com/faza-magala',
        coverImageUrl: '',
        highlights: JSON.stringify([
          'Configurable rate-limiting protecting public endpoints',
          'Graceful error handling avoiding stack trace leakage in production',
          'Automated integration tests with Jest and Supertest',
        ]),
        displayOrder: 4,
      },
    ];

    for (const project of projectsList) {
      await db.insert(schema.projects).values(project);
    }
    console.log(`[SEED] Inserted ${projectsList.length} projects.`);
  }

  // 6. Seed Learning Journey
  const existingLearning = await db.select().from(schema.learningJourney).all();
  if (existingLearning.length === 0) {
    const learningList = [
      {
        id: 'learning-typescript',
        title: 'Deepening TypeScript & Type Systems',
        status: 'In Progress',
        description: 'Moving beyond basic type annotations into advanced generics, conditional types, template literal types, and type narrowing patterns in real-world libraries.',
        topics: JSON.stringify(['Generic constraints', 'Discriminated unions', 'Utility types', 'Strict tsconfig setup']),
        resourcesOrGoals: 'Reading TypeScript Handbook & refactoring legacy JavaScript utility libraries.',
        displayOrder: 1,
      },
      {
        id: 'learning-backend-security',
        title: 'Secure Authentication & Web Application Security',
        status: 'In Progress',
        description: 'Understanding the mechanics of modern authentication: secure cookie storage, CSRF tokens, session rotation, and defensive coding against OWASP Top 10 vulnerabilities.',
        topics: JSON.stringify(['HttpOnly cookies', 'CORS policies', 'Rate limiting', 'SQL injection mitigation']),
        resourcesOrGoals: 'Building minimal proof-of-concept auth microservices with Node.js and Hono.',
        displayOrder: 2,
      },
      {
        id: 'learning-react-architecture',
        title: 'Maintainable Component Design & Accessibility',
        status: 'Milestone',
        description: 'Focusing on high-cohesion component structures, custom hook extraction, reducing unnecessary re-renders, and meeting WCAG 2.2 AA accessibility guidelines.',
        topics: JSON.stringify(['Compound components', 'Custom hooks', 'ARIA landmarks & keyboard navigation', 'Performance profiling']),
        resourcesOrGoals: 'Auditing personal projects with Lighthouse and accessibility tools.',
        displayOrder: 3,
      },
      {
        id: 'learning-devops-ci',
        title: 'Deployment Workflows & Cloud Fundamentals',
        status: 'Planned',
        description: 'Learning the fundamentals of modern web deployment pipelines, automated linting/testing in GitHub Actions, and container orchestration basics.',
        topics: JSON.stringify(['GitHub Actions CI/CD', 'Vercel edge caching', 'Docker multi-stage builds', 'Environment isolation']),
        resourcesOrGoals: 'Setting up automated check suites on all upcoming GitHub repositories.',
        displayOrder: 4,
      },
    ];

    for (const item of learningList) {
      await db.insert(schema.learningJourney).values(item);
    }
    console.log(`[SEED] Inserted ${learningList.length} learning journey milestones.`);
  }

  // 7. Seed Experience & Education
  const existingExp = await db.select().from(schema.experiences).all();
  if (existingExp.length === 0) {
    await db.insert(schema.experiences).values({
      id: 'exp-1',
      company: 'Tech Solutions Studio',
      position: 'Junior Full-Stack Developer',
      employmentType: 'Full-time',
      startDate: '2023',
      endDate: 'Present',
      isCurrent: true,
      description: 'Developing high-performance responsive web applications using React, TypeScript, and modern backend APIs. Collaborating with UI/UX designers and implementing accessible, performant component libraries.',
      technologies: JSON.stringify(['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'PostgreSQL']),
      displayOrder: 1,
    });
    console.log('[SEED] Experience data inserted.');
  }

  const existingEdu = await db.select().from(schema.education).all();
  if (existingEdu.length === 0) {
    await db.insert(schema.education).values({
      id: 'edu-1',
      institution: 'State University',
      degree: 'Bachelor of Computer Science',
      fieldOfStudy: 'Software Engineering & Informatics',
      startDate: '2019',
      endDate: '2023',
      description: 'Graduated with strong foundations in data structures, algorithms, relational database systems, and software engineering principles.',
      displayOrder: 1,
    });
    console.log('[SEED] Education data inserted.');
  }

  // 8. Seed Sample Blog Post
  const existingBlog = await db.select().from(schema.blogPosts).all();
  if (existingBlog.length === 0) {
    await db.insert(schema.blogPosts).values({
      id: 'blog-fullstack-architecture',
      slug: 'building-a-secure-portfolio-cms-with-react-and-hono',
      title: 'Building a Secure Full-Stack Portfolio CMS with React, Hono, and Turso',
      excerpt: 'How I transformed a static frontend portfolio into an independently manageable, secure production CMS with server-side sessions and LibSQL.',
      content: `## The Journey from Static to Database-Driven CMS

As software engineers, having a portfolio website is essential. But hardcoding projects, skills, and articles into TypeScript files becomes tedious quickly.

In this project, I architected a modern, lightweight, full-stack CMS:

### 1. The Technology Choices
- **React 18 & Tailwind CSS**: For crisp, accessible interfaces with instant responsiveness.
- **Hono**: A blazingly fast web framework designed for edge and serverless environments.
- **Turso (LibSQL)**: Distributed SQLite with sub-millisecond query responses and zero server maintenance.
- **Drizzle ORM**: Complete type safety from database query to React components.

### 2. Security First
Authentication is built using server-managed sessions stored in the database with secure \`HttpOnly\`, \`SameSite=Lax\` cookies and cryptographic hashing. Passwords are never stored in plaintext and timing attacks are mitigated.

### 3. Conclusion
A clean architecture with clear boundaries between data, validation, and presentation makes full-stack development both joyful and maintainable!`,
      authorName: 'Faza Ghaisan Abdillah',
      category: 'Web Development',
      tags: JSON.stringify(['Full-Stack', 'React', 'Hono', 'Security', 'TypeScript']),
      status: 'published',
      publishedAt: new Date().toISOString(),
    });
    console.log('[SEED] Sample blog post inserted.');
  }

  // 9. Seed Sample Service & Certification
  const existingServices = await db.select().from(schema.services).all();
  if (existingServices.length === 0) {
    await db.insert(schema.services).values({
      id: 'srv-1',
      title: 'Full-Stack Web Development',
      description: 'End-to-end web application development with React, TypeScript, scalable REST APIs, and relational databases.',
      iconName: 'Code',
      pricingText: 'Available for freelance & contract',
      displayOrder: 1,
    });
  }

  const existingCerts = await db.select().from(schema.certifications).all();
  if (existingCerts.length === 0) {
    await db.insert(schema.certifications).values({
      id: 'cert-1',
      title: 'Full Stack Open Certification',
      issuer: 'University of Helsinki',
      issueDate: '2023',
      credentialUrl: 'https://fullstackopen.com/en/',
      displayOrder: 1,
    });
  }

  // 10. Seed Sample Testimonial
  const existingTestimonials = await db.select().from(schema.testimonials).all();
  if (existingTestimonials.length === 0) {
    await db.insert(schema.testimonials).values({
      id: 'test-1',
      clientName: 'Alex Pratama',
      positionOrCompany: 'Engineering Lead at Digital Spark',
      testimonialText: 'Faza demonstrated outstanding engineering rigor and dedication. His clean code approach, proactive communication, and ability to deliver full-stack features reliably made him a standout collaborator.',
      featured: true,
      displayOrder: 1,
    });
    console.log('[SEED] Sample testimonial inserted.');
  }

  console.log('Seeding completed successfully!');
}

if (process.argv[1]?.includes('seed.ts')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed error:', err);
      process.exit(1);
    });
}
