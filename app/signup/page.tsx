import type { Metadata } from 'next'
import { SignupForm } from '@/components/signupForm'

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Contour Education account.",
}

export default function SignupPage() {
  return (
    <main
      className="flex min-h-screen items-center justify-center px-4 py-12">
      <div
        className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted">
            Get started with Contour Education
          </p>
        </div>

        <SignupForm />
      </div>
    </main>
  )
}
