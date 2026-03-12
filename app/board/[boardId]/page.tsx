// app/board/[boardId]/page.tsx
'use client'

import { useTaskStore } from '@/stores/taskStore'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import Column from '@/components/ui/Column'

export default function BoardPage() {
  const { columns, moveTask } = useTaskStore()

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const taskId = active.id as string
    const targetColumnId = over.id as string

    const sourceColumn = columns.find((c) => c.tasks.some((t) => t.id === taskId))
    if (!sourceColumn) return

    // For now, move to the end of the target column
    moveTask(taskId, sourceColumn.id, targetColumnId, 999)
  }

  return (
    <div className="p-6 min-h-screen bg-background">
      <h1 className="text-3xl font-bold mb-6">My Board</h1>

      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext
          items={columns.map((c) => c.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-6 overflow-x-auto pb-6">
            {columns.map((column) => (
              <Column key={column.id} column={column} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}