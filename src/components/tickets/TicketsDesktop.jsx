import React from 'react';
import { Eye, CheckCheck } from "lucide-react";


export default function TicketDesktop({
  tickets,
  onTicketClick,
  onTicketResolve,
  onTicketResolveConfirm,
}) {
  return (
    <div className="hidden lg:block flex-col space-y-5">
      {tickets.length === 0 ? (
                <div className="py-6 text-center text-lg font-bold text-slate-600">
                    No hay tickets disponibles.
                </div>
            ) : (
      tickets.map((ticket) => {
        const isResolved = !!ticket.resolved_at;

        return (
          <article
            key={ticket.ticket_id}
            className="grid items-center gap-6 rounded-[22px] border border-slate-100 bg-white p-6 shadow-lg"
            style={{
              gridTemplateColumns: "3fr 2fr 2fr 1fr 3fr",
            }}
          >
            {/* Asunto */}
            <div>
              <p className="mb-1 text-xs font-bold uppercase text-slate-400">Asunto</p>
              <p className="text-lg font-semibold text-slate-900">{ticket.subject}</p>
            </div>

            {/* Enviado */}
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">ENVIADO</p>
              <p className="text-lg font-semibold text-slate-900">{ticket.uploaded_at}</p>
            </div>

            {/* Resuelto Fecha */}
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">RESUELTO</p>
              <p className="text-lg font-semibold text-slate-900">
                {ticket.resolved_at || "--/--/----"}
              </p>
            </div>

            {/* Estado - Usando isResolved */}
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">ESTADO</p>
              <p className={`uppercase text-base font-bold ${isResolved ? 'text-emerald-500' : 'text-red-500'}`}>
                {isResolved ? "Resuelto" : "Pendiente"}
              </p>
            </div>

            {/* Acciones */}
            <div className={`grid gap-2 ${isResolved ? "grid-cols-1" : "grid-cols-2"}`}>
              <button
                type="button"
                onClick={() => onTicketClick?.(ticket)}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-500 text-lg font-semibold text-slate-900 shadow-sm transition hover:bg-slate-200"
              >
                Revisar
                <Eye size={18} />
              </button>

              {/* El botón solo aparece si NO está resuelto */}
              {!isResolved && (
                <button
                  type="button"
                  onClick={() => onTicketResolve?.(ticket)}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 border-2 border-emerald-700 text-lg font-semibold text-white shadow-sm transition hover:bg-emerald-600"
                >
                  Resolver
                  <CheckCheck size={18} />
                </button>
              )}
            </div>
          </article>
        );
      }))}
    </div>
  );
}