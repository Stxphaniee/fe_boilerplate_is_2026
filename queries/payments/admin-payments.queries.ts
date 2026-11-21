import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminPayments,
  updateTeamSuspension,
} from "@/services/admin-payments.service";
import type { AdminPaymentFilter } from "@/types/admin-payments.types";

export const adminPaymentsKeys = {
  all: ["admin-payments"] as const,
  list: (estado: AdminPaymentFilter) => [...adminPaymentsKeys.all, estado] as const,
};

export function useAdminPaymentsQuery(
  estado: AdminPaymentFilter,
  enabled: boolean,
) {
  return useQuery({
    queryKey: adminPaymentsKeys.list(estado),
    queryFn: () => getAdminPayments(estado),
    enabled,
    retry: false,
  });
}

export function useTeamSuspensionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTeamSuspension,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminPaymentsKeys.all });
    },
  });
}