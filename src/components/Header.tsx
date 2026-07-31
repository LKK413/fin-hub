"use client";

import { useState } from "react";
import { Menu, PiggyBank, X } from "lucide-react";

const navLinks = [
  { href: "/calculator/salary", label: "연봉 계산기" },
  { href: "/calculator/loan", label: "대출이자 계산기" },
  { href: "/calculator/severance", label: "퇴직금 계산기" },
  { href: "/rates", label: "오늘의 환율" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <a href="/" className="flex items-center gap-2 font-display text-lg font-bold text-zinc-900">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-amber-400">
            <PiggyBank className="h-4 w-4" strokeWidth={1.75} />
          </span>
          핀허브
        </a>

        <nav className="hidden gap-6 text-sm font-medium text-zinc-500 sm:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap transition-colors hover:text-amber-600"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 sm:hidden"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-zinc-200 bg-white sm:hidden">
          <div className="mx-auto flex max-w-4xl flex-col px-4 py-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-zinc-50 py-3 text-sm font-medium text-zinc-600 transition-colors last:border-0 hover:text-amber-600"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
