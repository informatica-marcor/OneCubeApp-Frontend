import React from "react";

function DesktopLeaseRowSkeleton() {
  return (
    <div className="grid min-h-[108px] grid-cols-[1.5fr_1.0fr_1.0fr_1.5fr_1.5fr] items-center gap-6 rounded-[22px] border border-slate-100 bg-white px-8 py-6 shadow-sm animate-pulse">
      
      {/* Columna Nombre y Badge */}
      <div className="flex items-center gap-3">
        <div className="h-7 w-32 bg-slate-300 rounded-md"></div> {/* Título */}
      </div>

      {/* Columna Tipo */}
      <div>
        <div className="mb-2 h-3 w-8 bg-slate-200 rounded"></div>
        <div className="h-6 w-20 bg-slate-300 rounded-md"></div>
      </div>

      {/* Columna Tamaño */}
      <div>
        <div className="mb-2 h-3 w-12 bg-slate-200 rounded"></div>
        <div className="h-6 w-16 bg-slate-300 rounded-md"></div>
      </div>

      {/* Columna Inicio */}
      <div>
        <div className="mb-2 h-3 w-10 bg-slate-200 rounded"></div>
        <div className="h-6 w-32 bg-slate-300 rounded-md"></div>
      </div>

      {/* Columna Término */}
      <div>
        <div className="mb-2 h-3 w-12 bg-slate-200 rounded"></div>
        <div className="h-6 w-32 bg-rose-300/50 rounded-md"></div>
      </div>

    </div>
  );
}

export default function LeaseTableSkeleton({ rows = 3 }) {
  return (
    <div className="hidden lg:block">
      <div className="space-y-5">
        {/* Generamos tantas filas de carga como se indiquen */}
        {Array.from({ length: rows }).map((_, index) => (
          <DesktopLeaseRowSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}