'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Pencil, Trash2, CalendarDays, AlertCircle } from 'lucide-react'

interface TaskCardProps {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'done'
  priority?: 'low' | 'medium' | 'high'
  dueDate?: string
  onUpdate?: (id: string) => void
  onDelete?: (id: string) => void
}

const priorityConfig = {
  low:    { label: 'Low',    color: 'text-emerald-500',  dot: 'bg-emerald-500' },
  medium: { label: 'Medium', color: 'text-amber-500',    dot: 'bg-amber-500' },
  high:   { label: 'High',   color: 'text-rose-500',     dot: 'bg-rose-500' },
}

const statusAccent = {
  'todo':        'border-l-violet-400',
  'in-progress': 'border-l-amber-400',
  'done':        'border-l-emerald-400',
}

export const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  status,
  priority,
  dueDate,
  onUpdate,
  onDelete,
}) => {
  return (
    <div className={cn(
      'group relative rounded-xl border border-border bg-card px-4 py-3',
      'shadow-sm hover:shadow-md transition-all duration-200',
      'border-l-4',
      statusAccent[status]
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-semibold text-sm leading-snug text-card-foreground flex-1">
          {title}
        </h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          {onUpdate && (
            <button
              onClick={() => onUpdate(id)}
              className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Edit task"
            >
              <Pencil size={13} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Delete task"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {description && (
        <p className="text-xs text-muted-foreground mb-2 leading-relaxed line-clamp-2">
          {description}
        </p>
      )}

      {/* Footer meta */}
      {(priority || dueDate) && (
        <div className="flex items-center gap-3 mt-2">
          {priority && (
            <span className={cn('flex items-center gap-1 text-xs font-medium', priorityConfig[priority].color)}>
              <span className={cn('w-1.5 h-1.5 rounded-full', priorityConfig[priority].dot)} />
              {priorityConfig[priority].label}
            </span>
          )}
          {dueDate && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays size={11} />
              {dueDate}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
