import React from "react";


export default function WarehouseDesktopSkeleton({ rows = 3 }) {
    const skeletonRows = Array.from({ length: rows });

    return (
        <div className="hidden md:block space-y-5">
            {skeletonRows.map((_, index) => (
                <article
                    key={index}
                    className="animate-pulse grid items-center gap-6 rounded-[22px] border border-slate-100 bg-white px-8 py-6 shadow-sm"
                    style={{
                        gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr",
                    }}
                >
                    {/* Skeleton: Nombre + Arrendatario */}
                    <div className="space-y-3">
                        <div className="h-6 w-32 rounded-md bg-slate-200"></div>
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-slate-100"></div>
                            <div className="h-4 w-40 rounded-md bg-slate-100"></div>
                        </div>
                    </div>

                    {/* Skeleton: Estado */}
                    <div className="space-y-2">
                        <div className="h-3 w-12 rounded bg-slate-100"></div>
                        <div className="h-5 w-24 rounded-md bg-slate-200"></div>
                    </div>

                    {/* Skeleton: Tipo */}
                    <div className="space-y-2">
                        <div className="h-3 w-10 rounded bg-slate-100"></div>
                        <div className="h-5 w-20 rounded-md bg-slate-200"></div>
                    </div>

                    {/* Skeleton: Tamaño */}
                    <div className="space-y-2">
                        <div className="h-3 w-14 rounded bg-slate-100"></div>
                        <div className="h-5 w-16 rounded-md bg-slate-200"></div>
                    </div>

                    {/* Skeleton: Inicio */}
                    <div className="space-y-2">
                        <div className="h-3 w-12 rounded bg-slate-100"></div>
                        <div className="h-5 w-24 rounded-md bg-slate-200"></div>
                    </div>

                    {/* Skeleton: Término */}
                    <div className="space-y-2">
                        <div className="h-3 w-14 rounded bg-slate-100"></div>
                        <div className="h-5 w-24 rounded-md bg-slate-200"></div>
                    </div>

                    {/* Skeleton: Botón de Acción */}
                    <div className="flex justify-end">
                        <div className="h-11 w-52 rounded-xl bg-slate-200"></div>
                    </div>
                </article>
            ))}
        </div>
    );
}