'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'
import { Trash2, Pencil, Check, X } from 'lucide-react'

interface TaskCardProps {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'done'
  onDelete: (id: string) => void
  onUpdate: (id: string, title: string, description?: string) => void
}

const statusAccent = {
  'todo':        'border-l-violet-400',
  'in-progress': 'border-l-amber-400',
  'done':        'border-l-emerald-400',
}

export const TaskCard: React.FC<TaskCardProps> = ({ id, title, description, status, onDelete, onUpdate }) => {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(title)
  const [editDesc, setEditDesc] = useState(description ?? '')
  const editInputRef = useRef<HTMLInputElement>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: editing })

  const style = { transform: CSS.Transform.toString(transform), transition }

  useEffect(() => {
    if (editing) {
      setEditTitle(title)
      setEditDesc(description ?? '')
      editInputRef.current?.focus()
      editInputRef.current?.select()
    }
  }, [editing, title, description])

  const handleSave = () => {
    const t = editTitle.trim()
    if (t) onUpdate(id, t, editDesc.trim())
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave() }
    if (e.key === 'Escape') setEditing(false)
  }

  if (editing) {
    return (
      <div className={cn(
        'rounded-xl border border-primary bg-card px-3 py-3',
        'shadow-md border-l-4',
        statusAccent[status]
      )}>
        <input
          ref={editInputRef}
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Task title..."
          className="w-full mb-1.5 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-ring"
        />
        <textarea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Description (optional)..."
          rows={2}
          className="w-full mb-2 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-ring resize-none"
        />
        <div className="flex gap-1.5">
          <button
            onClick={handleSave}
            disabled={!editTitle.trim()}
            className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check size={12} suppressHydrationWarning />
            Save
          </button>
          <button
            onClick={() => setEditing(false)}
            className="inline-flex items-center justify-center w-8 rounded-md border border-input hover:bg-accent transition-colors"
          >
            <X size={12} suppressHydrationWarning />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onDoubleClick={() => setEditing(true)}
      className={cn(
        'group relative rounded-xl border border-border bg-card px-4 py-3',
        'shadow-sm hover:shadow-md transition-all duration-200',
        'border-l-4 cursor-grab active:cursor-grabbing select-none',
        statusAccent[status],
        isDragging && 'opacity-40 ring-2 ring-primary shadow-lg'
      )}
    >
      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); setEditing(true) }}
          className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Edit task"
        >
          <Pencil size={12} suppressHydrationWarning />
        </button>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); if (confirm('Delete this task?')) onDelete(id) }}
          className="p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          aria-label="Delete task"
        >
          <Trash2 size={12} suppressHydrationWarning />
        </button>
      </div>

      <h3 className="font-semibold text-sm leading-snug text-card-foreground pr-14">
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
