import React from "react";

function TableRowSkeleton() {
  return (
    <div
      className="grid items-center border-b border-slate-300 px-6 py-4 last:border-b-0 animate-pulse"
      style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1.5fr" }}
    >
      {/* RUT */}
      <div className="h-6 w-24 bg-slate-200 rounded-md"></div>

      {/* Nombre */}
      <div className="h-6 w-32 bg-slate-200 rounded-md"></div>

      {/* Estado */}
      <div>
        <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
      </div>

      {/* Inicio */}
      <div className="h-6 w-20 bg-slate-200 rounded-md"></div>

      {/* Término */}
      <div className="h-6 w-20 bg-slate-200 rounded-md"></div>

      {/* Acciones (3 botones) */}
      <div className="flex items-center gap-2">
        <div className="h-9 w-24 bg-slate-200 rounded-lg"></div>
        <div className="h-9 w-24 bg-rose-100 rounded-lg"></div>
      </div>
    </div>
  );
}

export default function GuestAccessDesktopSkeleton({ rows = 6 }) {
  return (
    <div className="hidden lg:block">
      <div className="overflow-hidden rounded-[22px] bg-white shadow-sm border border-slate-100">
        {/* Cabecera Estática (opcional, puedes dejarla igual que la real) */}
        <div
          className="grid border-b border-slate-200 px-6 py-4 font-bold text-slate-400"
          style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1.5fr" }}
        >
          <div>RUT</div>
          <div>NOMBRE</div>
          <div>ESTADO</div>
          <div>INICIO</div>
          <div>TÉRMINO</div>
          <div>ACCIONES</div>
        </div>

        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}