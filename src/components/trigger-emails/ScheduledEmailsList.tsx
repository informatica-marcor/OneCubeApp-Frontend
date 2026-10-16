import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  AlertCircle,
  Edit2,
  Eye,
  Loader2,
  Mail,
  MoreVertical,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  Trash2,
} from 'lucide-react';

export type ScheduledEmailTriggerType =
  | 'immediate'
  | 'specific_date'
  | 'relative_to_payment_due'
  | 'relative_to_before_payment_due'
  | 'relative_to_after_payment_due'
  | 'relative_to_lease_start'
  | 'relative_to_lease_end'
  | 'recurring'
  | string;

export interface ScheduledEmail {
  id: string | number;
  subject: string;
  to: string[];
  trigger_type: ScheduledEmailTriggerType;
  status: string;
  body?: string;
  attachments?: string[];
  scheduled_date_at?: string | null;
  scheduled_at?: string | null;
  recurrence_interval?: string | number | null;
  offset_days?: string | number | null;
}

interface ScheduledEmailsListProps {
  emails: ScheduledEmail[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onEdit?: (email: ScheduledEmail) => void;
  onView?: (email: ScheduledEmail) => void;
  onToggleStatus?: (email: ScheduledEmail) => void;
  onDelete?: (email: ScheduledEmail) => void;
  togglePendingEmailId?: string | number | null;
  deletePendingEmailId?: string | number | null;
  emptyTitle?: string;
  emptyDescription?: string;
}

const TOGGLE_STATUS_BLOCKED_TRIGGER_TYPES = ['immediate', 'specific_date'];

export const triggerLabels: Record<string, string> = {
  immediate: 'Inmediato',
  specific_date: 'Fecha específica',
  relative_to_payment_due: 'Facturación',
  relative_to_lease_start: 'Inicio de contrato',
  relative_to_lease_end: 'Fin de contrato',
  recurring: 'Recurrente',
};

export const statusLabels: Record<string, string> = {
  active: 'Activo',
  deactivated: 'Pausado',
  completed: 'Completado',
  pending: 'Pendiente',
  sending: 'Enviando',
  sent: 'Enviado',
  failed: 'Fallido',
  skipped: 'Omitido',
};

export const getStatusBadgeClass = (status: string) => {
  if (status === 'active') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  }

  if (status === 'deactivated') {
    return 'border-amber-200 bg-amber-50 text-amber-700';
  }

  if (status === 'completed') {
    return 'border-blue-200 bg-blue-50 text-blue-700';
  }

  if (status === 'failed') {
    return 'border-red-200 bg-red-50 text-red-700';
  }

  return 'border-slate-200 bg-slate-50 text-slate-700';
};

// Helper dinámico para aplicar un color de borde izquierdo a las tarjetas mobile
export const getStatusBorderClass = (status: string) => {
  if (status === 'active') return 'border-l-emerald-500';
  if (status === 'deactivated') return 'border-l-amber-500';
  if (status === 'completed') return 'border-l-blue-500';
  if (status === 'failed') return 'border-l-red-500';
  return 'border-l-slate-400';
};

