'use client'

import React, { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ValidationError } from "yup";
import { createClient } from "@/lib/supabase/client";
import { loginSchema } from "@/lib/validations/loginSchema";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    let supabase;
    try {
      supabase = createClient();
    } catch {
      setError("Something went wrong. Please try again later.");
      setLoading(false);
      return;
    }

    try {
      await loginSchema.validate(
        { email, password },
        { abortEarly: false }
      );
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        const errors: Record<string, string> = {};
        err.inner.forEach((validationErr) => {
          if (validationErr.path) {
            errors[validationErr.path] = validationErr.message;
          }
        });
        setFieldErrors(errors);
      } else {
        setError("An unexpected error occurred");
      }
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Only push/redirect to dashboard if everything passed
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-error-border bg-error-surface px-4 py-3 text-sm text-error" role="alert">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={
            'w-full rounded-lg border'
            + ` ${fieldErrors.email ? 'border-error' : 'border-input-border'}`
            + ' bg-surface px-3.5 py-2.5 text-sm text-foreground'
            + ' placeholder:text-muted'
            + ' outline-none transition-colors'
            + ' focus:border-input-focus focus:ring-2 focus:ring-ring'
          }
        />
        {fieldErrors.email && (
          <p className="text-sm text-error">{fieldErrors.email}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          placeholder="Enter your password"
          className={
            'w-full rounded-lg border'
            + ` ${fieldErrors.password ? 'border-error' : 'border-input-border'}`
            + ' bg-surface px-3.5 py-2.5 text-sm text-foreground'
            + ' placeholder:text-muted'
            + ' outline-none transition-colors'
            + ' focus:border-input-focus focus:ring-2 focus:ring-ring'
          }
        />
        {fieldErrors.password && (
          <p className="text-sm text-error">{fieldErrors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={
          'inline-flex w-full items-center justify-center'
          + ' rounded-lg bg-primary px-4 py-2.5'
          + ' text-sm font-semibold text-white'
          + ' transition-colors'
          + ' hover:bg-primary-hover'
          + ' focus:outline-none focus:ring-2'
          + ' focus:ring-ring focus:ring-offset-2'
          + ' disabled:cursor-not-allowed disabled:opacity-50'
        }
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </button>

      <p className="text-center text-sm text-muted">
          {"Don't have an account?"}
        <Link
          href="/signup"
          className="font-medium text-primary underline-offset-4 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  )
}
