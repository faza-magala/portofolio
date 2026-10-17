import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines Tailwind classes cleanly and safely resolving conflicts
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a skill category string to human readable text
 */
export function formatCategoryTitle(category: string): string {
  switch (category) {
    case 'frontend':
      return 'Frontend Development';
    case 'backend':
      return 'Backend & APIs';
    case 'databases':
      return 'Databases & Storage';
    case 'tools':
      return 'Tools, Workflow & DevOps';
    default:
      return category;
  }
}
