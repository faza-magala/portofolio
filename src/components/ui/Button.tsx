import React from 'react';
import { cn } from '../../lib/utils';
import { getExternalLinkProps, isSafeUrl } from '../../lib/validators';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
}

export type ActionButtonProps = BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> & {
    href?: undefined;
  };

export type LinkButtonProps = BaseButtonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> & {
    href: string;
  };

export type ButtonProps = ActionButtonProps | LinkButtonProps;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  icon,
  iconPosition = 'left',
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898EC] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-[#3898EC] text-white hover:bg-[#2483d6] shadow-sm hover:shadow active:scale-[0.98]',
    secondary:
      'bg-[#EAF6FF] text-[#172B4D] hover:bg-[#d9ecfd] hover:text-[#3898EC] border border-[#DCEAF7]',
    outline:
      'border border-[#DCEAF7] bg-white text-[#172B4D] hover:bg-[#F8FBFF] hover:border-[#3898EC] hover:text-[#3898EC] shadow-subtle',
    ghost: 'text-[#5B6B82] hover:text-[#172B4D] hover:bg-[#EAF6FF]',
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5 font-semibold',
  };

  const combinedClasses = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if ('href' in props && props.href) {
    const { href, ...anchorProps } = props as LinkButtonProps;
    const safeProps = getExternalLinkProps(href);

    if (!isSafeUrl(href)) {
      return (
        <span
          className={cn(combinedClasses, 'opacity-50 cursor-not-allowed')}
          aria-disabled="true"
        >
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          {children && <span>{children}</span>}
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </span>
      );
    }

    return (
      <a
        href={safeProps.href}
        target={safeProps.target}
        rel={safeProps.rel}
        className={combinedClasses}
        {...anchorProps}
      >
        {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
        {children && <span>{children}</span>}
        {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
      </a>
    );
  }

  const buttonProps = props as ActionButtonProps;
  return (
    <button type={buttonProps.type || 'button'} className={combinedClasses} {...buttonProps}>
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
