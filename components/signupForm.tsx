"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ValidationError } from "yup";
import { signupSchema } from "@/lib/validations/signupSchema";
import { signup } from "@/app/actions/auth";

export function SignupForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

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

    const result = await signup(email, password, firstName, lastName, phone);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
  }

  const inputClasses = (field: string): string => {
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
            placeholder="First"
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
            placeholder="Last"
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
          + " focus:outline-none focus:ring-2"
          + " focus:ring-ring focus:ring-offset-2"
          + " disabled:cursor-not-allowed disabled:opacity-50"
        }
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </button>

      <p className="text-center text-sm text-muted">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary underline-offset-4">
          Sign in
        </Link>
      </p>
    </form>
  )
}
