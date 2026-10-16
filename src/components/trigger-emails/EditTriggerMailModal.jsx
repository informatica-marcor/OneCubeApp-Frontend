import { useEffect, useMemo, useState } from 'react';
import {
    BadgeInfo,
    Calendar,
    Check,
    Download,
    Loader2,
    Paperclip,
    Save,
    Search,
    Settings,
    Trash2,
    Users,
    X,
} from 'lucide-react';

const TRIGGER_TABS = [
    {
        label: 'Inmediata',
        value: 'immediate',
        description: 'Se envía apenas guardes el correo.',
    },
    {
        label: 'Fecha fija',
        value: 'specific_date',
        description: 'Programa el envío para una fecha concreta.',
    },
    {
        label: 'Inicio de contrato',
        value: 'relative_to_lease_start',
        description: 'Se calcula desde la fecha de inicio del contrato.',
    },
    {
        label: 'Fin de contrato',
        value: 'relative_to_lease_end',
        description: 'Se calcula antes de la fecha de término del contrato.',
    },
    {
        label: 'Facturación',
        value: 'relative_to_payment_due',
        description: 'Usa días antes o después del cobro mensual.',
    },
    {
        label: 'Recurrente',
        value: 'recurring',
        description: 'Se reenvía automáticamente según la cantidad de días definidos.',
    },
];

const INITIAL_FORM_DATA = {
    subject: '',
    body: '',
    to: [],
    attachments: [],
    existing_attachments: [],
    trigger_type: 'immediate',
    offset_days: '',
    scheduled_for: '',
    status: 'active',
};

const INITIAL_ERRORS = {
    subject: '',
    body: '',
    to: '',
    attachments: '',
    trigger_type: '',
    offset_days: '',
    scheduled_for: '',
};

const OFFSET_LABELS = {
    relative_to_lease_start: 'Días después del inicio',
    relative_to_lease_end: 'Días antes del final',
    relative_to_payment_due: 'Días antes o después de la facturación',
    recurring: 'Días entre cada envío',
};

const OFFSET_PLACEHOLDERS = {
    relative_to_lease_start: 'Ej: 7',
    relative_to_lease_end: 'Ej: 5',
    relative_to_payment_due: 'Ej: -3 para antes, 2 para después',
    recurring: 'Ej: 30',
};

const getClientId = (client) => client?.id ?? client?.email;

const getClientName = (client) =>
    client?.name ||
    client?.full_name ||
    client?.fullName ||
    client?.business_name ||
    client?.businessName ||
    client?.email ||
    'Cliente sin nombre';

const getClientEmail = (client) => client?.email || '';

const normalizeText = (value) =>
    String(value || '')
        .trim()
        .toLowerCase();

const normalizeRecipients = (to) => {
    if (Array.isArray(to)) return to;
    if (!to) return [];
    return [to];
};

const formatDateForInput = (value) => {
    if (!value) return '';

    if (typeof value === 'string') {
        return value.slice(0, 10);
    }

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value.toISOString().slice(0, 10);
    }

    return '';
};

