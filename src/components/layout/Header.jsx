import React from "react";
import { Bell } from "lucide-react";
import UserMenu from "./UserMenu";
import logo from "../../assets/onecube-logo-sn.svg";

export default function Header({
  title,
  isLoadingPhoto,
  user,
  userPhoto,
  onEdit,
  onLogout,
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-7">
      <div className="flex min-w-0 items-end gap-3">
        <img
          src={logo}
          alt="OneCube"
          className="block h-9 w-auto md:hidden"
        />

        <h1 className="truncate text-2xl font-['Roboto'] font-bold tracking-tight text-slate-900">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="hidden h-8 w-px bg-slate-200 md:block" />

        <UserMenu
          isLoadingPhoto={isLoadingPhoto}
          user={user}
          userPhoto={userPhoto}
          onEdit={onEdit}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
}