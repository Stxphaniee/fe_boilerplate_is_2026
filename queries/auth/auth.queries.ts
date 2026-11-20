
"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/services/auth.service";

export const authKeys = {
  all: ["auth"] as const,

  me: () => [...authKeys.all, "me"] as const,
};

/**
 * Consulta la identidad y el rol del usuario actual.
 */
export function useCurrentUserQuery() {
  return useQuery({
    queryKey: authKeys.me(),

    queryFn: ({ signal }) =>
      getCurrentUser(signal),

    retry: false,
    staleTime: 30_000,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}
