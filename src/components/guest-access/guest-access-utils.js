export function parseLocalDate(dateString) {
  if (!dateString || typeof dateString !== "string") return null;

  const normalizedDate = dateString.split("T")[0];
  const [year, month, day] = normalizedDate.split("-").map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

export function formatDate(dateString) {
  const date = parseLocalDate(dateString);
  if (!date) return "-";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function getGuestStatus(endDateString) {
  const endDate = parseLocalDate(endDateString);
  if (!endDate) return "expired";

  const today = new Date();
  const todayAtMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  if (endDate < todayAtMidnight) {
    return "expired";
  }

  return "active";
}

export function getGuestPresentation(guest) {
  const status = getGuestStatus(guest?.end_date);

  return {
    ...guest,
    status,
    formattedStartDate: formatDate(guest?.start_date),
    formattedEndDate: formatDate(guest?.end_date),
    canRenew: status === "expired",
    canEnd: status === "active",
  };
}

export function getStatusConfig(status) {
  if (status === "expired") {
    return {
      label: "Expirado",
      badgeClassName: "bg-rose-100 text-rose-500",
      textClassName: "text-rose-500",
      dotClassName: "bg-rose-500",
    };
  }

  return {
    label: "Activo",
    badgeClassName: "bg-emerald-100 text-emerald-700",
    textClassName: "text-emerald-700",
    dotClassName: "bg-emerald-500",
  };
}