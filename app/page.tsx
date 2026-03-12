// app/board/page.tsx
'use client'

import { useTaskStore } from '@/stores/taskStore'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import Column from '@/components/ui/Column'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LayoutDashboard, RotateCcw, Plus } from 'lucide-react'

export default function BoardPage() {
  const { columns, moveTask } = useTaskStore()

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
              <LayoutDashboard size={14} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">TaskFlow</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Plus size={14} />
              Add Column
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <RotateCcw size={14} />
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
