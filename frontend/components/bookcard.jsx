"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

function coverFromISBN(isbn) {
  if (!isbn) return null;
  return `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(
    isbn
  )}-L.jpg`;
}

export default function BookCard({ book, onDelete, disabled = false }) {
  const { id, title, author, isbn } = book || {};
  const fallback = "/placeholder-book.png";

  const initialSrc = useMemo(() => coverFromISBN(isbn) || fallback, [isbn]);
  const [src, setSrc] = useState(initialSrc);

  const alt = useMemo(
    () => (title ? `${title} — cover` : "Book cover"),
    [title]
  );

  return (
    <div
      className={`group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 ${
        disabled ? "opacity-60" : ""
      }`}
    >
      {/* Cover */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setSrc(fallback)}
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Info */}
      <div className="space-y-3 p-4">
        <div>
          <h3 className="line-clamp-2 text-base font-semibold leading-tight text-neutral-900 dark:text-white">
            {title}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm text-neutral-600 dark:text-neutral-400">
            {author}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            href={`/books/${id}`}
            className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-center text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
          >
            View
          </Link>
          <Link
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            href={`/books/${id}/edit`}
            className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-center text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
          >
            Edit
          </Link>
          <button
            className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={disabled}
            aria-busy={disabled}
            onClick={() => onDelete?.(book)}
          >
            {disabled ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
