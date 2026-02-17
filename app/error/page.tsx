import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-error-surface">
          <AlertCircle className="h-8 w-8 text-error" />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-foreground">
          Something went wrong
        </h1>
        <p className="mb-8 text-muted">
          { "We couldn't load your data. Please try again or contact support if the problem persists"}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/login" className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-primary-light transition-colors">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
