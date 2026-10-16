import React, { useState, useEffect, useMemo } from 'react';
import { Search, MailPlus, ChartNoAxesColumnIcon } from "lucide-react";

import ActionStatusModal from "../components/ActionStatusModal";
import NewTicketReplyModal from '../components/tickets/NewTicketReplyModal';
import ViewTicketModal from '../components/tickets/ViewTicketModal';

import TicketsMobileSkeleton from '../components/tickets/TicketsMobileSkeleton';
import TicketsDesktopSkeleton from '../components/tickets/TicketsDesktopSkeleton';
import TicketsMobile from '../components/tickets/TicketsMobile';
import TicketsDesktop from '../components/tickets/TicketsDesktop';

import useGetTickets from '../components/hooks/tickets/useGetTickets';
import useResolveTicket from '../components/hooks/tickets/useResolveTicket';

export default function Tickets() {

  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openViewTicketModal, setOpenViewTicketModal] = useState(false);
  const [openNewTicketReplyModal, setOpenNewTicketReplyModal] = useState(false);

  const [statusModal, setStatusModal] = useState({ open: false, status: "loading", message: "Cargando" });

  const { tickets, isTicketsLoading, ticketsError } = useGetTickets();
  const { resolveTicket } = useResolveTicket(selectedTicket?.ticket_id);

  const handleTicketView = (ticket) => {
    setSelectedTicket(ticket);
    setOpenViewTicketModal(true);
  };

  const handleTicketResolve = (ticket) => {
    setSelectedTicket(ticket);
    setOpenNewTicketReplyModal(true);
  };

  const handleTicketResolveConfirm = async (replyData) => {
    setOpenNewTicketReplyModal(false);
    setStatusModal({
      open: true,
      status: "loading",
      message: "Resolviendo ticket",
    });
    try {
      const response = await resolveTicket(replyData);
      setStatusModal({
        open: true,
        status: "success",
        message: "Ticket resuelto exitosamente",
      });
    } catch (err) {
      console.error("Error al resolver ticket:", err);
      setStatusModal({
        open: true,
        status: "error",
        message: "Fallo al resolver ticket",
      });
    }
  };


  const filteredTickets = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return tickets ?? [];

    return (tickets ?? []).filter((ticket) => {
      const values = [
        ticket?.subject,
      ];

      return values.some((value) =>
        String(value ?? "").toLowerCase().includes(term)
      );
    });
  }, [tickets, search]);

  if (ticketsError) return <p>Hubo un error al cargar las Tickets.</p>

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
              placeholder="Buscar ticket"
              className="h-14 w-full rounded-full border border-transparent bg-white pl-14 pr-5 text-lg font-medium text-slate-600 shadow-[0_8px_24px_rgba(15,23,42,0.08)] outline-none transition placeholder:text-slate-400 focus:border-[#4bae52]"
            />
          </div>
        </div>

        {isTicketsLoading ? (
          <>
            <TicketsMobileSkeleton />
            <TicketsDesktopSkeleton />
          </>
        ) : (
          <>
            <TicketsMobile
              tickets={filteredTickets}
              onTicketClick={handleTicketView}
              onTicketResolve={handleTicketResolve}
              onTicketResolveConfirm={handleTicketResolveConfirm}
            />

            <TicketsDesktop
              tickets={filteredTickets}
              onTicketClick={handleTicketView}
              onTicketResolve={handleTicketResolve}
              onTicketResolveConfirm={handleTicketResolveConfirm}
            />
          </>

        )}
      </section>

      {/* modales */}
      <NewTicketReplyModal
        ticket={selectedTicket}
        open={openNewTicketReplyModal}
        onClose={() => setOpenNewTicketReplyModal(false)}
        onSave={handleTicketResolveConfirm}
      />

      <ViewTicketModal
        open={openViewTicketModal}
        onClose={() => setOpenViewTicketModal(false)}
        ticket={selectedTicket}
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