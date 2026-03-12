// app/dashboard/page.tsx
import { createServerSupabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Plus, ArrowRight, Layers } from 'lucide-react'

const boardColors = [
  'from-violet-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-pink-500 to-rose-500',
  'from-sky-500 to-blue-500',
  'from-purple-500 to-fuchsia-500',
]

export default async function DashboardPage() {
  const supabase = await createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  const { data: boards, error } = await supabase
    .from('boards')
    .select('id, title, description')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive text-sm">
        Error loading boards: {error.message}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <LayoutDashboard size={14} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">TaskFlow</span>
          </div>
          <Button asChild size="sm" className="gap-1.5">
            <Link href="/board/new">
              <Plus size={14} />
              New Board
            </Link>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">My Boards</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {boards?.length
              ? `${boards.length} board${boards.length !== 1 ? 's' : ''}`
              : 'No boards yet'}
          </p>
        </div>

        {boards?.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((board, i) => (
              <Link
                key={board.id}
                href={`/board/${board.id}`}
                className="group rounded-xl border border-border bg-card hover:shadow-md hover:border-primary/30 transition-all duration-200 overflow-hidden"
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${boardColors[i % boardColors.length]}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${boardColors[i % boardColors.length]} flex items-center justify-center shrink-0`}>
                      <Layers size={16} className="text-white" />
                    </div>
                    <ArrowRight size={15} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
                  </div>
                  <h2 className="font-semibold mt-3 mb-1 leading-tight">{board.title}</h2>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {board.description || 'No description'}
                  </p>
                </div>
              </Link>
            ))}

            <Link
              href="/board/new"
              className="group rounded-xl border-2 border-dashed border-border hover:border-primary/40 bg-card/50 hover:bg-accent/30 transition-all duration-200 flex flex-col items-center justify-center gap-2 p-8 text-muted-foreground hover:text-primary min-h-[130px]"
            >
              <Plus size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">New Board</span>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
              <Layers size={24} className="text-muted-foreground" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold">No boards yet</h2>
              <p className="text-sm text-muted-foreground mt-1">Create your first board to get started</p>
            </div>
            <Button asChild className="mt-2 gap-1.5">
              <Link href="/board/new">
                <Plus size={15} />
                Create Board
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
