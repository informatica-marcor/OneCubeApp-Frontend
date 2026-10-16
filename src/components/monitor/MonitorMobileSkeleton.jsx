import React from "react";
import { User } from "lucide-react";

export default function MonitorMobileSkeleton({ length = 4 }) {
    // Creamos un array basado en el parámetro 'length'
    const skeletonCards = Array.from({ length });

    return (
        <div className="space-y-4 lg:hidden">
            {skeletonCards.map((_, index) => (
                <article
                    key={index}
                    className="animate-pulse rounded-[22px] bg-white p-6 space-y-4 shadow-lg"
                >
                    {/* Primera fila: Dispositivo y Tipo de Evento */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Skeleton Dispositivo */}
                        <div className="h-6 w-24 rounded bg-slate-200"></div>

                        {/* Skeleton Tipo de Evento (Alineado a la derecha) */}
                        <div className="flex justify-end">
                            <div className="h-6 w-32 rounded bg-slate-100"></div>
                        </div>
                    </div>

                    {/* Segunda fila: Usuario y Fecha */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Skeleton Usuario con icono */}
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-slate-200"></div>
                            <div className="h-5 w-20 rounded bg-slate-100"></div>
                        </div>

                        {/* Skeleton Fecha (Alineado a la derecha) */}
                        <div className="flex justify-end">
                            <div className="h-5 w-28 rounded bg-slate-100"></div>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}