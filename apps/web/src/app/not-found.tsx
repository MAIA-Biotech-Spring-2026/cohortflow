import { FileQuestion, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-gray-100 p-3">
            <FileQuestion className="h-8 w-8 text-gray-600" aria-hidden="true" />
          </div>
        </div>
        <h1 className="mb-2 text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mb-2 text-2xl font-semibold text-gray-900">Page not found</h2>
        <p className="mb-6 text-gray-600">
          Sorry, we couldn't find the page you're looking for. Please check the URL or
          return to the dashboard.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Go to home page"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Go home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Go back to previous page"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
