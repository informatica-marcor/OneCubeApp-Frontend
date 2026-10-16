import React from 'react';
import { Eye, CheckCheck } from "lucide-react";

export default function TicketsMobile({
    tickets,
    onTicketClick,
    onTicketResolve,
    onTicketResolveConfirm,
}) {
    return (
        <div className="space-y-4 lg:hidden">
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
                        className="rounded-[22px] bg-white p-6 shadow-lg"
                    >
                        {/* header */}
                        <div className="mb-4 flex justify-between items-start gap-4">
                            <p className="text-lg font-semibold text-slate-900">
                                {ticket.subject}
                            </p>

                            <p className={`uppercase text-lg font-bold whitespace-nowrap ${isResolved ? 'text-emerald-500' : 'text-red-500'}`}>
                                {isResolved ? "Resuelto" : "Pendiente"}
                            </p>
                        </div>


                        {/* detalles */}
                        <div className="mb-4 grid grid-cols-2 gap-4">
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

                         <div className={`grid gap-1 ${isResolved ? "grid-cols-1" : "grid-cols-2"}`}>
                            <button
                                type="button"
                                onClick={() => onTicketClick?.(ticket)}
                                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-500 font-semibold text-slate-900 text-lg shadow-sm transition"
                            >
                                Revisar
                                <Eye size={18} />
                            </button>

                            {!isResolved && (
                            <button
                                type="button"
                                onClick={() => onTicketResolve?.(ticket)}
                                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 border-2 border-emerald-700 font-semibold text-white text-lg shadow-sm transition hover:bg-emerald-600"
                            >
                                Resolver
                                <CheckCheck size={18} />
                            </button>
                            )}
                        </div>
                    </article>
                );
                })
            )}
        </div>
    );
}