"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DueLink from "./DueLink";
import ProfileSwitcher from "./ProfileSwitcher";
import { getGrade, getTopic } from "@/lib/curriculum";

type Crumb = { label: string; href?: string };

function buildCrumbs(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "grade") {
    const grade = getGrade(Number(segments[1]));
    return grade ? [{ label: grade.name }] : [];
  }
  if (segments[0] === "sheet") {
    const gradeId = Number(segments[1]);
    const grade = getGrade(gradeId);
    const topic = getTopic(gradeId, segments[2]);
    const crumbs: Crumb[] = [];
    if (grade) crumbs.push({ label: grade.name, href: `/grade/${gradeId}` });
    if (topic) crumbs.push({ label: topic.name });
    return crumbs;
  }
  return [];
}

export default function NavBar() {
  const pathname = usePathname();
  const crumbs = buildCrumbs(pathname);

  return (
    <header className="no-print sticky top-0 z-20 border-b border-[var(--color-border)] bg-white/90 backdrop-blur">
      <nav
        aria-label="ניווט ראשי"
        className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-2"
      >
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 rounded-lg px-2 font-bold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 6h16M4 12h10M4 18h13" />
            <circle cx={19} cy={17} r={3} />
          </svg>
          דפי עבודה
        </Link>

        <ol className="flex min-w-0 items-center gap-1 text-sm text-slate-600">
          {crumbs.map((crumb) => (
            <li key={crumb.label} className="flex min-w-0 items-center gap-1">
              <span aria-hidden="true" className="text-slate-300">
                /
              </span>
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="truncate rounded px-1 py-2 hover:text-[var(--color-primary)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current="page" className="truncate font-medium text-slate-900">
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>

        <div className="mr-auto flex items-center gap-1">
          <DueLink />
          <ProfileSwitcher />
        </div>
      </nav>
    </header>
  );
}
