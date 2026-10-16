import React from "react";
import { User } from "lucide-react";

const eventColors = {
    'acceso permitido': 'text-emerald-500',
    'permiso expirado': 'text-amber-600',
    'verificación fallida': 'text-red-600',
    'default': 'text-slate-900'
};

export default function MonitorMobile({ events }) {

    return (
        <div className="space-y-4 lg:hidden">
            {events.length === 0 ? (
                <div className="py-6 text-center text-lg font-bold text-slate-600">
                    No hay eventos disponibles.
                </div>
            ) : (

            events.length === 0 ? (
                <div className="rounded-[22px] bg-white px-5 py-8 text-center text-sm text-slate-500 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                    No hay eventos disponibles.
                </div>
            ) : (
                events.map((event, index) => (
                    <article
                        key={event.id ?? index}
                        className="rounded-[22px] bg-white p-6 space-y-2 shadow-lg"
                    >
                        {/* Dispositivo */}
                        <div className="grid grid-cols-2 gap-4">
                            <p className="text-lg font-semibold text-slate-900">
                                {event.device_name}
                            </p>

                            <p className={`text-lg text-right font-bold uppercase ${eventColors[event.event_type?.toLowerCase()] || eventColors.default}`}>
                                {event.event_type}
                            </p>

                        </div>

                        <div className="grid grid-cols-2 gap-4">

                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <p className="text-lg font-semibold text-slate-900">
                                    {event.user_name || "-"}
                                </p>
                            </div>

                            <p className="text-lg text-right font-semibold text-slate-900">
                                {event.created_at || "--/--/---- --:--"}
                            </p>
                        </div>

                    </article>
                ))
            ))}
        </div>
    );
}