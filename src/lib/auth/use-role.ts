export type Role = "admin" | "viewer" | null;

export function getRole(): Role {
  if (typeof window === "undefined") return null;
  const unlocked = sessionStorage.getItem("unlocked");
  if (unlocked !== "true") return null;
  return (sessionStorage.getItem("role") as Role) || null;
}

export function isAdmin(): boolean {
  return getRole() === "admin";
}

export function isViewer(): boolean {
  return getRole() === "viewer";
}
