// app/board/page.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useTaskStore } from '@/stores/taskStore'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import Column from '@/components/ui/Column'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LayoutDashboard, RotateCcw, Plus, Check, X } from 'lucide-react'

export default function BoardPage() {
  const { columns, moveTask, addColumn } = useTaskStore()
  const [addingColumn, setAddingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const columnInputRef = useRef<HTMLInputElement>(null)

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

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const taskId = active.id as string
    const targetColumnId = over.id as string

    const sourceColumn = columns.find(c =>
      c.tasks.some(t => t.id === taskId)
    )

    if (!sourceColumn) return
    moveTask(taskId, sourceColumn.id, targetColumnId, 999)
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
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
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
            collisionDetection={closestCenter}
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
          </DndContext>
        </div>
      </main>
    </div>
  )
}
