'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  icon: Icon,
  iconPosition = 'right',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const buttonClasses = [
    styles.button,
    styles[variant],
    !children && styles.iconOnly,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={24} aria-hidden="true" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={24} aria-hidden="true" />}
    </button>
  );
}
