import React, { useState, useMemo, useEffect } from 'react';
import { Search, MailPlus, View } from "lucide-react";

import HelpMobile from '../components/help/HelpMobile';
import HelpDesktop from '../components/help/HelpDesktop';
import HelpDesktopSkeleton from '../components/help/HelpDesktopSkeleton';
import HelpMobileSkeleton from '../components/help/HelpMobileSkeleton';
import ActionStatusModal from "../components/ActionStatusModal";

import { useAuth } from '../components/context/AuthContext';
import useCreateTicket from '../components/hooks/tickets/useCreateTickets';
import useGetTicketsByUser from '../components/hooks/tickets/useGetTicketsByUser';
import useGetTicket from '../components/hooks/tickets/useGetTicket';
import NewHelpModal from '../components/help/NewHelpModal';
import ViewHelpModal from '../components/help/ViewHelpModal';

export default function HelpPage() {
	const [search, setSearch] = useState("");

	const [openNewHelpModal, setOpenNewHelpModal] = useState(false);
	const [openViewTicketModal, setOpenViewTicketModal] = useState(false);
	const [selectedTicket, setSelectedTicket] = useState(null);

	const [statusModal, setStatusModal] = useState({ open: false, status: "loading", message: "Cargando" });

	const { userId } = useAuth();
	const { tickets, isTicketsLoading, ticketsError } = useGetTicketsByUser(userId);
	const { ticket } = useGetTicket(selectedTicket?.ticket_id);
	const { createTicket } = useCreateTicket();

	const handleSaveHelp = async (data) => {
		setOpenNewHelpModal(false);
		setStatusModal({
			open: true,
			status: "loading",
			message: "Creando ticket",
		});

		try {
			const response = await createTicket(data);

			setStatusModal({
				open: true,
				status: "success",
				message: "Ticket creado exitosamente",
			});
		} catch (err) {
			console.error("Error al crear ticket:", err);
			setStatusModal({
				open: true,
				status: "error",
				message: "Fallo al crear ticket",
			});
		}
	};

	const handleTicketClick = (ticket) => {
		setSelectedTicket(ticket);
		setOpenViewTicketModal(true);
	};

	const filteredTickets = useMemo(() => {
		const term = search.trim().toLowerCase();

		if (!term) return tickets ?? [];

		return (tickets ?? []).filter((ticket) => {
			const values = [
				ticket?.title,
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

				{/* NUEVO CONTENEDOR DE DISEÑO ESTILO CORREOS */}
				<div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
						<div>
							<p className="text-sm font-bold uppercase tracking-wide text-emerald-600">
								Centro de Ayuda y Soporte
							</p>

							<h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">
								Tickets de Soporte
							</h1>

							<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
								Los tickets te permiten reportar problemas técnicos, solicitar asistencia
								o realizar consultas. Nuestro equipo revisará tu caso y te responderá a la brevedad.
							</p>
						</div>

						<button
							type="button"
							onClick={() => setOpenNewHelpModal(true)}
							className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 lg:w-auto"
						>
							<MailPlus size={20} />
							Crear Ticket
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
								placeholder="Buscar ticket por título o asunto..."
								className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-5 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
							/>
						</div>
					</div>
				</div>

				{/* LISTADO DE TICKETS */}
				{isTicketsLoading ? (
					<>
						<HelpDesktopSkeleton />
						<HelpMobileSkeleton />
					</>
				) : (
					<>
						<HelpMobile
							tickets={filteredTickets}
							onTicketClick={handleTicketClick}
						/>

						<HelpDesktop
							tickets={filteredTickets}
							onTicketClick={handleTicketClick}
						/>
					</>
				)}
			</section>

			{/* modales */}
			<NewHelpModal
				open={openNewHelpModal}
				onClose={() => setOpenNewHelpModal(false)}
				onSave={handleSaveHelp}
			/>

			<ViewHelpModal
				open={openViewTicketModal}
				onClose={() => setOpenViewTicketModal(false)}
				ticket={ticket}
			/>
		</>
	);
}