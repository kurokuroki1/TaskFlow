// app/board/page.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useTaskStore, Task } from '@/stores/taskStore'
import {
  DndContext, closestCenter, DragEndEvent, DragStartEvent,
  DragOverlay, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import Column from '@/components/ui/Column'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LayoutDashboard, RotateCcw, Plus, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const statusAccent: Record<string, string> = {
  'todo':        'border-l-violet-400',
  'in-progress': 'border-l-amber-400',
  'done':        'border-l-emerald-400',
}

export default function BoardPage() {
  const { columns, moveTask, addColumn, resetBoard } = useTaskStore()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const [addingColumn, setAddingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const columnInputRef = useRef<HTMLInputElement>(null)
  const [activeTask, setActiveTask] = useState<(Task & { status: string }) | null>(null)

  useEffect(() => {
    if (addingColumn) columnInputRef.current?.focus()
  }, [addingColumn])

  const handleAddColumn = () => {
    const title = newColumnTitle.trim()
    if (title) addColumn(title)
    setNewColumnTitle('')
    setAddingColumn(false)
  }

  const handleColumnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddColumn()
    if (e.key === 'Escape') { setAddingColumn(false); setNewColumnTitle('') }
  }

  const onDragStart = (event: DragStartEvent) => {
    const activeId = event.active.id as string
    for (const col of columns) {
      const task = col.tasks.find((t) => t.id === activeId)
      if (task) {
        const status = col.id === 'done' ? 'done' : col.id === 'in-progress' ? 'in-progress' : 'todo'
        setActiveTask({ ...task, status })
        return
      }
    }
  }

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeId = active.id as string
    const overId = over.id as string

    const sourceColumn = columns.find((c) => c.tasks.some((t) => t.id === activeId))
    if (!sourceColumn) return

    const targetColumn =
      columns.find((c) => c.id === overId) ??
      columns.find((c) => c.tasks.some((t) => t.id === overId))
    if (!targetColumn) return

    const overTaskIndex = targetColumn.tasks.findIndex((t) => t.id === overId)
    const newPosition = overTaskIndex >= 0 ? overTaskIndex : targetColumn.tasks.length

    moveTask(activeId, sourceColumn.id, targetColumn.id, newPosition)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <LayoutDashboard size={14} className="text-primary-foreground" suppressHydrationWarning />
            </div>
            <span className="font-bold text-lg tracking-tight">TaskFlow</span>
          </div>
          <div className="flex items-center gap-2">
            {addingColumn ? (
              <div className="flex items-center gap-1.5">
                <input
                  ref={columnInputRef}
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onKeyDown={handleColumnKeyDown}
                  placeholder="Column name..."
                  className="h-8 w-36 rounded-md border border-input bg-background px-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <button onClick={handleAddColumn} className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Check size={13} suppressHydrationWarning />
                </button>
                <button onClick={() => { setAddingColumn(false); setNewColumnTitle('') }} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-accent transition-colors">
                  <X size={13} suppressHydrationWarning />
                </button>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setAddingColumn(true)}>
                <Plus size={14} suppressHydrationWarning />
                Add Column
              </Button>
            )}
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={resetBoard}>
              <RotateCcw size={14} suppressHydrationWarning />
              Reset
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Board */}
      <main className="flex-1 p-6">
        <div className="max-w-screen-2xl mx-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={columns.map(c => c.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex gap-5 overflow-x-auto pb-6">
                {columns.map(column => (
                  <Column key={column.id} column={column} />
                ))}
              </div>
            </SortableContext>

            <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
              {activeTask && (
                <div className={cn(
                  'rounded-xl border border-border bg-card px-4 py-3 w-80',
                  'shadow-xl border-l-4 cursor-grabbing select-none rotate-1 scale-105',
                  statusAccent[activeTask.status] ?? 'border-l-primary'
                )}>
                  <h3 className="font-semibold text-sm leading-snug text-card-foreground pr-6">
                    {activeTask.title}
                  </h3>
                  {activeTask.description && (
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                      {activeTask.description}
                    </p>
                  )}
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </main>
    </div>
  )
}
