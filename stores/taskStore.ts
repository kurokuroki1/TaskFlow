// stores/taskStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Task = {
  id: string
  title: string
  description?: string
  position: number
}

export type Column = {
  id: string
  title: string
  tasks: Task[]
}

type TaskStore = {
  columns: Column[]
  addTask: (columnId: string, title: string, description?: string) => void
  moveTask: (taskId: string, sourceColumnId: string, targetColumnId: string, newPosition: number) => void
  addColumn: (title: string) => void
}

const initialColumns: Column[] = [
  { id: 'todo', title: 'To Do', tasks: [] },
  { id: 'in-progress', title: 'In Progress', tasks: [] },
  { id: 'done', title: 'Done', tasks: [] },
]

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      columns: initialColumns,

      addTask: (columnId, title, description = '') =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId
              ? {
                  ...col,
                  tasks: [
                    ...col.tasks,
                    {
                      id: crypto.randomUUID(),
                      title,
                      description,
                      position: col.tasks.length,
                    },
                  ],
                }
              : col
          ),
        })),

      addColumn: (title) =>
        set((state) => ({
          columns: [
            ...state.columns,
            {
              id: crypto.randomUUID(),
              title,
              tasks: [],
            },
          ],
        })),

      moveTask: (taskId, sourceColumnId, targetColumnId, newPosition) =>
        set((state) => {
          let movedTask: Task | undefined

          const updatedColumns = state.columns.map((col) => {
            if (col.id === sourceColumnId) {
              const remainingTasks = col.tasks.filter((t) => {
                if (t.id === taskId) {
                  movedTask = t
                  return false
                }
                return true
              })
              return { ...col, tasks: remainingTasks }
            }
            return col
          })

          if (!movedTask) return state

          return {
            columns: updatedColumns.map((col) =>
              col.id === targetColumnId
                ? {
                    ...col,
                    tasks: [
                      ...col.tasks.slice(0, newPosition),
                      { ...movedTask!, position: newPosition },
                      ...col.tasks.slice(newPosition),
                    ],
                  }
                : col
            ),
          }
        }),
    }),
    {
      name: 'taskflow-storage',
    }
  )
)