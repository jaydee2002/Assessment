"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getBook, updateBook } from "@/lib/books";

// --- Validation (no imageUrl) ---
const isbnRegex =
  /^(?:\d{9}[\dXx]|\d{13}|\d{1,5}-\d{1,7}-\d{1,7}-[\dXx]|\d{3}-\d-\d{2}-\d{6}-\d)$/;

const schema = yup.object({
  title: yup.string().trim().required("Title is required"),
  author: yup.string().trim().required("Author is required"),
  isbn: yup
    .string()
    .trim()
    .matches(isbnRegex, "Enter a valid ISBN-10 or ISBN-13")
    .required("ISBN is required"),
  publicationDate: yup
    .string()
    .required("Publication date is required")
    .test("not-future", "Date cannot be in the future", (value) => {
      if (!value) return false;
      const today = new Date();
      const d = new Date(value);
      d.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return d <= today;
    }),
});

export default function EditBookPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const todayStr = useMemo(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      author: "",
      isbn: "",
      publicationDate: "",
    },
    mode: "onBlur",
  });

  // Load existing book and prefill
  useEffect(() => {
    let alive = true;
    setLoading(true);
    getBook(id)
      .then((data) => {
        if (!alive) return;
        reset({
          title: data?.title ?? "",
          author: data?.author ?? "",
          isbn: data?.isbn ?? "",
          // ensure input type="date" value is YYYY-MM-DD
          publicationDate: (data?.publicationDate || "").slice(0, 10),
        });
        setLoadError("");
      })
      .catch((e) => {
        if (!alive) return;
        setLoadError(e?.message || "Failed to load book");
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id, reset]);

  const onSubmit = async (values) => {
    setSubmitError("");
    try {
      await updateBook(id, values); // no imageUrl in payload
      router.push(`/books/${id}`);
    } catch (e) {
      const msg = e?.message || "Failed to update book";
      setSubmitError(msg);
      // Example: map server field error
      // if (e?.details?.field === "isbn") {
      //   setError("isbn", { type: "server", message: e.details.message || "Invalid ISBN" });
      // }
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="h-5 w-40 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="h-10 w-full animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-2xl border border-red-300/60 bg-red-50 p-6 text-sm text-red-700 shadow-sm dark:border-red-400/40 dark:bg-red-950/40 dark:text-red-200">
        <div className="flex items-center justify-between gap-3">
          <p>{loadError}</p>
          <button
            className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            onClick={() => router.back()}
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Edit Book
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Update the fields and save.
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
          onClick={() => router.back()}
        >
          Back
        </button>
      </div>

      {/* Submit error */}
      {submitError && (
        <div className="rounded-xl border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-400/40 dark:bg-red-950/40 dark:text-red-200">
          {submitError}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div className="grid grid-cols-1 gap-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
              Title
            </label>
            <input
              type="text"
              className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-indigo-400 dark:bg-neutral-800 dark:text-neutral-100 ${
                errors.title
                  ? "border-red-300 focus:border-red-400"
                  : "border-neutral-300 focus:border-neutral-400 dark:border-neutral-700"
              }`}
              {...register("title")}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
              Author
            </label>
            <input
              type="text"
              className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-indigo-400 dark:bg-neutral-800 dark:text-neutral-100 ${
                errors.author
                  ? "border-red-300 focus:border-red-400"
                  : "border-neutral-300 focus:border-neutral-400 dark:border-neutral-700"
              }`}
              {...register("author")}
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.author.message}
              </p>
            )}
          </div>

          {/* ISBN */}
          <div>
            <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
              ISBN
            </label>
            <input
              type="text"
              className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-indigo-400 dark:bg-neutral-800 dark:text-neutral-100 ${
                errors.isbn
                  ? "border-red-300 focus:border-red-400"
                  : "border-neutral-300 focus:border-neutral-400 dark:border-neutral-700"
              }`}
              {...register("isbn")}
              placeholder="9780132350884"
            />
            {errors.isbn && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.isbn.message}
              </p>
            )}
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Cover image will be fetched automatically from ISBN.
            </p>
          </div>

          {/* Publication Date */}
          <div>
            <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
              Publication Date
            </label>
            <input
              type="date"
              max={todayStr}
              className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-indigo-400 dark:bg-neutral-800 dark:text-neutral-100 ${
                errors.publicationDate
                  ? "border-red-300 focus:border-red-400"
                  : "border-neutral-300 focus:border-neutral-400 dark:border-neutral-700"
              }`}
              {...register("publicationDate")}
            />
            {errors.publicationDate && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.publicationDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
