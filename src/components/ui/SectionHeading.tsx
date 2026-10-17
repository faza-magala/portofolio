import React from 'react';
import { cn } from '../../lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}) => {
  return (
    <div
      className={cn(
        'mb-12 max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {eyebrow && (
        <p className="mb-2.5 inline-block text-xs font-semibold tracking-wider text-[#3898EC] uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-bold tracking-tight text-[#172B4D] sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3.5 text-base text-[#5B6B82] sm:text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};
