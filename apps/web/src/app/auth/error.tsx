"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Authentication error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-gray-50">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <AlertCircle className="h-8 w-8 text-red-600" aria-hidden="true" />
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Authentication Error
        </h1>
        <p className="mb-6 text-gray-600">
          We encountered an error during authentication. Please try signing in again.
        </p>
        {error.digest && (
          <p className="mb-4 text-sm text-gray-500" aria-live="polite">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Try again"
          >
            Try again
          </button>
          <Link
            href="/auth/signin"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Go to sign in page"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
