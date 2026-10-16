import React from 'react';
import { Eye } from "lucide-react";


export default function HelpDesktop({
  tickets,
  onTicketClick,
}) {
  return (
    <div className="hidden lg:block space-y-5">
      {tickets.length === 0 ? (
        <div className="rounded-3xl px-6 py-6 text-center text-xl font-semibold text-slate-500">
          No se has creado ningún ticket aun.
        </div>
      ) : (
      tickets.map((ticket) => (
        <article
          key={ticket.ticket_id}
          className="grid items-center gap-6 rounded-3xl boder border-slate-100 bg-white px-8 py-6 shadow-sm"
          style={{
            gridTemplateColumns: "3fr 2fr 2fr 1fr 2fr",
          }}
        >
          {/*Asunto*/}
          <div>
            <p className="mb-1 font-bold uppercase text-slate-400">
              Asunto
            </p>

            <p className="text-lg font-medium text-slate-900">
              {ticket.subject}
            </p>
          </div>

          <div>
            <p className="mb-1 font-bold uppercase text-slate-400">
              ENVIADO
            </p>
            <p className="text-lg font-medium text-slate-900">{ticket.uploaded_at}</p>
          </div>

          <div>
            <p className="mb-1 font-bold uppercase text-slate-400">
              RESUELTO
            </p>
            <p className="text-lg font-medium text-slate-900">
              {ticket.resolved_at || "--/--/----"}
            </p>
          </div>

          <div>
            <p className="mb-1 font-bold uppercase text-slate-400">
              ESTADO
            </p>
            {ticket.resolved_at ? (
              <p className='uppercase text-lg font-medium text-emerald-500'>
                Resuelto
              </p>
            ) : (
              <p className='uppercase text-lg font-medium text-red-600'>
                Subido
              </p>

            )}
          </div>

          {/* Acciones */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onTicketClick?.(ticket)}
              className="flex w-full h-12 items-center justify-center gap-2 rounded-xl border-2 border-slate-900 px-4 py-3 text-lg font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              Examinar
            </button>
          </div>

        </article>
      )))}
    </div>
  );
}