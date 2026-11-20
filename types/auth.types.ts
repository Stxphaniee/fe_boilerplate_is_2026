
export type UserRole =
  | "JUGADOR"
  | "CAPITAN"
  | "ARBITRO"
  | "ORGANIZADOR"
  | "ADMINISTRADOR";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export type CalendarRole = Extract<
  UserRole,
  "JUGADOR" | "CAPITAN"
>;

export function isCalendarRole(
  role: unknown,
): role is CalendarRole {
  return role === "JUGADOR" || role === "CAPITAN";
}
