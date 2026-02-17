import type { Metadata } from "next";
import { LoginForm } from "@/components/loginForm";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Contour Education account.",
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-sm">
        <div className="mb-8 text-center">
          <Image
            src="/Contour-Education-2023-Logo.png"
            alt="Contour Education"
            className="mx-auto mb-6 h-8"
          />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to your account to continue
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  )
}
