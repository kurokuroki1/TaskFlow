import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
  className?: string
}

const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default:     'bg-primary/10 text-primary border border-primary/20',
  secondary:   'bg-secondary text-secondary-foreground border border-border',
  destructive: 'bg-destructive/10 text-destructive border border-destructive/20',
  outline:     'border border-border text-foreground bg-transparent',
  success:     'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400',
  warning:     'bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400',
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => (
  <span className={cn(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
    variants[variant],
    className
  )}>
    {children}
  </span>
)
