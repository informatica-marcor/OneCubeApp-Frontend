import React, { useEffect, useState, useMemo } from "react";
import { Search, UserPlus } from "lucide-react";

import WarehouseDesktop from "../components/warehouse/WarehouseDesktop";
import WarehouseMobile from "../components/warehouse/WarehouseMobile";
import WarehouseDesktopSkeleton from "../components/warehouse/WarehouseDesktopSkeleton";
import WarehouseMobileSkeleton from "../components/warehouse/WarehouseMobileSkeleton";

import { useWarehouses } from "../components/hooks/useWarehouses";
import ActionStatusModal from "../components/ActionStatusModal";

import useCreateLease from "../components/hooks/leases/useCreateLease";
import useEndLease from "../components/hooks/leases/useEndLease";

import useGetClients from "../components/hooks/users/Clients/useGetClients";
import NewLeaseModal from "../components/warehouse/NewLeaseModal";

export default function Warehouses() {
    const [openNewLeaseModal, setOpenNewLeaseModal] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);

    const [search, setSearch] = useState("");
    const [statusModal, setStatusModal] = useState({ open: false, status: "loading", message: "Cargando" });

    const { warehouses, loading, error } = useWarehouses();
    const { clients, isClientsLoading, clientsError, refreshClients } = useGetClients();
    const { createLease, isCreatingLease, createLeaseError } = useCreateLease();
    const { endLease, isEndingLease, endLeaseError } = useEndLease();

    const handleEndLease = async (warehouse) => {
        if (window.confirm(`¿Estás seguro de terminar el contrato de ${warehouse.name}?`)) {
            setStatusModal({
                open: true,
                status: "loading",
                message: "Terminando contrato...",
            });

            try {
                await endLease(warehouse.lease_id);
                setStatusModal({
                    open: true,
                    status: "success",
                    message: "Contrato finalizado",
                })
            } catch (error) {
                console.error("Error al finalizar:", error);
                setStatusModal({
                    open: true,
                    status: "error",
                    message: "Error al Finalizar contrato",
                });
            }
        }
    };

    const handleNewLease = (warehouse) => {
        setSelectedWarehouse(warehouse);
        setOpenNewLeaseModal(true);
    };

    // const handleAddWarehouse = () => {
    //     console.log("Nuevo almacen");
    // };

    const handleSaveLease = async (data) => {
        setOpenNewLeaseModal(false);
        setStatusModal({
            open: true,
            status: "loading",
            message: "Creando contrato...",
        });
        try {
            await createLease({
                warehouse_id: selectedWarehouse.id,
                ...data,
            });
            setSelectedWarehouse(null);
            setStatusModal({
                open: true,
                status: "success",
                message: "Contrato creado con éxito",
            })
        } catch (error) {
            console.error("Error al crear contrato:", error);
            setStatusModal({
                open: true,
                status: "error",
                message: "Error al crear contrato",
            });
        }
    };

    const filteredWarehouses = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return warehouses ?? [];

        return (warehouses ?? []).filter((warehouse) => {
            const values = [
                warehouse?.name,
                warehouse?.tenant,
            ];

            return values.some((value) =>
                String(value ?? "").toLowerCase().includes(term)
            );
        });
    }, [warehouses, search]);

    if (error) return <p>Hubo un error al cargar los almacenes.</p>;

    return (
        <>
            <section className="space-y-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative w-full">
                        <Search
                            size={20}
                            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#3A3A3A]"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar bodega"
                            className="h-14 w-full rounded-full border border-transparent bg-white pl-14 pr-5 text-lg font-medium text-slate-600 shadow-[0_8px_24px_rgba(15,23,42,0.08)] outline-none transition placeholder:text-slate-400 focus:border-[#4bae52]"
                        />
                    </div>

                    {/* <button
                        type="button"
                        onClick={handleAddWarehouse}
                        className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#1F1F1F] px-6 text-lg font-semibold text-white transition hover:opacity-95 lg:w-auto lg:min-w-[280px]"
                    >
                        <UserPlus size={24} />
                        Agregar Bodega
                    </button> */}
                </div>

                {isClientsLoading ? (
                    <>
                        <WarehouseMobileSkeleton cards={3} />
                        <WarehouseDesktopSkeleton rows={5} />
                    </>
                ) : (
                    <>
                        <WarehouseMobile
                            warehouses={filteredWarehouses}
                            onEndLease={handleEndLease}
                            onNewLease={handleNewLease}
                        />
                        <WarehouseDesktop
                            warehouses={filteredWarehouses}
                            onEndLease={handleEndLease}
                            onNewLease={handleNewLease}
                        />
                    </>
                )}
            </section>

            <NewLeaseModal
                open={openNewLeaseModal}
                warehouse={selectedWarehouse}
                clients={clients}
                loading={isClientsLoading}
                error={clientsError}
                onClose={() => setOpenNewLeaseModal(false)}
                onSave={handleSaveLease}
                isSaving={isCreatingLease}
            />

            <ActionStatusModal
                open={statusModal.open}
                status={statusModal.status}
                message={statusModal.message}
                onClose={() =>
                    setStatusModal((prev) => ({
                        ...prev,
                        open: false,
                    }))
                }
            />
        </>

    );

}