import React from "react";

export default function WarehouseMobileSkeleton({ cards = 3 }) {
    const skeletonCards = Array.from({ length: cards });

    return (
        <div className="space-y-4 md:hidden">
            {skeletonCards.map((_, index) => (
                <article
                    key={index}
                    className="animate-pulse rounded-[20px] bg-white p-4 shadow-sm"
                >
                    {/* Skeleton: Header (Nombre y Status) */}
                    <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-3">
                            {/* Nombre de bodega */}
                            <div className="h-6 w-32 rounded-md bg-slate-200"></div>
                            
                            {/* Arrendatario (simulando que existe en la carga) */}
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full bg-slate-100"></div>
                                <div className="h-4 w-36 rounded-md bg-slate-100"></div>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="h-5 w-20 rounded bg-slate-200"></div>
                    </div>

                    {/* Skeleton: Detalles (Tipo, Tamaño, Fechas) */}
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        {/* Columna Izquierda */}
                        <div>
                            <div className="mb-2 h-3 w-10 rounded bg-slate-100"></div>
                            <div className="h-5 w-20 rounded-md bg-slate-200"></div>

                            <div className="mt-4 mb-2 h-3 w-12 rounded bg-slate-100"></div>
                            <div className="h-5 w-24 rounded-md bg-slate-200"></div>
                        </div>

                        {/* Columna Derecha (Alineada a la derecha) */}
                        <div className="flex flex-col items-end">
                            <div className="mb-2 h-3 w-14 rounded bg-slate-100"></div>
                            <div className="h-5 w-16 rounded-md bg-slate-200"></div>

                            <div className="mt-4 mb-2 h-3 w-14 rounded bg-slate-100"></div>
                            <div className="h-5 w-24 rounded-md bg-slate-200"></div>
                        </div>
                    </div>

                    {/* Skeleton: Botón de Acción (Full width) */}
                    <div className="h-12 w-full rounded-xl bg-slate-200"></div>
                </article>
            ))}
        </div>
    );
}