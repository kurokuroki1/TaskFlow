import { LayoutDashboard } from 'lucide-react'

interface AuthShellProps {
  subtitle: string
  children: React.ReactNode
  footer: React.ReactNode
}

export function AuthShell({ subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center p-4 py-8 bg-background">
      {/* Background blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-5 sm:mb-8 gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <LayoutDashboard size={22} className="text-primary-foreground" suppressHydrationWarning />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">TaskFlow</h1>
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card shadow-lg p-4 sm:p-6 space-y-5">
          {children}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-5">{footer}</p>
      </div>
    </div>
  )
}
