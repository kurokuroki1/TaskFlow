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
  userId: string | null
  columns: Column[]
  streak: number
  longestStreak: number
  lastActiveDate: string | null
  initForUser: (userId: string) => void
  recordActivity: () => void
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

const today = () => new Date().toISOString().slice(0, 10)
const yesterday = () => new Date(Date.now() - 864e5).toISOString().slice(0, 10)

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      userId: null,
      columns: initialColumns,
      streak: 0,
      longestStreak: 0,
      lastActiveDate: null,

      initForUser: (userId) =>
        set((state) => {
          if (state.userId === userId) return {}
          return { userId, columns: initialColumns, streak: 0, longestStreak: 0, lastActiveDate: null }
        }),

      recordActivity: () =>
        set((state) => {
          const t = today()
          if (state.lastActiveDate === t) return {}
          const newStreak = state.lastActiveDate === yesterday() ? state.streak + 1 : 1
          return {
            streak: newStreak,
            longestStreak: Math.max(newStreak, state.longestStreak),
            lastActiveDate: t,
          }
        }),

      addTask: (columnId, title, description = '') => {
        get().recordActivity()
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
        }))
      },

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

      deleteTask: (taskId, columnId) => {
        get().recordActivity()
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId
              ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
              : col
          ),
        }))
      },

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

      resetBoard: () =>
        set((state) => ({ columns: initialColumns, userId: state.userId })),

      moveTask: (taskId, sourceColumnId, targetColumnId, newPosition) => {
        get().recordActivity()
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
        })
      },
    }),
    { name: 'taskflow-storage' }
  )
)
