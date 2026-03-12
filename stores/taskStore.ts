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
  updateTask: (taskId: string, columnId: string, title: string, description?: string) => void
  deleteTask: (taskId: string, columnId: string) => void
  moveTask: (taskId: string, sourceColumnId: string, targetColumnId: string, newPosition: number) => void
  addColumn: (title: string) => void
  renameColumn: (columnId: string, title: string) => void
  deleteColumn: (columnId: string) => void
  resetBoard: () => void
}

const initialColumns: Column[] = [
  { id: 'todo', title: 'To Do', tasks: [] },
  { id: 'in-progress', title: 'In Progress', tasks: [] },
  { id: 'done', title: 'Done', tasks: [] },
]

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      columns: initialColumns,

      addTask: (columnId, title, description = '') =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId
              ? {
                  ...col,
                  tasks: [
                    ...col.tasks,
                    { id: crypto.randomUUID(), title, description, position: col.tasks.length },
                  ],
                }
              : col
          ),
        })),

      updateTask: (taskId, columnId, title, description = '') =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId
              ? {
                  ...col,
                  tasks: col.tasks.map((t) =>
                    t.id === taskId ? { ...t, title, description } : t
                  ),
                }
              : col
          ),
        })),

      deleteTask: (taskId, columnId) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId
              ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
              : col
          ),
        })),

      addColumn: (title) =>
        set((state) => ({
          columns: [...state.columns, { id: crypto.randomUUID(), title, tasks: [] }],
        })),

      renameColumn: (columnId, title) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId ? { ...col, title } : col
          ),
        })),

      deleteColumn: (columnId) =>
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== columnId),
        })),

      resetBoard: () => set({ columns: initialColumns }),

      moveTask: (taskId, sourceColumnId, targetColumnId, newPosition) =>
        set((state) => {
          const sourceCol = state.columns.find((c) => c.id === sourceColumnId)
          if (!sourceCol) return state
          const task = sourceCol.tasks.find((t) => t.id === taskId)
          if (!task) return state

          if (sourceColumnId === targetColumnId) {
            const tasks = sourceCol.tasks.filter((t) => t.id !== taskId)
            tasks.splice(newPosition, 0, task)
            return {
              columns: state.columns.map((col) =>
                col.id === sourceColumnId ? { ...col, tasks } : col
              ),
            }
          }

          return {
            columns: state.columns.map((col) => {
              if (col.id === sourceColumnId)
                return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
              if (col.id === targetColumnId) {
                const tasks = [...col.tasks]
                tasks.splice(newPosition, 0, { ...task })
                return { ...col, tasks }
              }
              return col
            }),
          }
        }),
    }),
    { name: 'taskflow-storage' }
  )
)
