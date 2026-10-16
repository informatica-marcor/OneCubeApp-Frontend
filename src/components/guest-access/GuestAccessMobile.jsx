import React from "react";
import { RefreshCw, LogOut, Trash2 } from "lucide-react";

function InfoBlock({ label, value, valueClassName = "", align = "left" }) {
  return (
    <div className={align === "right" ? "text-right" : ""}>
      <p className="mb-1 text-sm font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className={`text-lg font-medium leading-none tracking-tight text-slate-900 ${valueClassName}`}>
        {value}
      </p>
    </div>
  );
}

export default function GuestAccessMobile({
  guests = [],
  onRenew,
  onEnd,
  onDelete,
}) {
  return (
    <div className="space-y-4 lg:hidden">
      {guests.length === 0 ? (
        <div className="rounded-[22px] px-4 py-4 text-center text-lg font-semibold text-slate-500">
          No se han encontrado visitantes.
        </div>
      ) : (
        guests.map((guest, index) => {

          const [datePart, timePart] = guest.end_date.split(" ");
          const [day, month, year] = datePart.split("/");
          const isExpired = new Date(`${year}-${month}-${day}T${timePart}`) < new Date();
          const statusText = isExpired ? "Expirado" : "Vigente";
          const statusClass = isExpired ? "text-red-500" : "text-emerald-500";

          return (
            <article
              key={guest.id ?? index}
              className="rounded-[20px] bg-white p-4 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-semibold tracking-tight text-slate-900">
                    {guest.name}
                  </h2>
                  <p className="mt-3 text-xl text-slate-500">{guest.rut}</p>
                </div>

                <div className="flex flex-col items-end">
                  <span className={`text-xl uppercase font-bold ${statusClass}`}>
                    {statusText}
                  </span>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-2 gap-4">
                <InfoBlock label="Inicio" value={guest.start_date} />
                <InfoBlock
                  label="Término"
                  value={guest.end_date}
                  valueClassName="text-rose-500"
                  align="right"
                />
              </div>

              <div className="grid grid-cols-2 gap-1">

                {isExpired ? (
                  <button
                    type="button"
                    onClick={() => onRenew?.(guest)}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] border border-slate-300 bg-white px-4 text-base font-bold text-slate-500 transition hover:bg-slate-100"
                  >
                    <span>Renovar</span>
                    <RefreshCw size={20} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onEnd?.(guest)}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] border-2 border-slate-700 bg-white px-4 text-lg font-bold text-slate-700 transition hover:bg-slate-100"
                  >
                    <span>Terminar</span>
                  </button>
                  
                )}

                <button
                  type="button"
                  onClick={() => onDelete?.(guest)}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] border-2 border-red-600 bg-red-50 px-4 text-lg font-semibold text-red-600 transition hover:bg-red-100"
                >
                  Eliminar
                  <Trash2 size={20} />
                </button>
              </div>
            </article>
          );
        })
      )}
    </div>
  );
}