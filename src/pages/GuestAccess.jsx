import React, { useEffect, useState, useMemo } from "react";
import { Search, UserPlus } from "lucide-react";
import GuestAccessDesktop from "../components/guest-access/GuestAccessDesktop";
import GuestAccessMobile from "../components/guest-access/GuestAccessMobile";
import GuestAccessDesktopSkeleton from "../components/guest-access/GuestAccessDesktopSkeleton";
import GuestAccessMobileSkeleton from "../components/guest-access/GuestAccessMobileSkeleton";
import NewGuestModal from "../components/guest-access/NewGuestModal";
import RenewGuestModal from "../components/guest-access/RenewGuestModal";
import ActionStatusModal from "../components/ActionStatusModal";

import { useAuth } from "../components/context/AuthContext";
import useGetVisits from "../components/hooks/users/Visits/useGetVisits";
import useCreateVisit from "../components/hooks/users/Visits/useCreateVisit";
import useRenewVisit from "../components/hooks/users/Visits/useRenewVisit";
import useEndVisit from "../components/hooks/users/Visits/useEndVisit";
import useDeleteVisit from "../components/hooks/users/Visits/useDeleteVisit";

export default function GuestAccess() {
  const { userId } = useAuth();
  const { visits, isVisitsLoading, visitsError } = useGetVisits(userId);

  const { createVisit } = useCreateVisit();
  const { renewVisit } = useRenewVisit();
  const { endVisit } = useEndVisit();
  const { deleteVisit } = useDeleteVisit();
  const [statusModal, setStatusModal] = useState({ open: false, status: "loading", message: "Cargando" });
  const [search, setSearch] = useState("");

  // Estados para la renovación
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);

  const handleAddGuest = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleSaveGuest = async (guestData) => {
    setIsCreateModalOpen(false);
    setStatusModal({
      open: true,
      status: "loading",
      message: "Creando visita",
    });

    try {
      const response = await createVisit(guestData);

      setIsCreateModalOpen(false);
      setStatusModal({
        open: true,
        status: "success",
        message: "Visita creada exitosamente",
      });
    } catch (err) {
      if (err.response.status === 400) {
        setStatusModal({
          open: true,
          status: "error",
          message: "Se ha alcanzado el máximo de permisos simultáneos permitidos.",
        });
      } else if (err.response.status === 409) {
        setStatusModal({
          open: true,
          status: "error",
          message: "El usuario ya existe.",
        });
      }
      else {
        setStatusModal({
          open: true,
          status: "error",
          message: "Fallo al crear visitante",
        });
      }
    }
  };

  const handleRenew = (guest) => {
    setSelectedGuest(guest);
    setIsRenewModalOpen(true);
  };

  const handleSaveRenewal = (updatedGuest) => {
    setIsRenewModalOpen(false);
    setStatusModal({
      open: true,
      status: "loading",
      message: "Renovando visita",
    });

    try {
      const response = renewVisit(updatedGuest);
      setStatusModal({
        open: true,
        status: "success",
        message: "Acceso renovado exitosamente",
      });
    } catch (err) {
      console.error("Error al renovar acceso:", err);
      setStatusModal({
        open: true,
        status: "error",
        message: "Fallo al renovar visita",
      });
    }
  };

  const handleEnd = async (guest) => {
    setStatusModal({
      open: true,
      status: "loading",
      message: "Finalizando visita",
    });

    try {
      const response = await endVisit(guest.lease_id);
      setStatusModal({
        open: true,
        status: "success",
        message: "Acceso finalizado exitosamente",
      });
    } catch (err) {
      console.error("Error al finalizar acceso:", err);
      setStatusModal({
        open: true,
        status: "error",
        message: "Fallo al finalizar visita",
      });
    }
  };

  const handleDelete = async (guest) => {
    setStatusModal({
      open: true,
      status: "loading",
      message: "Eliminando visita",
    });
    try {
      const response = await deleteVisit(guest.id);
      setStatusModal({
        open: true,
        status: "success",
        message: "Visita eliminada exitosamente",
      });
    } catch (err) {
      console.error("Error al eliminar visita:", err);
      setStatusModal({
        open: true,
        status: "error",
        message: "Fallo al eliminar visita",
      })
    }
  };

  const filteredVisits = useMemo(() => {
    const term = search.trim().toLowerCase();
    const actualList = visits?.visits ?? [];

    if (!term) return actualList;

    return actualList.filter((visit) => {
      const values = [
        visit?.rut,
        visit?.name,
      ];

      return values.some((value) =>
        String(value ?? "").toLowerCase().includes(term)
      );
    });
  }, [visits, search]);

  return (
    <>
      <section className="space-y-5">

        {/* NUEVO CONTENEDOR DE DISEÑO ESTILO CORREOS */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-emerald-600">
                Adminitracción de Permisos
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">
                Acceso de Visitas
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Podras gestionar quién y cúando puede entrar al recinto de bodegas One Cube. Tu personal autorizado, podrá
                pasar por los accesos biométricos.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddGuest}
              className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 lg:w-auto"
            >
              <UserPlus size={20} />
              Agregar Visita
            </button>
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

        {/* LISTADO DE VISITANTES */}
        {isVisitsLoading ? (
          <>
            <GuestAccessDesktopSkeleton />
            <GuestAccessMobileSkeleton />
          </>
        ) : (
          <>
            <GuestAccessDesktop
              visitors={filteredVisits}
              onRenew={handleRenew}
              onEnd={handleEnd}
              onDelete={handleDelete}
            />

            <GuestAccessMobile
              guests={filteredVisits}
              onRenew={handleRenew}
              onEnd={handleEnd}
              onDelete={handleDelete}
            />
          </>
        )}
      </section>

      <NewGuestModal
        open={isCreateModalOpen}
        maxDate={visits?.limit}
        onClose={handleCloseModal}
        onSave={handleSaveGuest}
      />

      <RenewGuestModal
        open={isRenewModalOpen}
        maxDate={visits?.limit}
        guest={selectedGuest}
        onClose={() => setIsRenewModalOpen(false)}
        onSave={handleSaveRenewal}
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