function canToggleEmailStatus(triggerType: ScheduledEmailTriggerType) {
  return !TOGGLE_STATUS_BLOCKED_TRIGGER_TYPES.includes(triggerType);
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-bold ${getStatusBadgeClass(
        status,
      )}`}
    >
      {statusLabels[status] || status}
    </span>
  );
}

function TriggerBadge({ triggerType }: { triggerType: ScheduledEmailTriggerType }) {
  return (
    <span className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">
      {triggerLabels[triggerType] || triggerType}
    </span>
  );
}

function RecipientBadge({ recipients = [] }: { recipients?: string[] }) {
  const isAllClients = recipients.includes('*');
  const hasMultipleClients = recipients.length > 1;

  const label = isAllClients
    ? 'Todos los clientes'
    : hasMultipleClients
      ? 'Varios clientes'
      : recipients[0] || 'Sin destinatarios';

  return (
    <span
      className="inline-flex max-w-full items-center justify-center truncate rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm"
      title={label}
    >
      {label}
    </span>
  );
}

function DropdownItem({
  icon,
  label,
  onClick,
  variant = 'default',
  disabled = false,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variant === 'danger'
        ? 'text-red-600 hover:bg-red-50'
        : 'text-slate-700 hover:bg-slate-50'
        }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ActionsDropdown({
  email,
  isOpen,
  onToggleOpen,
  onClose,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
  toggleIsPending,
  deleteIsPending,
}: {
  email: ScheduledEmail;
  isOpen: boolean;
  onToggleOpen: () => void;
  onClose: () => void;
  onView: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
  toggleIsPending: boolean;
  deleteIsPending: boolean;
}) {
  const isActive = email.status === 'active';
  const canToggle = email.status === 'active' || email.status === 'deactivated';
  // const canToggle = canToggleEmailStatus(email.trigger_type);

  const handleAction = (callback: () => void) => {
    callback();
    onClose();
  };

  return (
    <div className="relative flex justify-end">
      <button
        type="button"
        onClick={onToggleOpen}
        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 shadow-sm"
        aria-label="Abrir menú de acciones"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-30 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
          <DropdownItem
            icon={<Eye size={17} />}
            label="Examinar"
            onClick={() => handleAction(onView)}
            disabled={deleteIsPending}
          />

          {canToggle && (
            <DropdownItem
              icon={<Edit2 size={17} />}
              label="Editar"
              onClick={() => handleAction(onEdit)}
              disabled={deleteIsPending}
            />
          )}

          {/* Ocultamos condicionalmente si el trigger_type está bloqueado */}
          {canToggle && (
            <DropdownItem
              icon={
                toggleIsPending ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : isActive ? (
                  <PauseCircle size={17} />
                ) : (
                  <PlayCircle size={17} />
                )
              }
              label={isActive ? 'Pausar' : 'Reanudar'}
              onClick={() => handleAction(onToggleStatus)}
              disabled={toggleIsPending || deleteIsPending}
            />
          )}

          <div className="border-t border-slate-100" />

          <DropdownItem
            icon={
              deleteIsPending ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Trash2 size={17} />
              )
            }
            label="Eliminar"
            onClick={() => handleAction(onDelete)}
            variant="danger"
            disabled={deleteIsPending}
          />
        </div>
      )}
    </div>
  );
}

export function ScheduledEmailsList({
  emails,
  isLoading = false,
  isError = false,
  onRetry,
  onEdit,
  onView,
  onToggleStatus,
  onDelete,
  togglePendingEmailId = null,
  deletePendingEmailId = null,
  emptyTitle = 'No hay correos programados',
  emptyDescription = 'Crea tu primer correo para comenzar a automatizar notificaciones.',
}: ScheduledEmailsListProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | number | null>(null);

  const handleDelete = (email: ScheduledEmail) => {
    const shouldDelete = window.confirm(`¿Seguro que deseas eliminar "${email.subject}"?`);

    if (shouldDelete) {
      onDelete?.(email);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse rounded-3xl border border-slate-200 bg-slate-100"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-700">
              <AlertCircle size={22} />
            </span>

            <div>
              <h3 className="font-bold text-red-900">No se pudieron cargar los correos.</h3>
              <p className="mt-1 text-sm font-medium text-red-700">
                Intenta nuevamente. Si el problema persiste,{' '}
                <a
                  href="https://wa.me/56956355385?text=Hola!%20Tengo%20problemas%20para%20cargar%20los%20correos%20programados."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-bold hover:text-red-950 transition-colors cursor-pointer"
                >
                  contacta al soporte
                </a>
              </p>
            </div>
          </div>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
            >
              <RefreshCw size={17} />
              Reintentar
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!emails.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
          <Mail size={24} />
        </div>

        <h3 className="mt-4 font-bold text-slate-900">{emptyTitle}</h3>

        <p className="mt-2 text-sm font-medium text-slate-500">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Vista mobile / tablet optimizada */}
      <div className="grid gap-4 xl:hidden">
        {emails.map((email) => {
          const isDropdownOpen = openDropdownId === email.id;
          const toggleIsPending = String(togglePendingEmailId) === String(email.id);
          const deleteIsPending = String(deletePendingEmailId) === String(email.id);

          return (
            <article
              key={email.id}
              className={`rounded-2xl border border-l-4 border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md ${getStatusBorderClass(
                email.status
              )}`}
            >
              {/* Cabecera de la tarjeta */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 border border-slate-100">
                    <Mail size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 leading-snug break-words" title={email.subject}>
                      {email.subject}
                    </h3>
                  </div>
                </div>

                <ActionsDropdown
                  email={email}
                  isOpen={isDropdownOpen}
                  onToggleOpen={() =>
                    setOpenDropdownId((current) => (current === email.id ? null : email.id))
                  }
                  onClose={() => setOpenDropdownId(null)}
                  onView={() => onView?.(email)}
                  onEdit={() => onEdit?.(email)}
                  onToggleStatus={() => onToggleStatus?.(email)}
                  onDelete={() => handleDelete(email)}
                  toggleIsPending={toggleIsPending}
                  deleteIsPending={deleteIsPending}
                />
              </div>

              {/* Sección de detalles (Cambio de Grid a Flex/Stack adaptativo) */}
              <div className="mt-4 border-t border-slate-100 pt-4">
                <div className="flex flex-col gap-4 text-xs sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">

                  {/* Destinatario - Ocupa ancho completo en móvil para evitar truncados agresivos */}
                  <div className="flex flex-col gap-1 min-w-0 w-full sm:w-auto sm:max-w-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Destinatario</span>
                    <div className="truncate">
                      <RecipientBadge recipients={email.to} />
                    </div>
                  </div>

                  {/* Fila contenedora para los Badges pequeños en móvil (Tipo y Estado) */}
                  <div className="flex items-center gap-6 sm:contents">
                    {/* Tipo */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tipo</span>
                      <div>
                        <TriggerBadge triggerType={email.trigger_type} />
                      </div>
                    </div>

                    {/* Estado Actual */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Estado Actual</span>
                      <div>
                        <StatusBadge status={email.status} />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Vista desktop intacta y funcional */}
      <div className="hidden overflow-visible rounded-3xl border border-slate-200 bg-white shadow-sm xl:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50">
              <th className="rounded-tl-3xl px-5 py-4 text-left font-bold uppercase tracking-wide text-slate-500">
                Asunto
              </th>

              <th className="px-5 py-4 text-left font-bold uppercase tracking-wide text-slate-500">
                Destinatario
              </th>

              <th className="px-5 py-4 text-left font-bold uppercase tracking-wide text-slate-500">
                Tipo
              </th>

              <th className="px-5 py-4 text-left font-bold uppercase tracking-wide text-slate-500">
                Estado
              </th>

              <th className="rounded-tr-3xl px-5 py-4 text-right font-bold uppercase tracking-wide text-slate-500">
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {emails.map((email) => {
              const isDropdownOpen = openDropdownId === email.id;
              const toggleIsPending = String(togglePendingEmailId) === String(email.id);
              const deleteIsPending = String(deletePendingEmailId) === String(email.id);

              return (
                <tr key={email.id}>
                  <td className="max-w-[320px] px-5 py-4">
                    <p className="truncate font-bold text-slate-900" title={email.subject}>
                      {email.subject}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <RecipientBadge recipients={email.to} />
                  </td>

                  <td className="px-5 py-4">
                    <TriggerBadge triggerType={email.trigger_type} />
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={email.status} />
                  </td>

                  <td className="px-5 py-4">
                    <ActionsDropdown
                      email={email}
                      isOpen={isDropdownOpen}
                      onToggleOpen={() =>
                        setOpenDropdownId((current) =>
                          current === email.id ? null : email.id,
                        )
                      }
                      onClose={() => setOpenDropdownId(null)}
                      onView={() => onView?.(email)}
                      onEdit={() => onEdit?.(email)}
                      onToggleStatus={() => onToggleStatus?.(email)}
                      onDelete={() => handleDelete(email)}
                      toggleIsPending={toggleIsPending}
                      deleteIsPending={deleteIsPending}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}