import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, LoaderCircle } from "lucide-react";
import ProfileCard from "./ProfileCard";

export default function UserMenu({ isLoadingPhoto, user, userPhoto, onEdit, onLogout }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-slate-50"
      >
        <div className="flex h-9 w-9 overflow-hidden items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 ring-2 ring-white">
          {isLoadingPhoto ? (
              <div className="flex h-full w-full items-center justify-center">
                <LoaderCircle className="h-8 w-8 animate-spin text-emerald-700" />
              </div>
            ) : userPhoto ? (
              <img
                src={userPhoto}
                alt={user?.name || "Foto de perfil"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-extrabold text-emerald-700 md:text-4xl">
                {(user?.name || "").trim().slice(0, 2).toUpperCase() || "US"}
              </div>
            )}
        </div>

        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-slate-800">{user?.name}</p>
        </div>

        <ChevronDown className="h-4 w-4 text-slate-500" />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[355px] max-w-[calc(100vw-1rem)]">
          <ProfileCard
            photo={userPhoto}
            isLoadingPhoto={isLoadingPhoto}
            user={user}
            onEdit={onEdit}
            onLogout={onLogout}
          />
        </div>
      )}
    </div>
  );
}