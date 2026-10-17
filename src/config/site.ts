import { SiteConfig } from '../types/portfolio';

/**
 * Central site configuration for personal details, metadata, and contact links.
 * Easily customize these values to personalize your portfolio.
 */
export const siteConfig: SiteConfig = {
  developer: {
    name: 'Alex Rivera',
    role: 'Aspiring Fullstack Developer',
    eyebrow: 'FULLSTACK DEVELOPER',
    headline: 'Building digital experiences that are simple, useful, and impactful.',
    shortBio:
      "I'm an aspiring Fullstack Developer who enjoys turning ideas into functional, user-friendly web applications. I'm continuously learning, building projects, and improving my engineering skills.",
    fullBio: [
      "I began my programming journey driven by curiosity about how modern software powers everyday life. Over time, that curiosity evolved into a dedicated commitment to building reliable web applications across the entire stack.",
      "On the frontend, I focus on crafting clean, accessible interfaces using React, TypeScript, and semantic HTML. On the backend, I enjoy structuring clean RESTful APIs, modeling relational databases, and understanding how data securely flows through distributed systems.",
      "I prioritize clean architecture, readability, and continuous self-improvement over shortcuts. When I'm not writing code, I'm reading engineering blogs, exploring open-source codebases, or sharpening my problem-solving skills.",
    ],
    location: 'Bandung, Indonesia (Open to Remote)',
    status: {
      available: true,
      label: 'Open to junior roles & internships',
    },
    preferredStyle: 'Clean code, modern TypeScript, and pragmatic architecture',
    learningFocus: 'Full-stack system architecture, TypeScript depth & secure APIs',
    avatarInitials: 'AR',
  },
  contact: {
    // Configurable email address. Safe placeholder ready to be updated.
    email: 'alex.rivera.dev@example.com',
    githubUrl: 'https://github.com/alexrivera-dev',
    linkedinUrl: 'https://linkedin.com/in/alexrivera-dev',
    collaborativeInvite:
      'Whether you have a question, an opportunity, or just want to discuss software engineering, feel free to reach out!',
  },
  meta: {
    siteUrl: 'https://your-portfolio-domain.vercel.app',
    title: 'Alex Rivera | Aspiring Fullstack Developer',
    description:
      'Personal portfolio of Alex Rivera, an aspiring Fullstack Developer specializing in React, TypeScript, and modern web application development.',
  },
};
