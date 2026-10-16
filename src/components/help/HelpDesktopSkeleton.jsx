// HelpDesktopSkeleton.jsx
import React from "react";

function SkeletonBlock({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-md bg-slate-200 ${className}`} />
  );
}

function HelpDesktopSkeletonCard() {
  return (
    <article
      className="grid items-center gap-6 rounded-3xl border border-slate-100 bg-white px-8 py-6 shadow-sm"
      style={{
        gridTemplateColumns: "3fr 2fr 2fr 1fr 2fr",
      }}
    >
      {/* Asunto */}
      <div>
        <SkeletonBlock className="mb-2 h-4 w-20 bg-slate-100" />
        <SkeletonBlock className="h-6 w-56" />
      </div>

      {/* Enviado */}
      <div>
        <SkeletonBlock className="mb-2 h-4 w-20 bg-slate-100" />
        <SkeletonBlock className="h-6 w-36" />
      </div>

      {/* Resuelto */}
      <div>
        <SkeletonBlock className="mb-2 h-4 w-20 bg-slate-100" />
        <SkeletonBlock className="h-6 w-36" />
      </div>

      {/* Estado */}
      <div>
        <SkeletonBlock className="mb-2 h-4 w-20 bg-slate-100" />
        <SkeletonBlock className="h-6 w-24" />
      </div>

      {/* Acción */}
      <div className="flex justify-end">
        <SkeletonBlock className="h-12 w-full rounded-xl" />
      </div>
    </article>
  );
}

export default function HelpDesktopSkeleton({ rows = 4 }) {
  return (
    <div className="hidden lg:block space-y-5">
      {Array.from({ length: rows }).map((_, index) => (
        <HelpDesktopSkeletonCard key={index} />
      ))}
    </div>
  );
}