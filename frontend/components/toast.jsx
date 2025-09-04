"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (toast) => {
      const id = Math.random().toString(36).slice(2);
      const t = { id, ...toast };
      setToasts((ts) => [...ts, t]);
      const ms = typeof toast.duration === "number" ? toast.duration : 3500;
      setTimeout(() => remove(id), ms);
      return id;
    },
    [remove]
  );

  const api = useMemo(
    () => ({
      success: (msg) => push({ type: "success", message: msg }),
      error: (msg) => push({ type: "error", message: msg }),
      info: (msg) => push({ type: "info", message: msg }),
      push,
      remove,
    }),
    [push, remove]
  );

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 top-4 z-[200] flex flex-col items-center gap-3 px-3"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-xl border px-4 py-3 shadow-lg transition hover:shadow-xl dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 ${
              t.type === "success"
                ? "border-green-200 bg-green-50 text-green-800 dark:bg-green-900/40 dark:text-green-200"
                : t.type === "error"
                ? "border-red-200 bg-red-50 text-red-800 dark:bg-red-900/40 dark:text-red-200"
                : "border-neutral-200 bg-white text-neutral-800 dark:bg-neutral-800"
            }`}
            role="status"
          >
            {/* Icon */}
            {t.type === "success" && (
              <svg
                className="h-5 w-5 text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            {t.type === "error" && (
              <svg
                className="h-5 w-5 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            {t.type === "info" && (
              <svg
                className="h-5 w-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            )}

            {/* Message */}
            <span className="flex-1 text-sm font-medium">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider />");
  return ctx;
}
