import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={cn(
    'rounded-xl border border-border bg-card text-card-foreground shadow-sm',
    className
  )}>
    {children}
  </div>
)

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={cn('flex flex-col gap-1.5 p-6', className)}>{children}</div>
)

export const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => (
  <h2 className={cn('text-lg font-semibold leading-tight tracking-tight', className)}>
    {children}
  </h2>
)

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={cn('p-6 pt-0', className)}>{children}</div>
)

export const CardFooter: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={cn('flex items-center gap-2 p-6 pt-0', className)}>{children}</div>
)
