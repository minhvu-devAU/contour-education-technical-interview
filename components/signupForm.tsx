'use client';

import React, { useState } from "react";
import Link from "next/link";
import { ValidationError } from "yup";
import { signupSchema } from "@/lib/validations/signupSchema";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { ApiErrorResponse } from "@/types/api";

export function SignupForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    } catch(error) {
      // Enable for debug/tracing in production if we were using observability sentry/newrelic
      // console.error(error.message)
      setError("Something went wrong. Please try again later.");
      setLoading(false);
      return;
    }

    try {
      await signupSchema.validate(
        { firstName, lastName, email, phone, password, confirmPassword },
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

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phone }),
      });

      if (!response.ok) {
        // Enable for debug/tracing in production if we were using observability sentry/newrelic
        // const jsonResponse: ApiErrorResponse = await response.json();
        // console.error(jsonResponse.error);
        setError("Failed to create student record");
        setLoading(false);
        return;
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
      return;
    }

    // Only push/redirect to dashboard if everything passed
    router.push("/dashboard");
  }

  function inputClasses(field: string): string {
    return "w-full rounded-lg border"
      + ` ${fieldErrors[field] ? "border-error" : "border-input-border"}`
      + " bg-surface px-3.5 py-2.5 text-sm text-foreground"
      + " placeholder:text-muted"
      + " outline-none transition-colors"
      + " focus:border-input-focus focus:ring-2 focus:ring-ring";
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-error-border bg-error-surface px-4 py-3 text-sm text-error" role="alert">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-foreground"
          >
            First name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
            placeholder="Jane"
            className={inputClasses("firstName")}
          />
          {fieldErrors.firstName && (
            <p className="text-sm text-error">{fieldErrors.firstName}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="lastName" className="block text-sm font-medium text-foreground">
            Last name
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            className={inputClasses("lastName")}
          />
          {fieldErrors.lastName && (
            <p className="text-sm text-error">{fieldErrors.lastName}</p>
          )}
        </div>
      </div>

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
          className={inputClasses("email")}
        />
        {fieldErrors.email && (
          <p className="text-sm text-error">{fieldErrors.email}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="phone" className="block text-sm font-medium text-foreground">
          Phone number
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+61 400 000 000"
          className={inputClasses("phone")}
        />
        {fieldErrors.phone && (
          <p className="text-sm text-error">{fieldErrors.phone}</p>
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
          placeholder="At least 8 characters"
          className={inputClasses("password")}
        />
        {fieldErrors.password && (
          <p className="text-sm text-error">{fieldErrors.password}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your password"
          className={inputClasses("confirmPassword")}
        />
        {fieldErrors.confirmPassword && (
          <p className="text-sm text-error">
            {fieldErrors.confirmPassword}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={
          "inline-flex w-full items-center justify-center"
          + " rounded-lg bg-primary px-4 py-2.5"
          + " text-sm font-semibold text-white"
          + " transition-colors"
          + " hover:bg-primary-hover"
          + " focus:outline-none focus:ring-2"
          + " focus:ring-ring focus:ring-offset-2"
          + " disabled:cursor-not-allowed disabled:opacity-50"
        }
      >
        {loading ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </button>

      <p className="text-center text-sm text-muted">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
