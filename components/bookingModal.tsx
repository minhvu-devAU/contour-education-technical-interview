"use client"

import React, { useState } from "react";
import { ValidationError } from "yup";
import { consultationSchema } from "@/lib/validations/consultationSchema";
import { createConsultation } from "@/app/actions/consultation";
import type { Consultation } from "@/types/consultation";

type BookingModalProps = {
  onClose: () => void
  onSuccess: (consultation: Consultation) => void
}

export function BookingModal({ onClose, onSuccess }: BookingModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [reason, setReason] = useState("");
  const [datetime, setDatetime] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const inputClasses = (field: string): string => {
    return "w-full rounded-lg border"
      + ` ${fieldErrors[field] ? "border-error" : "border-input-border"}`
      + " bg-surface px-3.5 py-2.5 text-sm text-foreground"
      + " placeholder:text-muted"
      + " outline-none transition-colors"
      + " focus:border-input-focus focus:ring-2 focus:ring-ring";
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    try {
      await consultationSchema.validate(
        { firstName, lastName, reason, datetime },
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
      }

      setLoading(false);
      return;
    }

    const result = await createConsultation(firstName, lastName, reason, datetime);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result?.data) {
      // Calling parents to update the consultation list
      onSuccess(result.data as Consultation);
    }
    onClose();
  }

  return (
    
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="w-[90%] max-w-125 rounded-2xl  bg-surface p-9 shadow-2xl animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-foreground">
          Book a Consultation
        </h2>
        <p className="mb-7 mt-1 text-sm text-muted">
          Fill in the details to schedule a new session.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg border border-error-border bg-error-surface px-4 py-3 text-sm text-error" role="alert">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="firstName" className="block text-sm font-medium text-foreground">
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
            <label htmlFor="reason" className="block text-sm font-medium text-foreground">
              Reason for consultation
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe what you'd like to discuss..."
              className={inputClasses("reason") + " min-h-20 resize-y"}
            />
            {fieldErrors.reason && (
              <p className="text-sm text-error">{fieldErrors.reason}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="datetime" className="block text-sm font-medium text-foreground">
              Date & time
            </label>
            <input
              id="datetime"
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className={inputClasses("datetime")}
            />
            {fieldErrors.datetime && (
              <p className="text-sm text-error">{fieldErrors.datetime}</p>
            )}
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              className="rounded-[10px] border-[1.5px] border-border bg-surface px-7 py-3 text-[15px] font-medium text-muted"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-[10px] bg-primary px-7 py-3 text-[15px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Book Consultation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
