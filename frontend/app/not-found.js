export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900">
      <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
        <h1 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
          404
        </h1>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
          Page not found
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <a
          href="/"
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
