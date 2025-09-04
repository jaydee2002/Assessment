"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";

function NavLink({ href, children, onClick }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-indigo-600 text-white shadow-sm dark:bg-indigo-500"
          : "text-neutral-700 hover:bg-indigo-50 hover:text-indigo-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white"
        >
          BOOKS
        </Link>

        {/* Right side: nav links (desktop) + mobile toggle */}
        <div className="flex items-center gap-2">
          {/* Desktop links */}
          <div className="hidden gap-2 md:flex">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/books/add">Add Book</NavLink>
          </div>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-700 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:hidden dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 md:hidden">
          <div className="container mx-auto flex flex-col gap-2 px-4 py-3 sm:px-6 lg:px-8">
            <NavLink href="/" onClick={close}>
              Home
            </NavLink>
            <NavLink href="/books/add" onClick={close}>
              Add Book
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
