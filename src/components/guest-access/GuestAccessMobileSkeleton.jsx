import React from "react";

function GuestCardSkeleton() {
  return (
    <article className="rounded-[20px] bg-white p-4 shadow-sm animate-pulse border border-slate-50">
      {/* Cabecera: Nombre y Status */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-3">
          <div className="h-8 w-40 bg-slate-200 rounded-lg"></div> {/* Nombre */}
          <div className="h-6 w-28 bg-slate-200 rounded-md"></div> {/* RUT */}
        </div>
        <div className="h-8 w-20 bg-slate-200 rounded-full"></div> {/* Status */}
      </div>

      {/* Fechas */}
      <div className="mb-5 grid grid-cols-2 gap-4">
        <div>
          <div className="mb-2 h-3 w-10 bg-slate-100 rounded"></div>
          <div className="h-6 w-24 bg-slate-200 rounded-md"></div>
        </div>
        <div className="flex flex-col items-end">
          <div className="mb-2 h-3 w-12 bg-slate-100 rounded text-right"></div>
          <div className="h-6 w-24 bg-slate-200 rounded-md"></div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="grid grid-cols-2 gap-2">
        <div className="h-10 w-full bg-slate-100 rounded-xl"></div>
        <div className="h-10 w-full bg-rose-100 rounded-xl"></div>
      </div>
    </article>
  );
}

export default function GuestAccessMobileSkeleton({ rows = 3 }) {
  return (
    <div className="space-y-4 lg:hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <GuestCardSkeleton key={i} />
      ))}
    </div>
  );
}