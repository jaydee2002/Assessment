"use client";

import { useEffect, useState, useCallback } from "react";
import { listBooks, deleteBook } from "@/lib/books";
import BookCard from "@/components/bookcard";
import ConfirmDialog from "@/components/confirmdialog";
import Link from "next/link";
import { useToast } from "@/components/toast";

export default function HomePage() {
  const { success, error } = useToast();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetBook, setTargetBook] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const PUBLIC_PREFIX = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const IMAGE_COUNT = 12;
  const getCover = (index) =>
    `${PUBLIC_PREFIX}/images/${(index % IMAGE_COUNT) + 1}.jpg`;

  useEffect(() => {
    let alive = true;
    setLoading(true);
    listBooks()
      .then((data) => {
        if (!alive) return;
        setBooks(Array.isArray(data) ? data : []);
        setErr("");
      })
      .catch((e) => {
        if (!alive) return;
        setErr(e?.message || "Failed to load books");
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const openDelete = useCallback((book) => {
    setTargetBook(book);
    setConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!targetBook?.id) return;
    const id = targetBook.id;
    setConfirmOpen(false);
    setDeletingId(id);

    const prev = books;
    setBooks((curr) => curr.filter((b) => b.id !== id));
    try {
      await deleteBook(id);
      success(`Deleted “${targetBook.title}”.`);
    } catch (e) {
      setBooks(prev);
      const msg = e?.message || "Delete failed";
      setErr(msg);
      error(msg);
    } finally {
      setDeletingId(null);
      setTargetBook(null);
    }
  }, [targetBook, books, success, error]);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-[1px] shadow-lg">
        <div className="flex flex-col gap-4 rounded-2xl bg-white/90 p-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between dark:bg-neutral-900/80">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-800 to-neutral-500 bg-clip-text text-transparent dark:from-white dark:to-neutral-300">
              Books
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Manage your library — add, edit, and remove titles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/books/add"
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  d="M12 5v14M5 12h14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Add Book
            </Link>
          </div>
        </div>
      </div>

      {/* Error */}
      {err && (
        <div className="rounded-xl border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-400/40 dark:bg-red-950/40 dark:text-red-200">
          {err}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[360px] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="h-60 w-full animate-pulse bg-neutral-200/80 dark:bg-neutral-700/60" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-2/3 animate-pulse rounded bg-neutral-200/80 dark:bg-neutral-700/60" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200/80 dark:bg-neutral-700/60" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-neutral-200/80 dark:bg-neutral-700/60" />
                <div className="mt-4 h-9 w-full animate-pulse rounded-lg bg-neutral-200/80 dark:bg-neutral-700/60" />
              </div>
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-900/40">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm dark:bg-neutral-800">
            <svg
              className="h-6 w-6 text-neutral-500 dark:text-neutral-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" strokeLinecap="round" />
              <path
                d="M6 2h9a2 2 0 012 2v14H8a2 2 0 01-2-2V2z"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-neutral-700 dark:text-neutral-300">
            No books yet.
          </p>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Start building your collection by adding your first book.
          </p>
          <div className="mt-5">
            <Link
              href="/books/add"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Add your first book
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book, idx) => (
            <div
              key={book.id}
              className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
            >
              {/* Cover image */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
                <img
                  src={getCover(idx)}
                  alt={book.title || "Book cover"}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-black/0 to-black/0" />
              </div>

              {/* Decorative top bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

              <div className="p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="line-clamp-2 text-lg font-semibold text-neutral-900 dark:text-white">
                    {book.title}
                  </h3>
                  <button
                    onClick={() => openDelete(book)}
                    disabled={deletingId === book.id}
                    className="shrink-0 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                    title="Delete"
                  >
                    {deletingId === book.id ? "Deleting…" : "Delete"}
                  </button>
                </div>

                <p className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
                  by{" "}
                  <span className="font-medium text-neutral-700 dark:text-neutral-200">
                    {book.author}
                  </span>
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {book.isbn && (
                    <span className="inline-flex items-center rounded-full border border-neutral-200 px-2.5 py-1 text-xs text-neutral-600 dark:border-neutral-700 dark:text-neutral-300">
                      ISBN: {book.isbn}
                    </span>
                  )}
                  {book.publicationYear && (
                    <span className="inline-flex items-center rounded-full border border-neutral-200 px-2.5 py-1 text-xs text-neutral-600 dark:border-neutral-700 dark:text-neutral-300">
                      {book.publicationYear}
                    </span>
                  )}
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <Link
                    href={`/books/${book.id}`}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-neutral-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                  >
                    View
                  </Link>
                  <Link
                    href={`/books/${book.id}/edit`}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this book?"
        message={
          targetBook ? `“${targetBook.title}” will be permanently removed.` : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        busy={false}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setTargetBook(null);
        }}
      />
    </section>
  );
}
