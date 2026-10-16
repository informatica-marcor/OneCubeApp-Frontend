import React from 'react';

export default function TicketsDesktopSkeleton({ length = 5 }) {
  // Creamos el array de filas basado en el parámetro length
  const skeletonRows = Array.from({ length });

  return (
    <div className="hidden lg:block space-y-5">
      {skeletonRows.map((_, index) => (
        <article
          key={index}
          className="grid animate-pulse items-center gap-6 rounded-[22px] border border-slate-100 bg-white p-6 shadow-lg"
          style={{
            gridTemplateColumns: "3fr 2fr 2fr 1fr 3fr",
          }}
        >
          {/* Skeleton Asunto */}
          <div>
            <div className="mb-2 h-3 w-16 rounded bg-slate-200"></div>
            <div className="h-6 w-4/5 rounded bg-slate-100"></div>
          </div>

          {/* Skeleton Enviado */}
          <div>
            <div className="mb-2 h-3 w-20 rounded bg-slate-200"></div>
            <div className="h-6 w-32 rounded bg-slate-100"></div>
          </div>

          {/* Skeleton Resuelto Fecha */}
          <div>
            <div className="mb-2 h-3 w-20 rounded bg-slate-200"></div>
            <div className="h-6 w-32 rounded bg-slate-100"></div>
          </div>

          {/* Skeleton Estado */}
          <div>
            <div className="mb-2 h-3 w-16 rounded bg-slate-200"></div>
            <div className="h-6 w-20 rounded bg-slate-100"></div>
          </div>

          {/* Skeleton Acciones (Simulamos los dos botones) */}
          <div className="grid grid-cols-2 gap-2">
            <div className="h-12 w-full rounded-xl bg-slate-200"></div>
            <div className="h-12 w-full rounded-xl bg-slate-200"></div>
          </div>
        </article>
      ))}
    </div>
  );
}