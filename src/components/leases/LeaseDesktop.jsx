import { User, LogOut, CalendarPlus } from "lucide-react";


export default function LeasesDesktop({ leases }) {
    return (
        <div className="hidden lg:block space-y-5">
            {leases.length === 0 ? (
                <p className="px-6 py-6 text-center text-xl font-semibold text-slate-500">
                    No tiene bodegas contratadas.
                </p>
            ) : (
            leases.map((lease) => (
                <article
                    key={lease.lease_id}
                    className="grid items-center gap-6 rounded-3xl border border-slate-100 bg-white px-8 py-6 shadow-sm"
                    style={{
                        gridTemplateColumns: "1.5fr 1fr 1fr 1.5fr 1.5fr",
                    }}
                >
                    {/* Nombre warehouse */}
                    <div className="min-w-0">
                        <h3 className="uppercase text-xl font-bold text-slate-900">
                            {lease.warehouse.name}
                        </h3>
                    </div>

                    {/* Tipo */}
                    <div>
                        <p className="mb-1 font-bold uppercase text-slate-400">
                            Tipo
                        </p>
                        <p className="text-lg font-medium text-slate-900">
                            {lease.isolated ? "Aislado" : "Estándar"}
                        </p>
                    </div>

                    {/* Tamaño */}
                    <div>
                        <p className="mb-1 font-bold uppercase text-slate-400">
                            Tamaño
                        </p>
                        <p className="text-lg font-medium text-slate-900">
                            {lease.warehouse.size_m2} m²
                        </p>
                    </div>

                    {/* Fechas */}
                    <div>
                        <p className="mb-1 font-bold uppercase text-slate-400">
                            Inicio
                        </p>
                        <p className="text-lg font-medium text-slate-900">
                            {lease.start_date}
                        </p>
                    </div>

                    <div>
                        <p className="mb-1 font-bold uppercase text-slate-400">
                            Término
                        </p>
                        <p className="text-lg font-medium text-red-600">
                            {lease.end_date}
                        </p>
                    </div>
                </article>
            )))}
        </div>
    );
}