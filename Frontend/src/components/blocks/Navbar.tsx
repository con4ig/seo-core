"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-bg/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-mono font-bold text-base tracking-tight">
          SEO Core
        </Link>
        <div className="flex items-center gap-8">
          <Link
            href="/articles"
            className="text-sm text-muted hover:text-fg transition-colors"
          >
            Articles
          </Link>
          <Link
            href="/categories"
            className="text-sm text-muted hover:text-fg transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/about"
            className="text-sm text-muted hover:text-fg transition-colors"
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
