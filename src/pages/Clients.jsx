import { useMemo, useEffect, useState } from "react";
import { Search, UserPlus } from "lucide-react";

import UserDesktop from "../components/clients/UserDesktop";
import UserMobile from "../components/clients/UserMobile";

import UserDesktopSkeleton from "../components/clients/UserDesktopSkeleton";
import UserMobileSkeleton from "../components/clients/UserMobileSkeleton";

import ActionStatusModal from "../components/ActionStatusModal";
import NewClientModal from "../components/clients/NewClientModal";
import ViewClientModal from "../components/clients/ViewClientModal";

import useGetClient from "../components/hooks/users/Clients/useGetClient";
import useGetClients from "../components/hooks/users/Clients/useGetClients";
import useCreateClient from "../components/hooks/users/Clients/useCreateClient"
import useDeleteClient from "../components/hooks/users/Clients/useDeleteClient"

export default function Clients() {
    const [openNewClientModal, setOpenNewClientModal] = useState(false);
    const [openViewClientModal, setOpenViewClientModal] = useState(false);

    const [selectedClient, setSelectedClient] = useState(null);
    const [search, setSearch] = useState("");
    const [statusModal, setStatusModal] = useState({ open: false, status: "loading", message: "Cargando" });

    const { client, isClientLoading, clientError } = useGetClient(selectedClient?.user_id);
    const { clients, isClientsLoading, clientsError } = useGetClients();
    const { createClient, isCreatingClient, createClientError } = useCreateClient();
    const { deleteClient, isDeletingClient, deleteClientError } = useDeleteClient();


    const handleViewClient = (client) => {
        setSelectedClient(client);
        setOpenViewClientModal(true);
    };

    const handleCloseViewClientModal = () => {
        setOpenViewClientModal(false);
        setSelectedClient(null);
    };

    const handleDeleteClient = async (client) => {
        const confirmed = window.confirm(
            `¿Seguro que deseas eliminar a ${client.name}?`
        );

        if (!confirmed) return;

        setStatusModal({
            open: true,
            status: "loading",
            message: "Eliminando cliente",
        });

        try {
            await deleteClient(client.user_id);
            setStatusModal({
                open: true,
                status: "success",
                message: "Cliente eliminado exitosamente",
            });
        } catch (err) {
            console.error("Error al eliminar usuario:", err);
            setStatusModal({
                open: true,
                status: "error",
                message: "Usuario tiene contratos activos",
            });
        }
    };

    const handleAddClient = () => {
        setOpenNewClientModal(true);
    };

    const handleCloseNewClientModal = () => {
        setOpenNewClientModal(false);
    };

    const handleSaveClient = async (data) => {
        setStatusModal({
            open: true,
            status: "loading",
            message: "Creando cliente",
        });

        try {
            const response = await createClient(data);
            setOpenNewClientModal(false);
            setStatusModal({
                open: true,
                status: "success",
                message: "Cliente creado exitosamente",
            });
        } catch (err) {
            console.error("Error al crear cliente:", err);
            setStatusModal({
                open: true,
                status: "error",
                message: "Fallo al crear cliente",
            });
        }
    };

    const filteredUsers = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return clients ?? [];

        return (clients ?? []).filter((user) => {
            const values = [
                user?.rut,
                user?.name,
                user?.role,
                user?.company_name,
                user?.company_rut,
            ];

            return values.some((value) =>
                String(value ?? "").toLowerCase().includes(term)
            );
        });
    }, [clients, search]);

    if (clientsError) return <p>Hubo un error al cargar los clientes.</p>;

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
                            placeholder="Buscar cliente"
                            className="h-14 w-full rounded-full border border-transparent bg-white pl-14 pr-5 text-lg font-medium text-slate-600 shadow-[0_8px_24px_rgba(15,23,42,0.08)] outline-none transition placeholder:text-slate-400 focus:border-[#4bae52]"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleAddClient}
                        className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#1F1F1F] px-6 text-lg font-semibold text-white transition hover:opacity-95 lg:w-auto lg:min-w-[280px]"
                    >
                        <UserPlus size={24} />
                        Agregar Cliente
                    </button>
                </div>

                {isClientsLoading ? (
                    <>
                        <UserMobileSkeleton cards={3} />
                        <UserDesktopSkeleton rows={5} />
                    </>
                ) : (
                    <>
                        <UserMobile
                            users={filteredUsers}
                            onView={handleViewClient}
                            onDelete={handleDeleteClient}
                        />

                        <UserDesktop
                            users={filteredUsers}
                            onView={handleViewClient}
                            onDelete={handleDeleteClient}
                        />
                    </>
                )}
            </section>

            <NewClientModal
                open={openNewClientModal}
                onClose={handleCloseNewClientModal}
                onSave={handleSaveClient}
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

            <ViewClientModal
                open={openViewClientModal}
                user={client}
                loading={isClientLoading}
                error={clientError}
                onClose={handleCloseViewClientModal}
            />
        </>
    );
}