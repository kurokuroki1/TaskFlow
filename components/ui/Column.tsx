'use client'

import { useState, useRef, useEffect } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Card } from '@/components/ui/card'
import { TaskCard } from '@/components/ui/TaskCard'
import { cn } from '@/lib/utils'
import { Column as ColumnType, useTaskStore, Task } from '@/stores/taskStore'
import { Plus, Check, X, Trash2, Pencil } from 'lucide-react'

interface ColumnProps {
  column: ColumnType
}

const columnAccents: Record<string, { dot: string; badge: string }> = {
  'todo':        { dot: 'bg-violet-400',  badge: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300' },
  'in-progress': { dot: 'bg-amber-400',   badge: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300' },
  'done':        { dot: 'bg-emerald-400', badge: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300' },
}

const fallbackAccent = { dot: 'bg-primary', badge: 'bg-secondary text-secondary-foreground' }

export default function Column({ column }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'Column', columnId: column.id },
  })
  const { addTask, deleteTask, deleteColumn, renameColumn, updateTask } = useTaskStore()

  // Add task state
  const [addingTask, setAddingTask] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const taskInputRef = useRef<HTMLInputElement>(null)

  // Rename column state
  const [renaming, setRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState(column.title)
  const renameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (addingTask) taskInputRef.current?.focus()
  }, [addingTask])

  useEffect(() => {
    if (renaming) {
      setRenameValue(column.title)
      renameInputRef.current?.focus()
      renameInputRef.current?.select()
    }
  }, [renaming, column.title])

  const handleAddTask = () => {
    const title = taskTitle.trim()
    if (title) addTask(column.id, title, taskDesc.trim())
    setTaskTitle('')
    setTaskDesc('')
    setAddingTask(false)
  }

  const handleTaskKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddTask() }
    if (e.key === 'Escape') { setAddingTask(false); setTaskTitle(''); setTaskDesc('') }
  }

  const handleRename = () => {
    const title = renameValue.trim()
    if (title && title !== column.title) renameColumn(column.id, title)
    setRenaming(false)
  }

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRename()
    if (e.key === 'Escape') setRenaming(false)
  }

  const accent = columnAccents[column.id] ?? fallbackAccent

  return (
    <div ref={setNodeRef} className="w-full lg:w-[20rem] lg:shrink-0 lg:snap-start">
      <Card className={cn(
        'flex flex-col border bg-card/80 backdrop-blur-sm transition-all duration-200',
        isOver && 'ring-2 ring-primary ring-offset-2 shadow-lg shadow-primary/10'
      )}>
        {/* Column header */}
        <div className="group/header flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className={cn('w-2.5 h-2.5 shrink-0 rounded-full', accent.dot)} />
            {renaming ? (
              <input
                ref={renameInputRef}
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={handleRenameKeyDown}
                onBlur={handleRename}
                className="flex-1 min-w-0 text-sm font-semibold tracking-tight bg-transparent border-b border-primary outline-none"
              />
            ) : (
              <h2
                className="text-sm font-semibold tracking-tight truncate cursor-pointer hover:text-primary transition-colors"
                onDoubleClick={() => setRenaming(true)}
                title="Double-click to rename"
              >
                {column.title}
              </h2>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Task count badge */}
            <span className={cn(
              'inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold',
              accent.badge
            )}>
              {column.tasks.length}
            </span>
            {/* Rename button */}
            <button
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => setRenaming(true)}
              className="opacity-100 sm:opacity-0 sm:group-hover/header:opacity-100 p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-all ml-1"
              aria-label="Rename column"
            >
              <Pencil size={12} suppressHydrationWarning />
            </button>
            {/* Delete column button */}
            <button
              onClick={() => {
                if (confirm(`Delete "${column.title}" and all its tasks?`)) deleteColumn(column.id)
              }}
              className="opacity-100 sm:opacity-0 sm:group-hover/header:opacity-100 p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
              aria-label="Delete column"
            >
              <Trash2 size={12} suppressHydrationWarning />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-border mb-3" />

        {/* Tasks */}
        <SortableContext
          items={column.tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={cn(
            'flex-1 min-h-[6rem] px-3 pb-3 space-y-2 transition-colors duration-200',
            isOver && 'bg-primary/5 rounded-b-none'
          )}>
            {column.tasks.length > 0 ? (
              column.tasks.map((task: Task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  status={column.id === 'done' ? 'done' : column.id === 'in-progress' ? 'in-progress' : 'todo'}
                  onDelete={(id) => deleteTask(id, column.id)}
                  onUpdate={(id, title, description) => updateTask(id, column.id, title, description)}
                />
              ))
            ) : (
              <div className={cn(
                'h-20 flex items-center justify-center rounded-lg',
                'border-2 border-dashed border-border',
                'text-xs text-muted-foreground',
                isOver && 'border-primary/40 bg-primary/5 text-primary'
              )}>
                {isOver ? 'Release to drop' : 'Drop tasks here'}
              </div>
            )}
          </div>
        </SortableContext>

        {/* Add task button / inline form */}
        <div className="px-3 pb-3">
          {addingTask ? (
            <div className="flex flex-col gap-1.5">
              <input
                ref={taskInputRef}
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                onKeyDown={handleTaskKeyDown}
                placeholder="Task title..."
                className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-ring"
              />
              <textarea
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                onKeyDown={handleTaskKeyDown}
                placeholder="Description (optional)..."
                rows={2}
                className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <div className="flex gap-1.5">
                <button
                  onClick={handleAddTask}
                  className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
                >
                  <Check size={12} suppressHydrationWarning />
                  Add
                </button>
                <button
                  onClick={() => { setAddingTask(false); setTaskTitle(''); setTaskDesc('') }}
                  className="inline-flex items-center justify-center w-8 rounded-md border border-input hover:bg-accent transition-colors"
                >
                  <X size={12} suppressHydrationWarning />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingTask(true)}
              className={cn(
                'w-full flex items-center justify-center gap-1.5 py-2 rounded-lg',
                'text-xs text-muted-foreground font-medium',
                'hover:bg-accent hover:text-accent-foreground',
                'transition-colors duration-150'
              )}
            >
              <Plus size={14} suppressHydrationWarning />
              Add task
            </button>
          )}
        </div>
      </Card>
    </div>
  )
}
