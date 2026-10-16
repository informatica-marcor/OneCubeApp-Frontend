import React from "react";
import {
    X,
    CheckCircle2,
    Search,
    CalendarDays,
    MessageSquare,
} from "lucide-react";

export default function ViewHelpModal({ open, onClose, ticket }) {
    if (!open || !ticket) return null;

    const isResolved = !!ticket.resolved_at;
    const clientImages = Array.isArray(ticket.images) ? ticket.images : [];
    const replyImages = Array.isArray(ticket.reply_images) ? ticket.reply_images : [];

    const renderImageGrid = (images, label) => {
        if (!images.length) return null;

        const isSingle = images.length === 1;

        const gridClass = isSingle
            ? "grid-cols-1"
            : images.length === 2
                ? "grid-cols-2"
                : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4";

        return (
            <div className="border-t border-slate-200 bg-white/70 p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
                        {label}
                    </span>
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                        {images.length}
                    </span>
                </div>

                <div className={`grid gap-2 sm:gap-3 ${gridClass}`}>
                    {images.map((image, index) => (
                        <a
                            key={`${image}-${index}`}
                            href={image}
                            target="_blank"
                            rel="noreferrer"
                            className={`group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 transition hover:ring-2 hover:ring-indigo-500/40 ${isSingle
                                    ? "h-48 sm:h-64 md:h-72"
                                    : "aspect-square"
                                }`}
                        >
                            <img
                                src={image}
                                alt={`Adjunto ${index + 1}`}
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/35 opacity-0 transition-opacity group-hover:opacity-100">
                                <Search className="h-5 w-5 text-white" />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm">
            <div className="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4">
                <div className="flex h-[100dvh] w-full flex-col overflow-hidden rounded-none bg-white shadow-2xl sm:h-auto sm:max-h-[92vh] sm:max-w-3xl sm:rounded-3xl">
                    {/* Header */}
                    <div className="flex flex-shrink-0 items-start justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
                        <div className="min-w-0 flex-1">
                            <p className="mb-1 text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
                                Detalle del ticket
                            </p>
                            <h2 className="break-words text-xl font-bold leading-tight text-slate-900 sm:text-2xl">
                                {ticket.subject || "Detalle del ticket"}
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="shrink-0 rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                            aria-label="Cerrar modal"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
                        <div className="space-y-4 sm:space-y-5">
                            {/* Estado / fechas */}
                            <div className="grid grid-cols-1 gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2 sm:gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold uppercase text-slate-400">
                                        Creado
                                    </p>
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <CalendarDays className="h-5 w-5 text-indigo-500" />
                                        <span className="text-lg font-semibold break-words">
                                            {ticket.uploaded_at || "--/--/--"}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-1 border-t border-slate-200 pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                                    <p className="text-sm font-bold uppercase text-slate-400">
                                        Resolución
                                    </p>
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <CheckCircle2
                                            className={`h-5 w-5 ${isResolved ? "text-emerald-500" : "text-slate-300"
                                                }`}
                                        />
                                        <span className="text-lg font-semibold break-words">
                                            {ticket.resolved_at || "Pendiente"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Mensaje del cliente */}
                            <section className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-slate-500" />
                                    <p className="text-base font-bold tracking-wide text-slate-900 sm:text-lg">
                                        {ticket.client_name ? `${ticket.client_name}` : "Mensaje del cliente"}
                                    </p>
                                </div>

                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                                    <div className="min-h-[96px] whitespace-pre-wrap break-words px-4 py-4 text-base leading-relaxed text-slate-700 sm:px-5">
                                        {ticket.description || "Sin descripción"}
                                    </div>

                                    {renderImageGrid(clientImages.slice(0, 5), "Imagenes")}
                                </div>
                            </section>

                            {/* Resolución */}
                            {isResolved && (
                                <section className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5 text-slate-500" />
                                        <p className="text-base font-bold tracking-wide text-slate-900 sm:text-lg">
                                            Resolución
                                        </p>
                                    </div>

                                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                                        <div className="min-h-[96px] whitespace-pre-wrap break-words px-4 py-4 text-base leading-relaxed text-slate-800 sm:px-5">
                                            {ticket.reply || "Sin resolución"}
                                        </div>

                                        {renderImageGrid(replyImages, "Imagenes")}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex-shrink-0 border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-12 w-full rounded-2xl bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800 sm:h-13 sm:text-base"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}