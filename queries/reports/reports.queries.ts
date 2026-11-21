import { useQuery } from "@tanstack/react-query";
import { getPaymentsReport } from "@/services/reports.service";

export const reportKeys = {
  all: ["reports"] as const,
  payments: () => [...reportKeys.all, "payments"] as const,
};

export function usePaymentsReportQuery(enabled: boolean) {
  return useQuery({
    queryKey: reportKeys.payments(),
    queryFn: getPaymentsReport,
    enabled,
    retry: false,
  });
}
