import React from "react";

function MobileLeaseCardSkeleton() {
  return (
    <article className="rounded-[20px] bg-white p-4 shadow-sm animate-pulse border border-slate-50">
      {/* Cabecera: Nombre y Badge */}
      <div className="mb-6 flex items-center justify-center gap-2">
        <div className="h-8 w-32 bg-slate-300 rounded-lg"></div>
      </div>

      <div className="space-y-5">
        {/* Tipo - Tamaño */}
        <div className="grid grid-cols-2 gap-2">
          
          {/* Tipo */}
          <div>
            <div className="mb-2 h-3 w-10 bg-slate-200 rounded"></div>
            <div className="h-6 w-24 bg-slate-300 rounded-md"></div>
          </div>

          {/* Tamaño */}
          <div className="flex flex-col items-end">
            <div className="mb-2 h-3 w-12 bg-slate-200 rounded"></div>
            <div className="h-6 w-24 bg-slate-300 rounded-md"></div>
          </div>

        </div>


        {/* Fechas en Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-2 h-3 w-10 bg-slate-200 rounded"></div>
            <div className="h-6 w-24 bg-slate-300 rounded-md"></div>
          </div>

          <div className="flex flex-col items-end">
            <div className="mb-2 h-3 w-12 bg-slate-200 rounded text-right"></div>
            <div className="h-6 w-24 bg-rose-300/50 rounded-md"></div>
          </div>
        </div>

      </div>
    </article>
  );
}

export default function LeaseCardsSkeleton({ rows = 3 }) {
  return (
    <div className="space-y-4 lg:hidden">
      {Array.from({ length: rows }).map((_, index) => (
        <MobileLeaseCardSkeleton key={index} />
      ))}
    </div>
  );
}