import React from 'react';
import { Eye } from "lucide-react";

export default function HelpMobile({
  tickets,
  onTicketClick,
}) {
  return (
    <div className="space-y-4 lg:hidden">
      {tickets.length === 0 ? (
        <div className="rounded-[22px] px-4 py-4 text-center text-lg font-semibold text-slate-500">
          No se has creado ningún ticket aun.
        </div>
      ) : (
      tickets.map((ticket) => (
        <article
          key={ticket.ticket_id}
          className="rounded-[22px] bg-white p-6 shadow-lg"
        >

          {/* header */}
          <div className='flex justify-between'>
            <h3 className="text-xl font-semibold text-slate-900">
              {ticket.subject}
            </h3>

            {ticket.resolved_at ? (
              <p className='uppercase text-xl text-right font-bold text-emerald-500'>
                Resuelto
              </p>
            ) : (
              <p className='uppercase text-xl text-right font-bold text-red-600'>
                Subido
              </p>
            )}

          </div>

          {/* detalles */}
          <div className="mb-4 grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="mb-1 text-sm font-bold uppercase text-slate-400">
                ENVIADO
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {ticket.uploaded_at}
              </p>
            </div>

            <div className="text-right">
              <p className="mb-1 text-sm font-bold uppercase text-slate-400">
                RESUELTO
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {ticket.resolved_at || "--/--/---- --:--"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onTicketClick?.(ticket)}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 font-semibold text-lg text-slate-900 shadow-sm transition hover:bg-slate-400"
          >
            Examinar
          </button>
        </article>
      )))}
    </div>
  );
}