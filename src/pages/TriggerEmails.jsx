import { useState, useMemo } from 'react';
import { Loader2, MailPlus, Search } from 'lucide-react';

import {
  ScheduledEmailsList,
} from '../components/trigger-emails/ScheduledEmailsList';

import {
  useEmailScheduleRuns,
  useCreateScheduledEmail,
  useDeleteScheduledEmail,
  useScheduledEmails,
  useToggleScheduledEmailStatus,
  useUpdateScheduledEmail,
  useDownloadScheduledEmailAttachment,
} from '../components/hooks/scheduled-emails/scheduledEmailsQueries';

import {
  useGetClientsActive,
} from '../components/hooks/users/Clients/useGetClientsActive';

import ActionStatusModal from '../components/ActionStatusModal';
import NewTriggerMailModal from '../components/trigger-emails/NewTriggerMailModal';
import EditTriggerMailModal from '../components/trigger-emails/EditTriggerMailModal';
import EmailDetailModal from '../components/trigger-emails/EmailDetailModal';

export default function TriggerEmails() {
  const [openNewMessageModal, setOpenNewMessageModal] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmailToEdit, setSelectedEmailToEdit] = useState(null);
  const [selectedEmailToView, setSelectedEmailToView] = useState(null);

  const [search, setSearch] = useState('');

  const [statusModal, setStatusModal] = useState({
    open: false,
    status: 'loading',
    message: 'Cargando',
  });

  const clientsQuery = useGetClientsActive();
  const scheduledEmailsQuery = useScheduledEmails();

  const selectedEmailRunsQuery = useEmailScheduleRuns(
    selectedEmailToView?.id,
    Boolean(selectedEmailToView?.id),
  );

  const createEmailMutation = useCreateScheduledEmail();
  const updateScheduledEmailMutation = useUpdateScheduledEmail();
  const toggleEmailStatusMutation = useToggleScheduledEmailStatus();
  const deleteEmailMutation = useDeleteScheduledEmail();
  const downloadAttachmentMutation = useDownloadScheduledEmailAttachment();

  const emails = scheduledEmailsQuery.data || [];
  const clients = clientsQuery.data || [];

  const filteredEmails = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return emails;

    return emails.filter((email) => {
      const searchableText = [
        email.subject,
        email.status,
        email.trigger_type,
        Array.isArray(email.to) ? email.to.join(' ') : '',
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [emails, search]);

  const handleSaveTriggerMail = async (formData) => {
    setStatusModal({
      open: true,
      status: 'loading',
      message: 'Creando correo programado',
    });

    try {
      await createEmailMutation.mutateAsync(formData);

      setOpenNewMessageModal(false);

      setStatusModal({
        open: true,
        status: 'success',
        message: 'Correo programado creado correctamente.',
      });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.detail ||
        'No se pudo crear el correo programado. Intenta nuevamente.';

      setStatusModal({
        open: true,
        status: 'error',
        message: errorMessage,
      });
    }
  };

  const handleSaveEditTriggerMail = async (formData) => {
    setStatusModal({
      open: true,
      status: 'loading',
      message: 'Actualizando correo programado',
    });

    try {
      console.log("datos", formData)
      const updatedEmail = await updateScheduledEmailMutation.mutateAsync(formData);

      setIsEditModalOpen(false);
      setSelectedEmailToEdit(null);

      if (selectedEmailToView?.id === formData.id && updatedEmail) {
        setSelectedEmailToView(updatedEmail);
      }

      await scheduledEmailsQuery.refetch();

      setStatusModal({
        open: true,
        status: 'success',
        message: 'Correo programado actualizado correctamente.',
      });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.detail ||
        'No se pudo actualizar el correo programado. Intenta nuevamente.';

      setStatusModal({
        open: true,
        status: 'error',
        message: errorMessage,
      });
    }
  };

  const handleToggleEmailStatus = async (email) => {
    const isActive = email.status === 'active';
    const action = isActive ? 'deactivate' : 'activate';
    const nextStatusLabel = isActive ? 'desactivado' : 'activado';

    setStatusModal({
      open: true,
      status: 'loading',
      message: isActive
        ? 'Desactivando correo programado'
        : 'Activando correo programado',
    });

    try {
      const updatedEmail = await toggleEmailStatusMutation.mutateAsync({
        id: email.id,
        action,
      });

      if (selectedEmailToView?.id === email.id) {
        setSelectedEmailToView(
          updatedEmail || {
            ...selectedEmailToView,
            status: isActive ? 'deactivated' : 'active',
          },
        );
      }

      setStatusModal({
        open: true,
        status: 'success',
        message: `Correo ${nextStatusLabel} correctamente.`,
      });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.detail ||
        `No se pudo ${isActive ? 'desactivar' : 'activar'
        } el correo. Intenta nuevamente.`;

      setStatusModal({
        open: true,
        status: 'error',
        message: errorMessage,
      });
    }
  };

  const handleDeleteEmail = async (email) => {
    setStatusModal({
      open: true,
      status: 'loading',
      message: 'Eliminando correo',
    });

    try {
      await deleteEmailMutation.mutateAsync(email);

      if (selectedEmailToView?.id === email.id) {
        setSelectedEmailToView(null);
      }

      if (selectedEmailToEdit?.id === email.id) {
        setSelectedEmailToEdit(null);
        setIsEditModalOpen(false);
      }

      setStatusModal({
        open: true,
        status: 'success',
        message: 'Email eliminado correctamente',
      });
    } catch {
      setStatusModal({
        open: true,
        status: 'error',
        message: 'No se pudo eliminar el correo. Intenta nuevamente.',
      });
    }
  };

  const handleEditEmail = (email) => {
    setSelectedEmailToEdit(email);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    if (updateScheduledEmailMutation.isPending) return;

    setIsEditModalOpen(false);
    setSelectedEmailToEdit(null);
  };

  const handleViewEmail = (email) => {
    setSelectedEmailToView(email);
  };

  const handleDownloadAttachment = async ({ emailScheduleId, path }) => {
    if (!emailScheduleId || !path) return;

    try {
      await downloadAttachmentMutation.mutateAsync({
        emailScheduleId,
        path,
      });

    } catch (error) {
      const errorMessage =
        error?.response?.data?.detail ||
        'No se pudo descargar el archivo adjunto. Intenta nuevamente.';

      setStatusModal({
        open: true,
        status: 'error',
        message: errorMessage,
      });
    }
  };

  return (
    <>
      <section className="space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-emerald-600">
                Automatización de correos
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">
                Correos programados
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Administra mensajes inmediatos, fechas específicas, reglas
                relativas al contrato y correos recurrentes.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpenNewMessageModal(true)}
              className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 lg:w-auto"
              disabled={createEmailMutation.isPending}
            >
              {createEmailMutation.isPending ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <MailPlus size={20} />
              )}

              Crear Email
            </button>
          </div>

          <div className="mt-5">
            <div className="relative">
              <Search
                size={20}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por asunto, destinatario, estado o tipo de activación..."
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-5 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>
          </div>
        </div>

        {createEmailMutation.isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            Ocurrió un error al crear el correo. Revisa los datos e intenta
            nuevamente.
          </div>
        )}

        <ScheduledEmailsList
          emails={filteredEmails}
          isLoading={scheduledEmailsQuery.isLoading}
          isError={scheduledEmailsQuery.isError}
          onRetry={scheduledEmailsQuery.refetch}
          onEdit={handleEditEmail}
          onView={handleViewEmail}
          onToggleStatus={handleToggleEmailStatus}
          onDelete={handleDeleteEmail}
          togglePendingEmailId={
            toggleEmailStatusMutation.isPending
              ? toggleEmailStatusMutation.variables?.id
              : null
          }
          deletePendingEmailId={
            deleteEmailMutation.isPending
              ? deleteEmailMutation.variables?.id
              : null
          }
        />
      </section>

      <NewTriggerMailModal
        open={openNewMessageModal}
        onClose={() => setOpenNewMessageModal(false)}
        onSave={handleSaveTriggerMail}
        clients={clients}
        isSaving={createEmailMutation.isPending}
      />

      <EditTriggerMailModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveEditTriggerMail}
        emailSchedule={selectedEmailToEdit}
        clients={clients}
        isSaving={updateScheduledEmailMutation.isPending}
        onDownloadAttachment={handleDownloadAttachment}
        downloadPendingAttachmentPath={
          downloadAttachmentMutation.isPending
            ? downloadAttachmentMutation.variables?.path
            : null
        }
      />

      <EmailDetailModal
        open={Boolean(selectedEmailToView)}
        email={selectedEmailToView}
        runs={selectedEmailRunsQuery.data || []}
        isRunsLoading={selectedEmailRunsQuery.isLoading}
        isRunsError={selectedEmailRunsQuery.isError}
        onRetryRuns={selectedEmailRunsQuery.refetch}
        onClose={() => setSelectedEmailToView(null)}
        onDownloadAttachment={handleDownloadAttachment}
        downloadPendingAttachmentPath={
          downloadAttachmentMutation.isPending
            ? downloadAttachmentMutation.variables?.path
            : null
        }
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