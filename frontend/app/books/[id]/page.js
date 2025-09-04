"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getBook } from "@/lib/books";

function coverFromISBN(isbn) {
  if (!isbn) return null;
  return `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(
    isbn
  )}-L.jpg`;
}

export default function ViewBookPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getBook(id)
      .then((data) => {
        if (!alive) return;
        setBook(data);
        setErr("");
      })
      .catch((e) => {
        if (!alive) return;
        setErr(e?.message || "Failed to load book");
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading)
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="h-4 w-40 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
        <div className="mt-2 h-3 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
            <div className="absolute inset-0 animate-pulse bg-neutral-200 dark:bg-neutral-700" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-28 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  if (err || !book) {
    return (
      <div className="rounded-2xl border border-red-300/60 bg-red-50 p-6 text-sm text-red-700 shadow-sm dark:border-red-400/40 dark:bg-red-950/40 dark:text-red-200">
        <div className="flex items-center justify-between gap-3">
          <p>{err || "Book not found"}</p>
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

  const { title, author, isbn, publicationDate } = book;
  const imgSrc = coverFromISBN(isbn) || "/placeholder-book.png";

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            {title}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {author}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/books/${id}/edit`}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Edit
          </Link>
          <button
            className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            onClick={() => router.back()}
          >
            Back
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Cover */}
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="relative aspect-[3/4] w-full bg-neutral-100 dark:bg-neutral-800">
            <Image
              src={imgSrc}
              alt={`${title || "Book"} — cover`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority={false}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </div>
        </div>

        {/* Details */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Title
              </p>
              <p className="mt-1 text-base font-medium text-neutral-900 dark:text-white">
                {title}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Author
              </p>
              <p className="mt-1 text-base font-medium text-neutral-900 dark:text-white">
                {author}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                ISBN
              </p>
              <p className="mt-1 text-base font-medium text-neutral-900 dark:text-white">
                {isbn}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Publication Date
              </p>
              <p className="mt-1 text-base font-medium text-neutral-900 dark:text-white">
                {publicationDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
