'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login, getUser, seedDemoAccount } from '@/lib/auth'
import { AuthShell } from '@/components/ui/AuthShell'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    seedDemoAccount()
    if (getUser()) router.replace('/')
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      toast.error('Please fill in all fields.')
      return
    }
    const result = login(email, password)
    if ('error' in result) {
      toast.error(result.error)
    } else {
      toast.success(`Welcome back, ${result.user.name}!`)
      router.replace('/')
    }
  }

  const fillDemo = () => { setEmail('user'); setPassword('user') }

  return (
    <AuthShell
      subtitle="Sign in to your workspace"
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      {/* Demo hint */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-center space-y-1">
        <p className="text-muted-foreground text-xs">
          Demo: <span className="font-mono font-semibold text-primary">user</span> / <span className="font-mono font-semibold text-primary">user</span>
        </p>
        <button type="button" onClick={fillDemo} className="text-xs font-medium text-primary hover:underline">
          Fill demo credentials
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email or username</Label>
          <Input
            id="email"
            type="text"
            placeholder="name@example.com or user"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <Button type="submit" className="w-full gap-2" size="md">
          <LogIn size={15} suppressHydrationWarning />
          Sign In
        </Button>
      </form>
    </AuthShell>
  )
}
