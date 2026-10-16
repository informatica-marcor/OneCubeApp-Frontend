import {
    Search,
    X,
    ShieldCheck,
    Warehouse,
    Car,
    AlertTriangle,
    KeyRound,
    PackageCheck,
    Info,
} from "lucide-react";
import { useMemo, useState } from "react";

const regulations = [
    {
        title: "Ingreso de personal autorizado",
        description:
            "Todo personal que ingrese al recinto debe estar debidamente autorizado por el arrendatario. Este debe informar a ONE CUBE el nombre y R.U.N. de las personas autorizadas, según lo indicado en el contrato.",
        type: "access",
    },
    {
        title: "Cuidado de dependencias",
        description:
            "Se deben cuidar las dependencias generales de ONE CUBE y mantenerlas en buen estado.",
        type: "general",
    },
    {
        title: "Prohibido rayar las dependencias",
        description:
            "No está permitido rayar muros, puertas, señaléticas, bodegas u otras áreas del recinto.",
        type: "prohibition",
    },
    {
        title: "Prohibido pegar material publicitario",
        description:
            "No se permite pegar logos, pancartas, gigantografías, folletos u otro tipo de material al exterior de cada bodega ni en las dependencias.",
        type: "prohibition",
    },
    {
        title: "Cuidado de señaléticas",
        description:
            "No está permitido sacar, cambiar de lugar ni hurtar señaléticas del recinto.",
        type: "prohibition",
    },
    {
        title: "Uso de carros dentro del recinto",
        description:
            "Los carros facilitados por ONE CUBE son de uso exclusivo dentro de las dependencias y no pueden ser retirados provisoria ni permanentemente.",
        type: "equipment",
    },
    {
        title: "Devolución de carros",
        description:
            "Después de utilizar los carros, deben ser devueltos al espacio debidamente demarcado.",
        type: "equipment",
    },
    {
        title: "Sentido del tránsito",
        description:
            "Se debe respetar y seguir el sentido del tránsito debidamente señalizado dentro de las dependencias.",
        type: "traffic",
    },
    {
        title: "No bloquear el tránsito",
        description:
            "No se debe entorpecer el paso de otros vehículos que quieran ingresar o movilizarse dentro de las dependencias de ONE CUBE.",
        type: "traffic",
    },
    {
        title: "Uso personal del candado",
        description:
            "El candado de la bodega es de uso personal. La multa por pérdida se encuentra estipulada en el contrato.",
        type: "warehouse",
    },
    {
        title: "Uso de extintores",
        description:
            "No está permitido sacar extintores, salvo que sea necesario utilizarlos ante una emergencia.",
        type: "security",
    },
    {
        title: "Registro de patentes autorizadas",
        description:
            "La apertura de barreras es automática, por lo que se deben registrar correctamente en ONE CUBE las patentes autorizadas.",
        type: "access",
    },
    {
        title: "Apagado de luces",
        description:
            "Recuerde apagar las luces que se encuentran al interior de su bodega.",
        type: "warehouse",
    },
    {
        title: "Cierre de bodega",
        description:
            "Cerrar correctamente la bodega es responsabilidad del arrendatario.",
        type: "warehouse",
    },
    {
        title: "Ingreso fuera de horario",
        description:
            "Recuerde notificar el ingreso de personal fuera del horario de atención, según lo estipulado en el contrato.",
        type: "access",
    },
];

