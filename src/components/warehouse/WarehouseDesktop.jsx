import React from "react";
import { User, LogOut, CalendarPlus } from "lucide-react";

function StatusBadge({ status }) {
    const base =
        "text-lg font-bold tracking-wide uppercase";

    if (status === "DISPONIBLE") {
        return <span className={`${base} text-emerald-600`}>DISPONIBLE</span>;
    }
    if (status === "OCUPADO") {
        return <span className={`${base} text-amber-600`}>OCUPADO</span>;
    }
    return <span className={`${base} text-red-600`}>VENCIDO</span>;
}

function ActionButton({ status, onClick }) {
    if (status === "DISPONIBLE") {
        return (
            <button
                type="button"
                onClick={onClick}
                className="inline-flex h-11 w-52 items-center justify-center gap-2 rounded-xl border-2 border-emerald-700 bg-emerald-500 px-5 font-semibold text-white text-lg shadow-sm transition hover:bg-emerald-600"
            >
                Arrendar <CalendarPlus className="h-4 w-4" />
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex h-11 w-52 items-center justify-center gap-2 rounded-xl border-2 border-red-500 bg-red-50 px-5 font-semibold text-red-600 text-lg shadow-sm transition hover:bg-red-100"
        >
            Terminar <LogOut className="h-4 w-4" />
        </button>
    );
}

export default function WarehouseDesktop({
    warehouses,
    onEndLease,
    onNewLease,
}) {
    return (
        <div className="hidden lg:block space-y-5">
            {warehouses.length === 0 ? (
                <p
                    className="px-6 py-6 text-center text-xl font-semibold text-slate-500"
                >
                    No hay Bodegas disponibles.
                </p>
            ) : (

                warehouses.map((wh) => (
                    <article
                        key={wh.id}
                        className="grid items-center gap-6 rounded-[22px] border border-slate-100 bg-white px-8 py-6 shadow-lg"
                        style={{
                            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr",
                        }}
                    >
                        {/* Nombre + arrendatario */}
                        <div className="min-w-0">
                            <h3 className="uppercase text-xl font-bold text-slate-900">
                                {wh.name}
                            </h3>

                            {wh.tenant && (
                                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                    <User className="h-4 w-4" />
                                    <span>Arrendado a: {wh.tenant}</span>
                                </div>
                            )}
                        </div>

                        {/* Estado */}
                        <div>
                            <p className="mb-1 text-xs font-bold uppercase text-slate-400">
                                Estado
                            </p>
                            <StatusBadge status={wh.status} />
                        </div>

                        {/* Tipo */}
                        <div>
                            <p className="mb-1 text-xs font-bold uppercase text-slate-400">
                                Tipo
                            </p>
                            <p className="text-lg text-slate-900">
                                {wh.isolated ? "Aislado" : "Estándar"}
                            </p>
                        </div>

                        {/* Tamaño */}
                        <div>
                            <p className="mb-1 text-xs font-bold uppercase text-slate-400">
                                Tamaño
                            </p>
                            <p className="text-lg text-slate-900">
                                {wh.size_m2} m²
                            </p>
                        </div>

                        {/* Fechas */}
                        <div>
                            <p className="mb-1 text-xs font-bold uppercase text-slate-400">
                                Inicio
                            </p>
                            <p className="text-lg text-slate-900">
                                {wh.start_date ? wh.start_date : "--/--/----"}
                            </p>
                        </div>

                        <div>
                            <p className="mb-1 text-xs font-bold uppercase text-slate-400">
                                Término
                            </p>
                            <p className="text-lg text-red-500">
                                {wh.end_date ? wh.end_date : "--/--/----"}
                            </p>
                        </div>

                        {/* Acción */}
                        <div className="flex justify-end">
                            <ActionButton
                                status={wh.status}
                                onClick={() =>
                                    wh.status === "DISPONIBLE"
                                        ? onNewLease(wh)
                                        : onEndLease(wh)
                                }
                            />
                        </div>
                    </article>
                )))}
        </div>
    );
}