const getAttachmentName = (attachment) => {
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

const getAttachmentKey = (attachment, index) => {
    if (typeof attachment === 'string') return `${attachment}-${index}`;

    return (
        attachment?.id ||
        attachment?.path ||
        attachment?.name ||
        attachment?.filename ||
        `attachment-${index}`
    );
};

export default function EditTriggerMailModal({
    open,
    onClose,
    onSave,
    emailSchedule,
    clients = [],
    isSaving = false,
    onDownloadAttachment,
    downloadPendingAttachmentPath = null,
}) {
    const [sendToAll, setSendToAll] = useState(false);
    const [clientSearch, setClientSearch] = useState('');
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState(INITIAL_ERRORS);
    const [existingAttachments, setExistingAttachments] = useState([]);

    useEffect(() => {
        if (!open || !emailSchedule) return;

        const currentTo = normalizeRecipients(emailSchedule.to);
        const currentAttachments = Array.isArray(emailSchedule.attachments)
            ? emailSchedule.attachments
            : [];

        setSendToAll(currentTo.includes('*'));
        setClientSearch('');

        setFormData({
            subject: emailSchedule.subject || '',
            body: emailSchedule.body || '',
            to: currentTo,
            attachments: [],
            existing_attachments: currentAttachments,
            trigger_type: emailSchedule.trigger_type || 'immediate',
            offset_days:
                emailSchedule.offset_days === null ||
                    emailSchedule.offset_days === undefined
                    ? ''
                    : String(emailSchedule.offset_days),
            scheduled_for: formatDateForInput(emailSchedule.scheduled_for),
            status: emailSchedule.status || 'active',
        });

        setErrors(INITIAL_ERRORS);
    }, [open, emailSchedule]);

    const activeTab = TRIGGER_TABS.find(
        (tab) => tab.value === formData.trigger_type,
    );

    const shouldShowDate =
        formData.trigger_type === 'specific_date' ||
        formData.trigger_type === 'recurring';

    const shouldShowOffset = [
        'relative_to_lease_start',
        'relative_to_lease_end',
        'relative_to_payment_due',
        'recurring',
    ].includes(formData.trigger_type);

    const validClients = useMemo(() => {
        return clients.filter((client) => Boolean(getClientEmail(client)));
    }, [clients]);

    const filteredClients = useMemo(() => {
        const search = normalizeText(clientSearch);

        if (!search) return validClients;

        return validClients.filter((client) => {
            const name = normalizeText(getClientName(client));
            const email = normalizeText(getClientEmail(client));

            return name.includes(search) || email.includes(search);
        });
    }, [validClients, clientSearch]);

    const selectedClients = useMemo(() => {
        return validClients.filter((client) =>
            formData.to.includes(getClientEmail(client)),
        );
    }, [validClients, formData.to]);

    const resetForm = () => {
        setSendToAll(false);
        setClientSearch('');
        setFormData(INITIAL_FORM_DATA);
        setErrors(INITIAL_ERRORS);
        setExistingAttachments([]);
    };

    const handleClose = () => {
        if (isSaving) return;

        resetForm();
        onClose?.();
    };

    const updateField = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: '',
        }));
    };

    const handleSendToAllChange = () => {
        const nextValue = !sendToAll;

        setSendToAll(nextValue);

        setFormData((prev) => ({
            ...prev,
            to: nextValue ? ['*'] : [],
        }));

        setErrors((prev) => ({
            ...prev,
            to: '',
        }));
    };

    const handleRecipientToggle = (email) => {
        if (sendToAll || !email) return;

        setFormData((prev) => {
            const alreadySelected = prev.to.includes(email);

            return {
                ...prev,
                to: alreadySelected
                    ? prev.to.filter((item) => item !== email)
                    : [...prev.to, email],
            };
        });

        setErrors((prev) => ({
            ...prev,
            to: '',
        }));
    };

    const handleAttachmentsChange = (event) => {
        const selectedFiles = Array.from(event.target.files || []);

        setFormData((prev) => {
            const currentFiles = prev.attachments || [];

            const nextFiles = [...currentFiles];

            selectedFiles.forEach((file) => {
                const alreadyExists = nextFiles.some(
                    (currentFile) =>
                        currentFile.name === file.name &&
                        currentFile.size === file.size &&
                        currentFile.lastModified === file.lastModified,
                );

                if (!alreadyExists) {
                    nextFiles.push(file);
                }
            });

            return {
                ...prev,
                attachments: nextFiles,
            };
        });

        event.target.value = '';

        setErrors((prev) => ({
            ...prev,
            attachments: '',
        }));
    };

    const handleRemoveExistingAttachment = (attachmentToRemove) => {
        setFormData((prev) => ({
            ...prev,
            existing_attachments: prev.existing_attachments.filter(
                (attachment) => attachment !== attachmentToRemove,
            ),
        }));
    };

    const handleRemoveNewAttachment = (indexToRemove) => {
        setFormData((prev) => ({
            ...prev,
            attachments: prev.attachments.filter((_, index) => index !== indexToRemove),
        }));
    };

    const validateForm = () => {
        const nextErrors = { ...INITIAL_ERRORS };

        if (!formData.subject.trim()) {
            nextErrors.subject = 'El asunto es obligatorio.';
        }

        if (!formData.body.trim()) {
            nextErrors.body = 'El cuerpo del correo es obligatorio.';
        }

        if (!formData.to.length) {
            nextErrors.to = 'Debes seleccionar al menos un destinatario.';
        }

        if (shouldShowDate && !formData.scheduled_for) {
            nextErrors.scheduled_for = 'Debes seleccionar una fecha.';
        }

        if (shouldShowOffset && formData.offset_days === '') {
            nextErrors.offset_days = 'Debes indicar la cantidad de días.';
        }

        if (
            formData.trigger_type === 'relative_to_lease_start' ||
            formData.trigger_type === 'relative_to_lease_end'
        ) {
            const offsetDays = Number(formData.offset_days);

            if (Number.isNaN(offsetDays) || offsetDays < 0 || offsetDays > 30) {
                nextErrors.offset_days =
                    'Para esta configuración, los días deben estar entre 0 y 30.';
            }
        }

        if (formData.trigger_type === 'relative_to_payment_due') {
            const offsetDays = Number(formData.offset_days);

            if (Number.isNaN(offsetDays) || offsetDays < -30 || offsetDays > 30) {
                nextErrors.offset_days =
                    'Para esta configuración, los días deben estar entre -30 y 30.';
            }
        }

        if (formData.trigger_type === 'recurring') {
            const offsetDays = Number(formData.offset_days);

            if (Number.isNaN(offsetDays) || offsetDays <= 0) {
                nextErrors.offset_days =
                    'Para correos recurrentes, los días deben ser mayores a 0.';
            }
        }

        setErrors(nextErrors);

        return !Object.values(nextErrors).some(Boolean);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (isSaving) return;
        if (!validateForm()) return;

        const payload = {
            id: emailSchedule?.id,
            subject: formData.subject.trim(),
            body: formData.body.trim(),
            to: sendToAll ? ['*'] : formData.to,
            existing_attachments: formData.existing_attachments,
            attachments: formData.attachments,
            trigger_type: formData.trigger_type,
            scheduled_for: shouldShowDate ? formData.scheduled_for : null,
            offset_days: shouldShowOffset ? Number(formData.offset_days) : null,
            status: formData.status || 'active',
        };

        onSave?.(payload);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
                <header className="border-b border-slate-100 px-6 py-6 sm:px-8">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                                Configuración de correo
                            </p>

                            <h2 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">
                                Editar email automático
                            </h2>

                            <p className="mt-2 max-w-2xl text-sm text-slate-500">
                                Modifica destinatarios, contenido y valores asociados al envío.
                                El tipo de activación se muestra como referencia y no puede
                                cambiarse porque forma parte de una configuración permanente.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSaving}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                            aria-label="Cerrar modal"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </header>

                <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-6 sm:px-8">
                    <form id="edit-trigger-mail-form" onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
                                <div className="mb-4 flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                        <Settings className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900">
                                            Tipo de activación
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Esta configuración es permanente y no puede modificarse
                                            desde esta edición.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                    {TRIGGER_TABS.map((tab) => {
                                        const isActive = formData.trigger_type === tab.value;

                                        return (
                                            <button
                                                key={tab.value}
                                                type="button"
                                                disabled
                                                className={`rounded-2xl border px-3 py-3 text-left text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed ${isActive
                                                    ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-100'
                                                    : 'border-slate-200 bg-white text-slate-400 opacity-60'
                                                    }`}
                                                title="El tipo de activación no puede modificarse"
                                            >
                                                <span className="flex items-center justify-between gap-2">
                                                    {tab.label}

                                                    {isActive && <Check className="h-4 w-4 shrink-0" />}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {activeTab?.description && (
                                    <div className="mt-4 flex items-center gap-3 rounded-xl border border-amber-100 bg-white px-4 py-3 text-sm text-slate-600">
                                        <BadgeInfo size={28} className="shrink-0 text-amber-500" />
                                        {activeTab.description}
                                    </div>
                                )}

                                <div
                                    className={`overflow-hidden transition-all duration-200 ${shouldShowDate
                                        ? 'mt-4 max-h-40 opacity-100'
                                        : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <label
                                        htmlFor="scheduled_for"
                                        className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400"
                                    >
                                        Fecha
                                    </label>

                                    <div className="relative">
                                        <Calendar className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                                        <input
                                            id="scheduled_for"
                                            type="date"
                                            value={formData.scheduled_for}
                                            onChange={(event) =>
                                                updateField('scheduled_for', event.target.value)
                                            }
                                            disabled={isSaving}
                                            className={`h-13 w-full rounded-xl border bg-white py-3 pl-12 pr-4 text-slate-900 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100 ${errors.scheduled_for
                                                ? 'border-red-500'
                                                : 'border-slate-300'
                                                }`}
                                        />
                                    </div>

                                    {errors.scheduled_for && (
                                        <p className="mt-1 text-xs font-medium text-red-500">
                                            {errors.scheduled_for}
                                        </p>
                                    )}
                                </div>

                                <div
                                    className={`overflow-hidden transition-all duration-200 ${shouldShowOffset
                                        ? 'mt-4 max-h-40 opacity-100'
                                        : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <label
                                        htmlFor="offset_days"
                                        className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400"
                                    >
                                        {OFFSET_LABELS[formData.trigger_type]}
                                    </label>

                                    <input
                                        id="offset_days"
                                        type="number"
                                        value={formData.offset_days}
                                        placeholder={OFFSET_PLACEHOLDERS[formData.trigger_type]}
                                        onChange={(event) =>
                                            updateField('offset_days', event.target.value)
                                        }
                                        disabled={isSaving}
                                        className={`h-13 w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100 ${errors.offset_days ? 'border-red-500' : 'border-slate-300'
                                            }`}
                                    />

                                    {formData.trigger_type === 'relative_to_payment_due' && (
                                        <p className="mt-2 text-xs text-slate-500">
                                            Usa valores negativos para días antes de la facturación y
                                            positivos para días después.
                                        </p>
                                    )}

                                    {errors.offset_days && (
                                        <p className="mt-1 text-xs font-medium text-red-500">
                                            {errors.offset_days}
                                        </p>
                                    )}
                                </div>
                            </section>

                            <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                                <div className="mb-4 flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                                            <Users className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-slate-900">Destinatarios</h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Selecciona destinatarios individuales o envía a todos
                                                los clientes activos.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleSendToAllChange}
                                    disabled={isSaving}
                                    className={`mb-4 flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 ${sendToAll
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm'
                                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'
                                        }`}
                                >
                                    <span>
                                        <span className="block font-bold">
                                            Enviar a todos los clientes
                                        </span>

                                        <span className="mt-1 block text-sm text-slate-500">
                                            Se enviará a todos los clientes con contratos activos. La
                                            lista se resuelve desde el backend.
                                        </span>
                                    </span>

                                    <span
                                        className={`flex h-7 w-12 items-center rounded-full p-1 transition-all duration-200 ${sendToAll ? 'bg-emerald-500' : 'bg-slate-300'
                                            }`}
                                    >
                                        <span
                                            className={`h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${sendToAll ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                        />
                                    </span>
                                </button>

                                {!sendToAll && (
                                    <>
                                        <div className="relative mb-3">
                                            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                                            <input
                                                type="text"
                                                value={clientSearch}
                                                onChange={(event) => setClientSearch(event.target.value)}
                                                placeholder="Buscar cliente por nombre o correo..."
                                                disabled={isSaving || !validClients.length}
                                                className="h-12 w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                                            />
                                        </div>

                                        {!validClients.length && (
                                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                                                <p className="text-sm font-bold text-slate-700">
                                                    No hay clientes disponibles.
                                                </p>
                                            </div>
                                        )}

                                        {validClients.length > 0 && !filteredClients.length && (
                                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                                                <p className="text-sm font-bold text-slate-700">
                                                    Sin resultados
                                                </p>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    No encontramos clientes que coincidan con la búsqueda.
                                                </p>
                                            </div>
                                        )}

                                        {filteredClients.length > 0 && (
                                            <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
                                                {filteredClients.map((client) => {
                                                    const clientId = getClientId(client);
                                                    const clientName = getClientName(client);
                                                    const clientEmail = getClientEmail(client);
                                                    const isSelected = formData.to.includes(clientEmail);

                                                    return (
                                                        <button
                                                            key={clientId}
                                                            type="button"
                                                            disabled={isSaving}
                                                            onClick={() => handleRecipientToggle(clientEmail)}
                                                            className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 ${isSelected
                                                                ? 'border-emerald-500 bg-emerald-50'
                                                                : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
                                                                }`}
                                                        >
                                                            <span className="min-w-0">
                                                                <span className="block truncate font-semibold text-slate-800">
                                                                    {clientName}
                                                                </span>

                                                                <span className="block truncate text-sm text-slate-500">
                                                                    {clientEmail}
                                                                </span>
                                                            </span>

                                                            <span
                                                                className={`ml-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${isSelected
                                                                    ? 'border-emerald-500 bg-emerald-500 text-white'
                                                                    : 'border-slate-300 bg-white text-transparent'
                                                                    }`}
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </>
                                )}

                                {!sendToAll && selectedClients.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {selectedClients.map((client) => (
                                            <span
                                                key={getClientId(client)}
                                                className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                                            >
                                                {getClientName(client)}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {errors.to && (
                                    <p className="mt-2 text-xs font-medium text-red-500">
                                        {errors.to}
                                    </p>
                                )}
                            </section>

                            <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                                <div>
                                    <label
                                        htmlFor="subject"
                                        className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400"
                                    >
                                        Asunto
                                    </label>

                                    <input
                                        id="subject"
                                        type="text"
                                        value={formData.subject}
                                        placeholder="Escribe aquí el asunto"
                                        onChange={(event) =>
                                            updateField('subject', event.target.value)
                                        }
                                        disabled={isSaving}
                                        className={`h-13 w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100 ${errors.subject ? 'border-red-500' : 'border-slate-300'
                                            }`}
                                    />

                                    {errors.subject && (
                                        <p className="mt-1 text-xs font-medium text-red-500">
                                            {errors.subject}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="body"
                                        className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400"
                                    >
                                        Cuerpo
                                    </label>

                                    <textarea
                                        id="body"
                                        rows={6}
                                        value={formData.body}
                                        placeholder="Escribe el contenido del correo"
                                        onChange={(event) => updateField('body', event.target.value)}
                                        disabled={isSaving}
                                        className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100 ${errors.body ? 'border-red-500' : 'border-slate-300'
                                            }`}
                                    />

                                    {errors.body && (
                                        <p className="mt-1 text-xs font-medium text-red-500">
                                            {errors.body}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="attachments"
                                        className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400"
                                    >
                                        Archivos Adjuntos
                                    </label>

                                    {/* Input oculto para agregar archivos */}
                                    <input
                                        id="attachments"
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={handleAttachmentsChange}
                                        disabled={isSaving}
                                    />

                                    {/* Lista Unificada de Adjuntos */}
                                    {(() => {
                                        // Combinamos ambos arrays en un hook o renderizado inmediato
                                        const combinedAttachments = [
                                            ...formData.existing_attachments.map((att) => ({
                                                id: att,
                                                name: getAttachmentName(att),
                                                size: null, // Los archivos del servidor usualmente no traen el size directamente aquí
                                                isExisting: true,
                                                raw: att
                                            })),
                                            ...formData.attachments.map((file, index) => ({
                                                id: `new-${index}-${file.name}`,
                                                name: file.name,
                                                size: (file.size / 1024).toFixed(1) + ' KB',
                                                isExisting: false,
                                                raw: file
                                            }))
                                        ];

                                        if (combinedAttachments.length === 0) return null;

                                        return (
                                            <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                                <p className="text-sm font-bold text-slate-800">
                                                    Archivos en este correo
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    Visualiza, descarga o elimina los archivos adjuntos. Los nuevos se subirán al guardar.
                                                </p>

                                                <div className="mt-3 space-y-2">
                                                    {combinedAttachments.map((item, index) => {
                                                        // Lógica para descargar/previsualizar
                                                        const handleDownload = () => {
                                                            if (item.isExisting) {
                                                                onDownloadAttachment?.({
                                                                    emailScheduleId: emailSchedule?.id,
                                                                    path: item.raw,
                                                                });

                                                                return;
                                                            }

                                                            const blobUrl = URL.createObjectURL(item.raw);
                                                            const link = document.createElement('a');

                                                            link.href = blobUrl;
                                                            link.download = item.name;

                                                            document.body.appendChild(link);
                                                            link.click();
                                                            document.body.removeChild(link);

                                                            URL.revokeObjectURL(blobUrl);
                                                        };

                                                        return (
                                                            <div
                                                                key={item.id}
                                                                className={`flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-sm text-slate-600 border'
                                                                    }`}
                                                            >
                                                                <div className="min-w-0 flex-1">
                                                                    <span className="block truncate font-semibold text-slate-700">
                                                                        {item.name}
                                                                    </span>
                                                                    <span className="block text-xs text-slate-400">
                                                                        {item.isExisting ? (
                                                                            <span className="text-slate-400 font-medium">Archivo guardado</span>
                                                                        ) : (
                                                                            <span className="text-emerald-600 font-medium">Nuevo Adjunto • {item.size}</span>
                                                                        )}
                                                                    </span>
                                                                </div>

                                                                <div className="flex items-center gap-1 shrink-0">
                                                                    {/* Botón Descargar */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={handleDownload}
                                                                        disabled={item.isExisting && downloadPendingAttachmentPath === item.raw}
                                                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                                                        title="Descargar archivo"
                                                                    >
                                                                        {item.isExisting && downloadPendingAttachmentPath === item.raw ? (
                                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                                        ) : (
                                                                            <Download className="h-4 w-4" />
                                                                        )}
                                                                    </button>

                                                                    {/* Botón Eliminar */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            if (item.isExisting) {
                                                                                handleRemoveExistingAttachment(item.raw);
                                                                            } else {
                                                                                // Necesitamos encontrar el índice real dentro del array de nuevos adjuntos
                                                                                const newIndex = formData.attachments.indexOf(item.raw);
                                                                                if (newIndex !== -1) handleRemoveNewAttachment(newIndex);
                                                                            }
                                                                        }}
                                                                        disabled={isSaving}
                                                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                                        aria-label="Eliminar adjunto"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Zona Dropzone / Botón para añadir archivos */}
                                    <label
                                        htmlFor="attachments"
                                        className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition-all duration-200 ${isSaving
                                            ? 'cursor-not-allowed opacity-60'
                                            : 'cursor-pointer hover:border-emerald-400 hover:bg-emerald-50'
                                            }`}
                                    >
                                        <Paperclip className="mb-2 h-6 w-6 text-slate-500" />
                                        <span className="font-semibold text-slate-700">
                                            Agregar archivos
                                        </span>
                                        <span className="mt-1 text-sm text-slate-500">
                                            Haz clic para seleccionar nuevos archivos y sumarlos a la lista.
                                        </span>
                                    </label>

                                    {errors.attachments && (
                                        <p className="mt-1 text-xs font-medium text-red-500">
                                            {errors.attachments}
                                        </p>
                                    )}
                                </div>
                            </section>
                        </div>
                    </form>
                </div>

                <footer className="border-t border-slate-100 bg-white px-6 py-5 sm:px-8">
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSaving}
                            className="rounded-xl border-2 border-slate-200 px-4 py-3 text-base font-bold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            form="edit-trigger-mail-form"
                            disabled={isSaving}
                            className="flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-600 bg-emerald-500 px-4 py-3 text-base font-bold text-white shadow-lg shadow-emerald-100 transition-all duration-200 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isSaving ? (
                                <>
                                    Guardando
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                </>
                            ) : (
                                <>
                                    Guardar cambios
                                    <Save className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
}