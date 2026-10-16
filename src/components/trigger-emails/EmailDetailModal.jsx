import { useEffect } from 'react';
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Download,
  Clock3,
  FileText,
  Loader2,
  Mail,
  Paperclip,
  RefreshCw,
  Users,
  X,
  XCircle,
} from 'lucide-react';

import {
  getStatusBadgeClass,
  statusLabels,
  triggerLabels,
} from './ScheduledEmailsList';

function formatDateTime(value) {
  if (!value) return 'No definido';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatNullableValue(value) {
  if (value === null || value === undefined || value === '') {
    return 'No definido';
  }

  return String(value);
}

function getScheduledDate(email) {
  return (
    email?.scheduled_for ||
    email?.scheduled_at ||
    email?.scheduled_date_at ||
    null
  );
}

function getAttachmentLabel(attachment) {
  if (!attachment) return 'Archivo adjunto';

  if (typeof attachment === 'string') {
    return attachment.split(/[\\/]/).pop() || attachment;
  }

  return (
    attachment.name ||
    attachment.filename ||
    attachment.file_name ||
    attachment.path?.split(/[\\/]/).pop() ||
    'Archivo adjunto'
  );
};

function getRecipientsLabel(recipients = []) {
  if (!Array.isArray(recipients) || !recipients.length) {
    return 'Sin destinatarios';
  }

  return recipients
    .map((recipient) => (recipient === '*' ? 'Todos los clientes' : recipient))
    .join(', ');
}

function getRelativeTriggerLabel(triggerType) {
  const labels = {
    relative_to_payment_due: 'fecha de pago',
    relative_to_before_payment_due: 'fecha de pago',
    relative_to_after_payment_due: 'fecha de pago',
    relative_to_lease_start: 'inicio de contrato',
    relative_to_lease_end: 'fin de contrato',
  };

  return labels[triggerType] || 'evento del contrato';
}

function getRelativeDaysLabel(email) {
  const offsetDays = email?.offset_days;

  if (offsetDays === null || offsetDays === undefined || offsetDays === '') {
    return 'No definido';
  }

  const numericOffset = Number(offsetDays);
  const absoluteDays = Math.abs(numericOffset);

  if (email.trigger_type === 'relative_to_before_payment_due') {
    return `${absoluteDays} día(s) antes de la fecha de pago`;
  }

  if (email.trigger_type === 'relative_to_after_payment_due') {
    return `${absoluteDays} día(s) después de la fecha de pago`;
  }

  if (email.trigger_type === 'relative_to_lease_start') {
    return `${absoluteDays} día(s) después del inicio de contrato`;
  }

  if (email.trigger_type === 'relative_to_lease_end') {
    return `${absoluteDays} día(s) antes del fin de contrato`;
  }

  if (numericOffset < 0) {
    return `${absoluteDays} día(s) antes de ${getRelativeTriggerLabel(
      email.trigger_type,
    )}`;
  }

  return `${absoluteDays} día(s) después de ${getRelativeTriggerLabel(
    email.trigger_type,
  )}`;
}

function DetailItem({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
        {icon}
        {label}
      </div>

      <p className="break-words text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function AttachmentsList({
  attachments = [],
  emailScheduleId,
  onDownloadAttachment,
  downloadPendingAttachmentPath = null,
}) {
  if (!attachments?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-5 text-center">
        <p className="text-sm font-semibold text-slate-500">
          Sin archivos adjuntos
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Este correo electrónico no contiene ningún archivo asociado.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      {attachments.map((attachment, index) => {
        const label = getAttachmentLabel(attachment);

        // Lógica para descargar / abrir el adjunto existente
        const attachmentPath =
          typeof attachment === 'string'
            ? attachment
            : attachment?.path || attachment?.url;

        const handleDownload = () => {
          if (!attachmentPath) return;

          onDownloadAttachment?.({
            emailScheduleId,
            path: attachmentPath,
          });
        };

        return (
          <div
            key={`${label}-${index}`}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm"
          >
            <div className="min-w-0 flex-1">
              <span className="block truncate font-semibold text-slate-700" title={label}>
                {label}
              </span>
              <span className="block text-xs text-slate-400 font-medium">
                Archivo guardado
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {/* Botón Descargar */}
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloadPendingAttachmentPath === attachmentPath}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                title="Descargar archivo"
              >
                {downloadPendingAttachmentPath === attachmentPath ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getRunStatusIcon(status) {
  if (status === 'sent') return <CheckCircle2 size={15} />;
  if (status === 'failed') return <XCircle size={15} />;
  if (status === 'sending') {
    return <Loader2 size={15} className="animate-spin" />;
  }

  return <Clock3 size={15} />;
}

function RunsTable({
  runs = [],
  isLoading = false,
  isError = false,
  onRetry,
}) {
  if (isLoading) {
    return (
      <div className="grid gap-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle size={18} />
          <span className="text-sm font-semibold">
            No se pudo cargar el historial.
          </span>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
          >
            <RefreshCw size={16} />
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (!runs.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-medium text-slate-500">
        Este correo todavía no tiene ejecuciones registradas.
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-3 lg:hidden">
        {runs.map((run, index) => (
          <div
            key={run.id || `${run.schedule_id}-${run.scheduled_for}-${index}`}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Programado para
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {formatDateTime(run.scheduled_for)}
                </p>
              </div>

              <span
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${getStatusBadgeClass(
                  run.status,
                )}`}
              >
                {getRunStatusIcon(run.status)}
                {statusLabels[run.status] || run.status}
              </span>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Intentos
                </p>

                <p className="font-semibold text-slate-700">
                  {formatNullableValue(run.attempts)}/
                  {formatNullableValue(run.max_attempts)}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Enviado
                </p>

                <p className="font-semibold text-slate-700">
                  {formatDateTime(run.sent_at)}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Fallido
                </p>

                <p className="font-semibold text-slate-700">
                  {formatDateTime(run.failed_at)}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Error
                </p>

                <p className="font-semibold text-slate-700">
                  {run.error_message || 'Sin error'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white lg:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                Programado para
              </th>

              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                Estado
              </th>

              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                Intentos
              </th>

              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                Enviado
              </th>

              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                Fallido
              </th>

              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                Error
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {runs.map((run, index) => (
              <tr
                key={run.id || `${run.schedule_id}-${run.scheduled_for}-${index}`}
                className="align-top transition hover:bg-slate-50"
              >
                <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                  {formatDateTime(run.scheduled_for)}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${getStatusBadgeClass(
                      run.status,
                    )}`}
                  >
                    {getRunStatusIcon(run.status)}
                    {statusLabels[run.status] || run.status}
                  </span>
                </td>

                <td className="px-4 py-4 text-sm font-semibold text-slate-700">
                  {formatNullableValue(run.attempts)}/
                  {formatNullableValue(run.max_attempts)}
                </td>

                <td className="px-4 py-4 text-sm text-slate-600">
                  {formatDateTime(run.sent_at)}
                </td>

                <td className="px-4 py-4 text-sm text-slate-600">
                  {formatDateTime(run.failed_at)}
                </td>

                <td className="max-w-[280px] px-4 py-4 text-sm text-slate-600">
                  {run.error_message || 'Sin error'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function buildDetailItems(email, runs = []) {
  const scheduledDate = getScheduledDate(email);

  const immediateSentDate =
    runs.find((run) => run.status === 'sent')?.sent_at ||
    email.sent_at ||
    scheduledDate;

  const recipients = getRecipientsLabel(email.to);

  const baseDetails = [
    {
      label: 'Destinatarios',
      value: recipients,
      icon: <Users size={15} />,
    },
    {
      label: 'Estado',
      value: statusLabels[email.status] || email.status,
      icon: <CheckCircle2 size={15} />,
    },
  ];

  if (email.trigger_type === 'immediate') {
    return [
      {
        label: 'Fecha de envío',
        value: formatDateTime(immediateSentDate),
        icon: <CalendarClock size={15} />,
      },
      ...baseDetails,
    ];
  }

  if (email.trigger_type === 'specific_date') {
    return [
      {
        label: 'Fecha programada',
        value: formatDateTime(scheduledDate),
        icon: <CalendarClock size={15} />,
      },
      ...baseDetails,
    ];
  }

  if (email.trigger_type === 'recurring') {
    return [
      ...baseDetails,
      {
        label: 'Primer mensaje',
        value: formatDateTime(scheduledDate),
        icon: <CalendarClock size={15} />,
      },
      {
        label: 'Intervalo de repetición',
        value: email.recurrence_interval
          ? String(email.recurrence_interval)
          : email.offset_days
            ? `Cada ${email.offset_days} días`
            : 'No definido',
        icon: <RefreshCw size={15} />,
      },
    ];
  }

  return [
    ...baseDetails,
    {
      label: 'Regla relativa',
      value: triggerLabels[email.trigger_type] || email.trigger_type,
      icon: <CalendarClock size={15} />,
    },
    {
      label: 'Días relativos',
      value: getRelativeDaysLabel(email),
      icon: <Clock3 size={15} />,
    },
  ];
}

export default function EmailDetailModal({
  open,
  email,
  runs,
  isRunsLoading = false,
  isRunsError = false,
  onRetryRuns,
  onClose,
  onDownloadAttachment,
  downloadPendingAttachmentPath = null,
}) {
  const emailRuns =
    runs ||
    email?.runs ||
    email?.schedule_runs ||
    email?.email_schedule_runs ||
    [];

  const detailItems = email ? buildDetailItems(email, emailRuns) : [];

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || !email) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 px-3 py-3 backdrop-blur-sm sm:items-center sm:px-5 sm:py-6">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-600">
              Examinar correo
            </p>

            <h2 className="mt-1 truncate text-xl font-bold text-slate-950 sm:text-2xl">
              {email.subject || 'Sin asunto'}
            </h2>

            <p className="mt-1 text-sm font-medium text-slate-500">
              {triggerLabels[email.trigger_type] || email.trigger_type}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-88px)] overflow-y-auto bg-slate-50 px-5 py-5 sm:px-6">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {detailItems.map((item) => (
              <DetailItem
                key={`${item.label}-${item.value}`}
                label={item.label}
                value={item.value}
                icon={item.icon}
              />
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
              <FileText size={15} />
              Cuerpo del correo
            </div>

            <p className="whitespace-pre-line text-sm leading-6 text-slate-700">
              {email.body || 'Sin contenido definido.'}
            </p>
          </div>

          <div className="mt-5">
            <div className="mb-3 flex items-center gap-2">
              <Paperclip size={18} className="text-slate-500" />
              <h3 className="text-sm font-bold text-slate-900">Adjuntos</h3>
            </div>

            <AttachmentsList
              attachments={email.attachments || []}
              emailScheduleId={email.id}
              onDownloadAttachment={onDownloadAttachment}
              downloadPendingAttachmentPath={downloadPendingAttachmentPath}
            />
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <Clock3 size={18} className="text-slate-500" />
              <h3 className="text-sm font-bold text-slate-900">
                Historial de ejecuciones
              </h3>
            </div>

            <RunsTable
              runs={emailRuns}
              isLoading={isRunsLoading}
              isError={isRunsError}
              onRetry={onRetryRuns}
            />
          </div>
        </div>
      </div>
    </div>
  );
}