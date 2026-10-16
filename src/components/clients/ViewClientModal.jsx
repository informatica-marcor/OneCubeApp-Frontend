import UserPhoto from "./UserPhoto";
import { X, FileText, Mail, Users, Building2, CreditCard, User as UserIcon } from "lucide-react";

function InfoCard({ label, value, icon: Icon }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="mb-2 flex items-center gap-2">
                {Icon ? <Icon className="h-4 w-4 text-slate-400" /> : null}
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                    {label}
                </span>
            </div>
            <div className="break-words text-sm font-semibold text-slate-700 sm:text-base">
                {value || "No disponible"}
            </div>
        </div>
    );
}

function SectionHeader({ icon: Icon, title, subtitle }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                <Icon className="h-5 w-5 text-slate-700" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-800 sm:text-xl">{title}</h3>
            </div>
        </div>
    );
}

function EmptyState({ message }) {
    return (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-500 sm:text-base">
            {message}
        </div>
    );
}

export default function ViewClientModal({ open, user, loading, error, onClose }) {
    if (!open) return null;

    const userInfo = user?.user;
    const leases = user?.leases ?? [];
    const temporaryUsers = user?.temporary_users ?? [];
    const showCompanyInfo = Boolean(userInfo?.company_rut);

    return (
        <div className="fixed inset-0 z-[80] bg-black/55 p-0 sm:p-4">
            <div className="flex min-h-dvh items-end justify-center sm:min-h-full sm:items-center">
                <div className="flex h-[100dvh] w-full flex-col overflow-hidden rounded-none bg-white shadow-none sm:h-auto sm:max-h-[92vh] sm:max-w-5xl sm:rounded-[28px] sm:shadow-[0_24px_64px_rgba(15,23,42,0.24)]">
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6 lg:px-8">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                                Detalle del cliente
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Información general, arriendos y visitas asociadas.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                            aria-label="Cerrar modal"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6 lg:px-8">
                        {loading ? (
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-base text-slate-500">
                                Cargando información del cliente...
                            </div>
                        ) : error ? (
                            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-8 text-base text-red-600">
                                Error al cargar la información del cliente.
                            </div>
                        ) : !userInfo ? (
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-base text-slate-500">
                                No hay información disponible.
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
                                        <div className="order-2 lg:order-1">
                                            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <InfoCard
                                                    label="Rut"
                                                    value={userInfo.rut}
                                                    icon={CreditCard}
                                                />

                                                <InfoCard
                                                    label="Nombre"
                                                    value={userInfo.name}
                                                    icon={UserIcon}
                                                />

                                                <InfoCard
                                                    label="Empresa"
                                                    value={userInfo.company_rut && userInfo.company_name
                                                        ? `${userInfo.company_name} ${userInfo.company_rut}`
                                                        : "-"}
                                                    icon={Building2}
                                                />
                                                <InfoCard
                                                    label="Email"
                                                    value={userInfo.email || "-"}
                                                    icon={Mail}
                                                />
                                            </div>
                                        </div>

                                        <div className="order-1 flex items-start justify-center lg:order-2 lg:justify-end">
                                            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50 shadow-sm">
                                                {userInfo.image ? (
                                                    <img
                                                        src={userInfo.image}
                                                        alt={userInfo.name || "Cliente"}
                                                        className="h-48 w-48 object-cover sm:h-56 sm:w-56"
                                                    />
                                                ) : (
                                                    <div className="flex h-48 w-48 items-center justify-center sm:h-56 sm:w-56">
                                                        <UserPhoto
                                                            userId={userInfo.user_id}
                                                            alt={userInfo.name || "Cliente"}
                                                            className="h-24 w-24"
                                                            iconClassName="h-10 w-10"
                                                            roundedClassName="rounded-full"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <SectionHeader
                                        icon={FileText}
                                        title="Arriendos"
                                        subtitle="Contratos asociados al cliente"
                                    />

                                    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                                        <div className="max-h-[320px] overflow-y-auto">
                                            <div className="hidden md:block overflow-x-auto">
                                                <table className="w-full border-separate border-spacing-0">
                                                    <thead className="sticky top-0 z-10 bg-slate-50">
                                                        <tr className="bg-slate-50 text-left">
                                                            <th className="px-6 py-4 text-sm uppercase font-semibold text-slate-400">
                                                                Bodega
                                                            </th>
                                                            <th className="px-6 py-4 text-sm uppercase font-semibold text-slate-400">
                                                                Inicio
                                                            </th>
                                                            <th className="px-6 py-4 text-sm uppercase font-semibold text-slate-400">
                                                                Término
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {leases.length === 0 ? (
                                                            <tr>
                                                                <td
                                                                    colSpan={3}
                                                                    className="px-6 py-8 text-center text-sm font-medium text-slate-500"
                                                                >
                                                                    No hay contratos disponibles.
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            leases.map((contract, index) => (
                                                                <tr
                                                                    key={contract.id}
                                                                    className={index !== leases.length - 1 ? "border-b border-slate-100" : ""}
                                                                >
                                                                    <td className="px-6 py-5 text-sm font-semibold text-slate-700 lg:text-base">
                                                                        {contract.warehouse_name}
                                                                    </td>
                                                                    <td className="px-6 py-5 text-sm text-slate-600 lg:text-base">
                                                                        {contract.start_date}
                                                                    </td>
                                                                    <td className="px-6 py-5 text-sm text-slate-600 lg:text-base">
                                                                        {contract.end_date}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="space-y-3 p-4 md:hidden">
                                                {leases.length === 0 ? (
                                                    <EmptyState message="No hay contratos disponibles." />
                                                ) : (
                                                    leases.map((contract) => (
                                                        <div
                                                            key={contract.id}
                                                            className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                                                        >
                                                            <div className="text-base font-bold text-slate-800">
                                                                {contract.warehouse_name}
                                                            </div>
                                                            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                                                                <div>
                                                                    <p className="text-slate-400">Inicio</p>
                                                                    <p className="font-medium text-slate-700">{contract.start_date}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-slate-400">Término</p>
                                                                    <p className="font-medium text-slate-700">{contract.end_date}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <SectionHeader
                                        icon={Users}
                                        title="Visitas"
                                        subtitle="Usuarios temporales vinculados al cliente"
                                    />

                                    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                                        <div className="max-h-[360px] overflow-y-auto">
                                            <div className="hidden lg:block overflow-x-auto">
                                                <table className="w-full border-separate border-spacing-0">
                                                    <thead className="sticky top-0 z-10 bg-slate-50">
                                                        <tr className="bg-slate-50 text-left">
                                                            <th className="px-6 py-4 text-sm font-semibold text-slate-400">
                                                                Foto
                                                            </th>
                                                            <th className="px-6 py-4 text-sm font-semibold text-slate-400">
                                                                Rut
                                                            </th>
                                                            <th className="px-6 py-4 text-sm font-semibold text-slate-400">
                                                                Nombre
                                                            </th>
                                                            <th className="px-6 py-4 text-sm font-semibold text-slate-400">
                                                                Inicio
                                                            </th>
                                                            <th className="px-6 py-4 text-sm font-semibold text-slate-400">
                                                                Término
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {temporaryUsers.length === 0 ? (
                                                            <tr>
                                                                <td
                                                                    colSpan={5}
                                                                    className="px-6 py-8 text-center text-sm font-medium text-slate-500"
                                                                >
                                                                    No hay visitantes disponibles.
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            temporaryUsers.map((visitor, index) => (
                                                                <tr
                                                                    key={visitor.id}
                                                                    className={index !== temporaryUsers.length - 1 ? "border-b border-slate-100" : ""}
                                                                >
                                                                    <td className="px-6 py-5">
                                                                        <div className="flex items-center justify-center">
                                                                            <img
                                                                                src={visitor.image}
                                                                                alt={visitor.name}
                                                                                className="h-6 w-6 rounded-full object-cover"
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-5 text-sm font-semibold text-slate-700 lg:text-base">
                                                                        {visitor.rut}
                                                                    </td>
                                                                    <td className="px-6 py-5 text-sm font-semibold text-slate-700 lg:text-base">
                                                                        {visitor.name}
                                                                    </td>
                                                                    <td className="px-6 py-5 text-sm text-slate-600 lg:text-base">
                                                                        {visitor.valid_from}
                                                                    </td>
                                                                    <td className="px-6 py-5 text-sm text-slate-600 lg:text-base">
                                                                        {visitor.valid_to}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="space-y-3 p-4 lg:hidden">
                                                {temporaryUsers.length === 0 ? (
                                                    <EmptyState message="No hay visitantes disponibles." />
                                                ) : (
                                                    temporaryUsers.map((visitor) => (
                                                        <div
                                                            key={visitor.id}
                                                            className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    src={visitor.image}
                                                                    alt={visitor.name}
                                                                    className="h-8 w-8 rounded-full object-cover"
                                                                />
                                                                <div className="min-w-0">
                                                                    <p className="truncate text-base font-bold text-slate-800">
                                                                        {visitor.name}
                                                                    </p>
                                                                    <p className="text-sm text-slate-500">{visitor.rut}</p>
                                                                </div>
                                                            </div>

                                                            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                                                <div>
                                                                    <p className="text-slate-400">Inicio</p>
                                                                    <p className="font-medium text-slate-700">{visitor.valid_from}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-slate-400">Término</p>
                                                                    <p className="font-medium text-slate-700">{visitor.valid_to}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>

                    <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-6 lg:px-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-14 w-full rounded-2xl border border-slate-300 bg-slate-900 text-lg font-semibold text-white transition hover:bg-slate-800"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}