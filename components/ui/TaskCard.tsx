'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'
import { Trash2 } from 'lucide-react'

interface TaskCardProps {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'done'
  onDelete: (id: string) => void
}

const statusAccent = {
  'todo':        'border-l-violet-400',
  'in-progress': 'border-l-amber-400',
  'done':        'border-l-emerald-400',
}

export const TaskCard: React.FC<TaskCardProps> = ({ id, title, description, status, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'group relative rounded-xl border border-border bg-card px-4 py-3',
        'shadow-sm hover:shadow-md transition-all duration-200',
        'border-l-4 cursor-grab active:cursor-grabbing select-none',
        statusAccent[status],
        isDragging && 'opacity-40 ring-2 ring-primary shadow-lg'
      )}
    >
      {/* Delete button */}
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); onDelete(id) }}
        className="absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
        aria-label="Delete task"
      >
        <Trash2 size={13} suppressHydrationWarning />
      </button>

      <h3 className="font-semibold text-sm leading-snug text-card-foreground pr-6">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
          {description}
        </p>
      )}
    </div>
  )
}
