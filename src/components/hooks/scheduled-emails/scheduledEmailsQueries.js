import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../config/api';

export const scheduledEmailsQueryKey = ['scheduled-emails'];

export const scheduledEmailRunsQueryKey = (scheduleId) => [
    'scheduled-email-runs',
    scheduleId,
];

const EMAIL_SCHEDULES_ENDPOINT = '/email_schedules';
const EMAIL_SCHEDULES_RUNS_ENDPOINT = '/email_schedules_runs';

// OBTENER SCHEDULED EMAILS
const getScheduledEmailsRequest = async () => {
    const { data } = await api.get(EMAIL_SCHEDULES_ENDPOINT);
    return data;
};

export function useScheduledEmails() {
    return useQuery({
        queryKey: scheduledEmailsQueryKey,
        queryFn: getScheduledEmailsRequest,
    });
}

// OBTENER RUNS
const getScheduledEmailRunsRequest = async (scheduleId) => {
    const { data } = await api.get(`${EMAIL_SCHEDULES_RUNS_ENDPOINT}/${scheduleId}`);
    return data;
};

export function useEmailScheduleRuns(scheduleId, enabled = true) {
    return useQuery({
        queryKey: scheduledEmailRunsQueryKey(scheduleId),
        queryFn: () => getScheduledEmailRunsRequest(scheduleId),
        enabled: Boolean(scheduleId && enabled),
    });
}

// CREAR SCHEDULED EMAIL
const postScheduledEmailsRequest = async (payload) => {
    const formData = new FormData();

    // 1. Manejo correcto de listas de strings (to)
    if (Array.isArray(payload.to)) {
        payload.to.forEach(email => formData.append("to", email));
    } else {
        formData.append("to", payload.to);
    }

    formData.append("subject", payload.subject);
    formData.append("body", payload.body);
    formData.append("trigger_type", payload.trigger_type);

    // 2. Manejo correcto de archivos (attachments)
    if (payload.attachments && payload.attachments.length > 0) {
        payload.attachments.forEach(file => {
            formData.append("attachments", file); // Aquí se añade el archivo binario real
        });
    }

    // 3. Evitar enviar "null" como string para campos opcionales
    if (payload.offset_days !== null && payload.offset_days !== undefined) {
        formData.append("offset_days", payload.offset_days);
    }

    if (payload.scheduled_for !== null && payload.scheduled_for !== undefined) {
        formData.append("scheduled_for", payload.scheduled_for);
    }

    // 4. ENVIAR formData e indicar el Content-Type correcto
    const { data } = await api.post(EMAIL_SCHEDULES_ENDPOINT, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return data;
};

export function useCreateScheduledEmail() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postScheduledEmailsRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: scheduledEmailsQueryKey,
            });
        },
    });
}

// ACTUALIZAR SCHEDULED EMAIL
const patchScheduledEmailRequest = async (payload) => {
    const formData = new FormData();

    formData.append("subject", payload.subject);
    formData.append("body", payload.body);
    formData.append("trigger_type", payload.trigger_type);
    formData.append("status", payload.status);

    payload.to.forEach((recipient) => {
        formData.append('to', recipient);
    });

    payload.existing_attachments.forEach((attachment) => {
        formData.append('existing_attachments', attachment);
    });

    payload.attachments.forEach((file) => {
        formData.append('attachments', file);
    });

    if (payload.offset_days !== null && payload.offset_days !== undefined) {
        formData.append('offset_days', payload.offset_days);
    }

    if (payload.scheduled_for !== null && payload.scheduled_for !== undefined) {
        formData.append("scheduled_for", payload.scheduled_for);
    }

    // 1. Manejo correcto de listas de strings (to)
    // if (Array.isArray(payload.to)) {
    //     payload.to.forEach(email => formData.append("to", email));
    // } else {
    //     formData.append("to", payload.to);
    // }

    // 2. Manejo correcto de archivos (attachments)
    // if (payload.attachments && payload.attachments.length > 0) {
    //     payload.attachments.forEach(file => {
    //         formData.append("attachments", file); // Aquí se añade el archivo binario real
    //     });
    // }

    const { data } = await api.patch(
        `${EMAIL_SCHEDULES_ENDPOINT}/${payload.id}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return data;
};

export function useUpdateScheduledEmail() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: patchScheduledEmailRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: scheduledEmailsQueryKey,
            });
        }
    });
}

// ACTIVAR / DESACTIVAR SCHEDULED EMAIL
const postScheduledEmailStatusRequest = async ({ id, action }) => {
    console.log(`${EMAIL_SCHEDULES_ENDPOINT}/${id}/${action}`)
    const { data } = await api.post(`${EMAIL_SCHEDULES_ENDPOINT}/${id}/${action}`);
    return data;
};

export function useToggleScheduledEmailStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, action }) => postScheduledEmailStatusRequest({ id, action }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: scheduledEmailsQueryKey,
            });
        },
    });
}

// ELIMINAR SCHEDULED EMAIL
const deleteScheduledEmailRequest = async (id) => {
    const { data } = await api.delete(`${EMAIL_SCHEDULES_ENDPOINT}/${id}`);
    return data;
};

export function useDeleteScheduledEmail() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (email) => deleteScheduledEmailRequest(email.id),
        onSuccess: (_, deletedEmail) => {
            queryClient.invalidateQueries({
                queryKey: scheduledEmailsQueryKey,
            });

            queryClient.removeQueries({
                queryKey: scheduledEmailRunsQueryKey(deletedEmail.id),
            });
        },
    });
}

// DESCARGAR ARCHIVO ADJUNTO DE SCHEDULED EMAIL
const getFilenameFromContentDisposition = (contentDisposition) => {
    if (!contentDisposition) return null;

    const utf8Match = contentDisposition.match(/filename\*=UTF-8''(.+)/i);
    if (utf8Match?.[1]) {
        return decodeURIComponent(utf8Match[1]);
    }

    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
    return filenameMatch?.[1] || null;
};

const getFilenameFromPath = (path) => {
    return path?.split(/[\\/]/).pop() || 'archivo-adjunto';
};

const downloadScheduledEmailAttachmentRequest = async ({ emailScheduleId, path }) => {
    const response = await api.get(
        `${EMAIL_SCHEDULES_ENDPOINT}/${emailScheduleId}/attachments/download`,
        {
            params: { path },
            responseType: 'blob',
        }
    );

    const contentDisposition = response.headers?.['content-disposition'];

    const filename =
        getFilenameFromContentDisposition(contentDisposition) ||
        getFilenameFromPath(path);

    const blobUrl = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(blobUrl);

    return true;
};

export function useDownloadScheduledEmailAttachment() {
    return useMutation({
        mutationFn: downloadScheduledEmailAttachmentRequest,
    });
}