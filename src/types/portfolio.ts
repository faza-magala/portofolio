export type SkillCategory = 'frontend' | 'backend' | 'databases' | 'tools';

export type SkillProficiency = 'Learning' | 'Proficient' | 'Exploring';

export interface SkillItem {
  name: string;
  category: SkillCategory;
  proficiency?: SkillProficiency;
  iconName?: string;
  description?: string;
  isFocus?: boolean;
}

export type ProjectCategory = 'Full-Stack' | 'Frontend' | 'Backend / API' | 'Tool / CLI';

export interface ProjectItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  techStack: string[];
  category: ProjectCategory;
  featured: boolean;
  sampleNotice?: string;
  liveDemoUrl?: string;
  sourceCodeUrl?: string;
  highlights?: string[];
  imagePlaceholder?: {
    accentColor?: string;
    label: string;
    codeSnippet?: string;
  };
}

export interface LearningItem {
  id: string;
  title: string;
  status: 'In Progress' | 'Planned' | 'Milestone';
  description: string;
  topics: string[];
  resourcesOrGoals?: string;
}

export interface NavItem {
  label: string;
  href: string;
  ariaLabel?: string;
}

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'email' | 'twitter' | 'gitlab';
  url: string;
  label: string;
  ariaLabel: string;
}

export interface SiteConfig {
  developer: {
    name: string;
    role: string;
    eyebrow: string;
    headline: string;
    shortBio: string;
    fullBio: string[];
    location: string;
    status: {
      available: boolean;
      label: string;
    };
    preferredStyle: string;
    learningFocus: string;
    avatarInitials: string;
  };
  contact: {
    email: string;
    githubUrl: string;
    linkedinUrl: string;
    collaborativeInvite: string;
  };
  meta: {
    siteUrl: string;
    title: string;
    description: string;
  };
}
