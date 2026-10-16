import { User, LogOut, CalendarPlus } from "lucide-react";

const eventColors = {
  'acceso permitido': 'text-emerald-500',
  'permiso expirado': 'text-amber-600',
  'verificación fallida': 'text-red-600',
  'default': 'text-slate-900'
};

export default function MonitorDesktop({ events }) {
    return (
        <div className="hidden lg:block space-y-5">
            
            {events.length === 0 ? (
                <div className="py-6 text-center text-lg font-bold text-slate-600">
                    No hay eventos disponibles.
                </div>
            ) : (

            events.map((event) => (
                <article
                    key={event.id}
                    className="grid items-center gap-6 rounded-[22px] border border-slate-100 bg-white px-8 py-6 shadow-sm"
                    style={{
                        gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    }}
                >
                    {/* Usuario */}
                    <div>
                        <p className="mb-1 text-xs font-bold uppercase text-slate-400">
                            Dispositivo
                        </p>
                        <p className="text-lg font-semibold text-slate-900">
                            {event.device_name ? event.device_name : "-"}
                        </p>
                    </div>

                    {/* Usuario */}
                    <div>
                        <p className="mb-1 text-xs font-bold uppercase text-slate-400">
                            Usuario
                        </p>
                        <p className="text-lg font-semibold text-slate-900">
                            {event.user_name ? event.user_name : "-"}
                        </p>
                    </div>

                    {/* TIPO DE EVENTO */}
                    <div>
                        <p className="mb-1 text-xs font-bold uppercase text-slate-400">
                            Evento
                        </p>
                        <p className={`text-lg font-bold uppercase ${eventColors[event.event_type?.toLowerCase()] || eventColors.default}`}>
                            {event.event_type}
                        </p>
                    </div>

                    {/* Fechas */}
                    <div>
                        <p className="mb-1 text-xs font-bold uppercase text-slate-400">
                            Fecha
                        </p>
                        <p className="text-lg font-semibold text-slate-900">
                            {event.created_at}
                        </p>
                    </div>
                </article>
            )))}
        </div>
    );
}