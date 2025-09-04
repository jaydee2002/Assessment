"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { createBook } from "@/lib/books";
import { useMemo, useState } from "react";

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

export default function AddBookPage() {
  const router = useRouter();
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
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: "", author: "", isbn: "", publicationDate: "" },
    mode: "onBlur",
  });

  const onSubmit = async (values) => {
    setSubmitError("");
    try {
      await createBook(values); // no imageUrl
      router.push("/");
    } catch (e) {
      const msg = e?.message || "Failed to create book";
      setSubmitError(msg);
      // e.g., setError("isbn", { type: "server", message: "ISBN already exists" });
    }
  };

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-[1px] shadow-lg">
        <div className="rounded-2xl bg-white/90 p-5 backdrop-blur dark:bg-neutral-900/80">
          <h1 className="bg-gradient-to-r from-neutral-900 to-neutral-500 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent dark:from-white dark:to-neutral-300">
            Add Book
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Fill in the details below. All fields are required.
          </p>
        </div>
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
              placeholder="Clean Code (2nd Edition)"
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
              placeholder="Robert C. Martin"
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
              We’ll fetch the cover automatically from ISBN.
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
            onClick={() => history.back()}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save Book"}
          </button>
        </div>
      </form>
    </section>
  );
}
