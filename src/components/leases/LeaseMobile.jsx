import React from "react";

export default function LeaseMobile({ leases }) {

  return (
    <div className="space-y-4 lg:hidden">
      {leases.length === 0 ? (
        <div className="rounded-[22px] px-4 py-4 text-center text-lg text-slate-500 font-semibold">
          No tiene bodegas contratadas.
        </div>
      ) : (
        leases.map((lease, index) => (
          <article
            key={lease.id ?? index}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            {/* header */}
            <div className="mb-3 flex justify-center gap-3">
              <div className="min-w-0">
                <h3 className="text-xl uppercase font-bold text-slate-900">
                  {lease.warehouse.name}
                </h3>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2">
              {/* Tipo */}
              <div>
                 <p className="mb-1 text-sm font-bold uppercase leading-none text-slate-400">
                  Tipo
                </p>
                <p className="mt-1 text-lg font-semibold leading-tight text-slate-900">
                  {lease.isolated ? "Aislado" : "Estándar"}
                </p>
              </div>

              {/* Tamaño */}
              <div className="text-right">
                 <p className="mb-1 text-sm font-bold uppercase leading-none text-slate-400">
                  Tamaño
                </p>
                <p className="mt-1 text-lg font-semibold leading-tight text-slate-900">
                  {lease.warehouse.size_m2} m²
                </p>
              </div>
            </div>

          <div className="mb-4 grid grid-cols-2 gap-2">

            {/* Fechas */}
            <div>
               <p className="mb-1 text-sm font-bold uppercase leading-none text-slate-400">
                Inicio
              </p>
              <p className="mt-1 text-lg font-semibold leading-tight text-slate-900">
                {lease.start_date}
              </p>
            </div>

            <div className="text-right">
              <p className="mb-1 text-sm font-bold uppercase leading-none text-slate-400">
                Término
              </p>
              <p className="mt-1 text-lg font-semibold leading-tight text-red-600">
                {lease.end_date}
              </p>
            </div>
          </div>

          </article>
        ))
      )}
    </div>
  );
}