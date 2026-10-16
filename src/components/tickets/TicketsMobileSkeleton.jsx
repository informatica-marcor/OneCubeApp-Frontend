import React from 'react';

export default function TicketsMobileSkeleton({ length = 4 }) {
    // Generamos el array de elementos según el parámetro length
    const skeletonCards = Array.from({ length });

    return (
        <div className="space-y-4 lg:hidden">
            {skeletonCards.map((_, index) => (
                <article
                    key={index}
                    className="animate-pulse rounded-[22px] bg-white p-6 shadow-lg"
                >
                    {/* Skeleton Header (Estado a la derecha) */}
                    <div className="mb-4 flex justify-between items-start gap-4">
                        <div className="h-5 w-32 rounded bg-slate-100"></div>
                        <div className="h-5 w-16 rounded bg-slate-100"></div>
                    </div>

                    {/* Skeleton Detalles (Enviado y Resuelto) */}
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <div className="mb-2 h-3 w-16 rounded bg-slate-200"></div>
                            <div className="h-5 w-24 rounded bg-slate-100"></div>
                        </div>

                        <div className="flex flex-col items-end">
                            <div className="mb-2 h-3 w-16 rounded bg-slate-200"></div>
                            <div className="h-5 w-24 rounded bg-slate-100"></div>
                        </div>
                    </div>

                    {/* Skeleton Botones */}
                    <div className="mt-5 grid grid-cols-2 gap-2">
                        <div className="h-12 w-full rounded-xl bg-slate-200"></div>
                        <div className="h-12 w-full rounded-xl bg-emerald-200"></div>
                    </div>
                </article>
            ))}
        </div>
    );
}