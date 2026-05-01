"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutTemplate,
  Map,
  FileText,
  Car,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "@/lib/auth/actions";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: Home, exact: true },
  { href: "/admin/home", label: "Home page", icon: LayoutTemplate, exact: false },
  { href: "/admin/packages", label: "Tours", icon: Map, exact: false },
  { href: "/admin/tours-page", label: "Tours page", icon: FileText, exact: false },
  { href: "/admin/transportation", label: "Transportation", icon: Car, exact: false },
];

interface AdminSidebarProps {
  email: string;
}

export function AdminSidebar({ email }: AdminSidebarProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  function isActive(item: typeof NAV_ITEMS[number]) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
  }

  const navContent = (
    <nav className="flex flex-col gap-0.5" aria-label="Admin navigation">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2.5 transition-colors duration-200 border-l-2 ${
              active
                ? "border-ochre bg-cream-warm text-ink"
                : "border-transparent text-ink-soft hover:bg-cream-warm hover:text-ink"
            }`}
          >
            <Icon size={16} className="text-ochre flex-shrink-0" />
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase font-medium">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );

  const brand = (
    <div className="flex items-center gap-3">
      <span className="font-display italic text-[17px] w-7 h-7 rounded-full border border-ochre text-ochre flex items-center justify-center tracking-tight flex-shrink-0">
        M
      </span>
      <div>
        <span className="font-display text-[16px] tracking-tight text-ink leading-none">
          Meridian <span className="text-ochre italic">&amp;</span> Co.
        </span>
        <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-muted mt-0.5">
          Concierge
        </p>
      </div>
    </div>
  );

  const footer = (
    <div className="px-4 py-5 border-t border-rule">
      <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted truncate mb-3">
        {email}
      </p>
      <form action={signOut}>
        <button
          type="submit"
          className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft hover:text-terracotta transition-colors duration-200"
        >
          Sign out
        </button>
      </form>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[280px] flex-shrink-0 bg-cream border-r border-rule h-screen sticky top-0">
        <div className="px-5 py-6 pb-8 border-b border-rule">
          {brand}
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          {navContent}
        </div>
        {footer}
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-cream border-b border-rule px-4 py-3 flex items-center justify-between">
        {brand}
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="p-1.5 text-ink-soft hover:text-ink transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-ink/40"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed top-0 left-0 bottom-0 z-50 w-[280px] bg-cream flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!drawerOpen}
      >
        <div className="px-5 py-5 border-b border-rule flex items-center justify-between">
          {brand}
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            className="p-1.5 text-ink-soft hover:text-ink transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          {navContent}
        </div>
        {footer}
      </div>
    </>
  );
}
