import { Form, Users, Handshake, Boxes, Ticket, History, Scale, Mail } from "lucide-react";

const ROLES = {
  ADMIN: "admin",
  CLIENT: "client",
};

export const NAV_ITEMS = [
  {
    key: "leases",
    to: "/leases",
    icon: Form,
    label: "Arriendos",
    roles: [ROLES.CLIENT],
  },
  {
    key: "visits",
    to: "/visits",
    icon: Users,
    label: "Visitas",
    roles: [ROLES.CLIENT],
  },
  {
    key: "help",
    to: "/help",
    icon: Handshake,
    label: "Ayuda",
    roles: [ROLES.CLIENT],
  },
  {
    key: "warehouses",
    to: "/warehouses",
    icon: Boxes,
    label: "Bodegas",
    roles: [ROLES.ADMIN],
  },
  {
    key: "clients",
    to: "/clients",
    icon: Users,
    label: "Clientes",
    roles: [ROLES.ADMIN],
  },
  {
    key: "tickets",
    to: "/tickets",
    icon: Ticket,
    label: "Tickets",
    roles: [ROLES.ADMIN],
  },
  {
    key: "monitor",
    to: "/monitor",
    icon: History,
    label: "Registros",
    roles: [ROLES.ADMIN],
  },
  {
    key: "regulation",
    to: "/regulation",
    icon: Scale,
    label: "Reglamento",
    roles: [ROLES.ADMIN],
  },
  {
    key: "emails",
    to: "/emails",
    icon: Mail,
    label: "Emails",
    roles: [ROLES.ADMIN],
  },
];