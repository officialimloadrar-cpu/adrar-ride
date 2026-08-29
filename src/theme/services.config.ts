import { SERVICE_COLORS } from "./colors";

export const SERVICES = {
  corsa: {
    id: "corsa",
    color: SERVICE_COLORS.corsa,
    bg: `${SERVICE_COLORS.corsa}15`,
  },
  colis: {
    id: "colis",
    color: SERVICE_COLORS.colis,
    bg: `${SERVICE_COLORS.colis}15`,
  },
} as const;

export type ServiceId = keyof typeof SERVICES;