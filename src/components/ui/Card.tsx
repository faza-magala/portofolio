import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[#DCEAF7] bg-white p-6 shadow-sm transition-all duration-200',
        hoverable &&
          'hover:border-[#BFDDF7] hover:shadow-card hover:-translate-y-0.5 transition-transform duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