const regulationTypeConfig = {
    access: {
        label: "Acceso",
        icon: ShieldCheck,
        className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
    general: {
        label: "General",
        icon: Info,
        className: "bg-slate-100 text-slate-700 ring-slate-200",
    },
    prohibition: {
        label: "Prohibición",
        icon: AlertTriangle,
        className: "bg-red-50 text-red-700 ring-red-200",
    },
    equipment: {
        label: "Equipamiento",
        icon: PackageCheck,
        className: "bg-blue-50 text-blue-700 ring-blue-200",
    },
    traffic: {
        label: "Tránsito",
        icon: Car,
        className: "bg-amber-50 text-amber-700 ring-amber-200",
    },
    warehouse: {
        label: "Bodega",
        icon: Warehouse,
        className: "bg-violet-50 text-violet-700 ring-violet-200",
    },
    security: {
        label: "Seguridad",
        icon: KeyRound,
        className: "bg-orange-50 text-orange-700 ring-orange-200",
    },
};

export default function Regulation() {
    const [items, setItems] = useState(regulations);
    const [search, setSearch] = useState("");
    const [selectedRegulation, setSelectedRegulation] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "general",
    });

    const filteredRegulations = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return items;

        return items.filter((regulation) => {
            const values = [
                regulation.title,
                regulation.description,
                regulation.type,
                regulationTypeConfig[regulation.type]?.label,
            ];

            return values.some((value) =>
                String(value ?? "").toLowerCase().includes(term)
            );
        });
    }, [items, search]);

    const closeModal = () => {
        setSelectedRegulation(null);
    };

    return (
        <section className="space-y-6">

            {/* NUEVO CONTENEDOR DE DISEÑO ESTILO CORREOS */}
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wide text-emerald-600">
                            Reglamento
                        </p>

                        <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">
                            NORMAS DE USO INTERNO
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            Para garantizar la seguridad y correcto funcionamiento de nuestras instalaciones, todo cliente deberá cumplir las siguientes normas.
                        </p>
                    </div>
                </div>

                {/* BARRA DE BÚSQUEDA DENTRO DE LA CAJA */}
                <div className="mt-5">
                    <div className="relative">
                        <Search
                            size={20}
                            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar Visitante..."
                            className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-5 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                        />
                    </div>
                </div>
            </div>

            {filteredRegulations.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
                    <p className="text-base font-bold text-slate-800">
                        No se encontraron normas
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                        Intenta buscar con otro término.
                    </p>
                </div>
            ) : (
                 <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredRegulations.map((regulation) => {
                        const config =
                            regulationTypeConfig[regulation.type] ??
                            regulationTypeConfig.general;

                        const Icon = config.icon;

                        return (
                            <article
                                key={`${regulation.type}-${regulation.title}`}
                                onClick={() => setSelectedRegulation(regulation)}
                                className="group relative min-h-[190px] cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 opacity-0 transition group-hover:opacity-100" />

                                <div className="mb-5 flex items-start justify-between gap-3">
                                    <div
                                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ring-1 ${config.className}`}
                                    >
                                        <Icon size={15} />
                                        {config.label}
                                    </div>

                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 transition group-hover:bg-emerald-50 group-hover:text-emerald-700">
                                        Ver más
                                    </span>
                                </div>

                                <h3 className="text-xl font-black font-[Roboto] leading-snug text-slate-900">
                                    {regulation.title}
                                </h3>

                                <p className="line-clamp-3 font-['Roboto'] leading-6 text-slate-500 transition sm:opacity-0 sm:translate-y-2 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                                    {regulation.description}
                                </p>

                                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent sm:block" />
                            </article>
                        );
                    })}
                </div>
            )}

            {selectedRegulation && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:items-center"
                    onClick={closeModal}
                >
                    <div
                        className="w-full max-w-xl overflow-hidden rounded-t-[30px] bg-white shadow-2xl sm:rounded-[30px]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
                            <div className="space-y-3">
                                {(() => {
                                    const config =
                                        regulationTypeConfig[selectedRegulation.type] ??
                                        regulationTypeConfig.general;

                                    const Icon = config.icon;

                                    return (
                                        <div
                                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ring-1 ${config.className}`}
                                        >
                                            <Icon size={15} />
                                            {config.label}
                                        </div>
                                    );
                                })()}

                                <h3 className="text-3xl font-black font-[Roboto] leading-tight text-slate-900">
                                    {selectedRegulation.title}
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                                aria-label="Cerrar modal"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-5 sm:p-6">
                            <p className="text-lg font-[Roboto] leading-8 text-slate-600">
                                {selectedRegulation.description}
                            </p>
                        </div>

                        <div className="border-t border-slate-100 bg-slate-50 p-4 sm:p-5">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="h-12 w-full rounded-2xl bg-slate-950 px-5 text-xl font-[Roboto] font-bold text-white shadow-sm transition hover:bg-slate-800"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isCreateModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:items-center"
                    onClick={() => setIsCreateModalOpen(false)}
                >
                    <form
                        className="w-full max-w-xl overflow-hidden rounded-t-[30px] bg-white shadow-2xl sm:rounded-[30px]"
                        onClick={(event) => event.stopPropagation()}
                        onSubmit={(event) => {
                            event.preventDefault();

                            const title = formData.title.trim();
                            const description = formData.description.trim();

                            if (!title || !description) return;

                            setItems((prev) => [
                                {
                                    title,
                                    description,
                                    type: formData.type,
                                },
                                ...prev,
                            ]);

                            setFormData({
                                title: "",
                                description: "",
                                type: "general",
                            });

                            setIsCreateModalOpen(false);
                        }}
                    >
                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                                    Nuevo
                                </p>

                                <h3 className="mt-1 text-2xl font-black text-slate-950">
                                    Agregar reglamento
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                                aria-label="Cerrar modal"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4 p-5 sm:p-6">
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Título
                                </label>

                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(event) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            title: event.target.value,
                                        }))
                                    }
                                    placeholder="Ej: Uso de estacionamientos"
                                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Categoría
                                </label>

                                <select
                                    value={formData.type}
                                    onChange={(event) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            type: event.target.value,
                                        }))
                                    }
                                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                >
                                    {Object.entries(regulationTypeConfig).map(([value, config]) => (
                                        <option key={value} value={value}>
                                            {config.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Descripción
                                </label>

                                <textarea
                                    value={formData.description}
                                    onChange={(event) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            description: event.target.value,
                                        }))
                                    }
                                    placeholder="Describe claramente la norma o indicación..."
                                    rows={5}
                                    className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 p-4 sm:flex-row sm:justify-end sm:p-5">
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="h-12 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={!formData.title.trim() || !formData.description.trim()}
                                className="h-12 rounded-2xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                Guardar reglamento
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
}