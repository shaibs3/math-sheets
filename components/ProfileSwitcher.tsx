"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress/useProgress";

const menuItemClass =
  "flex w-full min-h-11 cursor-pointer items-center gap-2 rounded-lg px-3 text-right text-sm transition-colors hover:bg-[var(--color-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]";

export default function ProfileSwitcher() {
  const { profiles, activeProfile, mounted, addProfile, switchProfile, renameProfile, removeProfile } =
    useProgress();
  const [open, setOpen] = useState(false);

  if (!mounted) return null;

  const promptNickname = (initial = "") => {
    const nickname = window.prompt("שם הילד/ה", initial);
    return nickname === null ? null : nickname.trim();
  };

  const onAdd = () => {
    const nickname = promptNickname();
    if (nickname) addProfile(nickname);
    setOpen(false);
  };

  const onRename = () => {
    if (!activeProfile) return;
    const nickname = promptNickname(activeProfile.nickname);
    if (nickname) renameProfile(activeProfile.id, nickname);
    setOpen(false);
  };

  const onRemove = () => {
    if (!activeProfile) return;
    if (window.confirm(`למחוק את ${activeProfile.nickname} ואת כל ההתקדמות שלו/ה?`)) {
      removeProfile(activeProfile.id);
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors hover:bg-[var(--color-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
      >
        <span className="flex size-7 items-center justify-center rounded-full bg-[var(--color-muted)] text-xs font-bold text-[var(--color-primary)]">
          {activeProfile ? activeProfile.nickname.slice(0, 1) : "+"}
        </span>
        {activeProfile ? activeProfile.nickname : "הוספת ילד"}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full left-0 z-30 mt-1 w-56 rounded-xl border border-[var(--color-border)] bg-white p-2 shadow-lg"
        >
          {profiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              role="menuitem"
              onClick={() => {
                switchProfile(profile.id);
                setOpen(false);
              }}
              className={`${menuItemClass} ${profile.id === activeProfile?.id ? "font-semibold text-[var(--color-primary)]" : ""}`}
            >
              {profile.nickname}
            </button>
          ))}

          {profiles.length > 0 && <hr className="my-2 border-[var(--color-border)]" />}

          <button type="button" role="menuitem" onClick={onAdd} className={menuItemClass}>
            הוספת ילד/ה
          </button>
          {activeProfile && (
            <>
              <button type="button" role="menuitem" onClick={onRename} className={menuItemClass}>
                שינוי שם
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={onRemove}
                className={`${menuItemClass} text-red-700`}
              >
                מחיקה
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
