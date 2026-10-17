import React from 'react';
import { cn } from '../../lib/utils';

export type BadgeVariant = 'default' | 'primary' | 'accent' | 'subtle' | 'outline' | 'success';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className,
  ...props
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-[#EAF6FF] text-[#172B4D] border border-[#DCEAF7]',
    primary: 'bg-[#3898EC]/10 text-[#3898EC] border border-[#3898EC]/20',
    accent: 'bg-[#60B5FF]/15 text-[#2483d6] border border-[#60B5FF]/30',
    subtle: 'bg-white text-[#5B6B82] border border-[#DCEAF7]',
    outline: 'bg-transparent text-[#5B6B82] border border-[#DCEAF7]',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 gap-1 font-medium rounded-md',
    md: 'text-xs sm:text-sm px-3 py-1 gap-1.5 font-medium rounded-lg',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
