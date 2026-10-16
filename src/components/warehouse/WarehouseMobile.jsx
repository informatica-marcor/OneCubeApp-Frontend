import React from "react";
import { User, LogOut, CalendarPlus } from "lucide-react";

const formatDate = (dateString) => {
    if (!dateString) return "--/--/----";
    const date = new Date(dateString);
    // Verificamos si la fecha es válida
    if (isNaN(date.getTime())) return "--/--/----"; 
    
    return date.toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

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
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 font-semibold text-white text-lg shadow-sm transition hover:bg-emerald-600"
            >
                Arrendar <CalendarPlus className="h-4 w-4" />
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-red-600 bg-red-50 font-semibold text-red-600 text-lg transition hover:bg-red-100"
        >
            Terminar <LogOut className="h-4 w-4" />
        </button>
    );
}
export default function WarehouseMobile({
    warehouses,
    onEndLease,
    onNewLease,
}) {
    return (
        <div className="space-y-4 lg:hidden">
            {warehouses.map((wh) => (
                <article
                    key={wh.id}
                    className="rounded-[22px] bg-white p-6 shadow-lg"
                >
                    {/* header */}
                    <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h3 className="text-lg uppercase font-bold text-slate-900">
                                {wh.name}
                            </h3>

                            {wh.tenant && (
                                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                    <User className="h-4 w-4" />
                                    <span>Arrendado a: {wh.tenant}</span>
                                </div>
                            )}
                        </div>

                        <StatusBadge status={wh.status} />
                    </div>

                    {/* detalles */}
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <p className="mb-1 text-xs font-bold uppercase text-slate-400">
                                Tipo
                            </p>
                            <p className="text-lg font-semibold text-slate-900">
                                {wh.isolated ? "Aislado" : "Estándar"}
                            </p>

                            <p className="mt-3 mb-1 text-xs font-bold uppercase text-slate-400">
                                Inicio
                            </p>
                            <p className="text-lg font-semibold text-slate-900">
                                {wh.start_date ? wh.start_date : "--/--/----" }
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="mb-1 text-xs font-bold uppercase text-slate-400">
                                Tamaño
                            </p>
                            <p className="text-lg font-semibold text-slate-900">
                                {wh.size_m2} m²
                            </p>

                            <p className="mt-3 mb-1 text-xs font-bold uppercase text-slate-400">
                                Término
                            </p>
                            <p className="font-semibold text-red-500">
                                {wh.end_date ? wh.end_date : "--/--/----" }
                            </p>
                        </div>
                    </div>

                    <ActionButton
                        status={wh.status}
                        onClick={() =>
                            wh.status === "DISPONIBLE"
                                ? onNewLease(wh)
                                : onEndLease(wh)
                        }
                    />
                </article>
            ))}
        </div>
    );
}