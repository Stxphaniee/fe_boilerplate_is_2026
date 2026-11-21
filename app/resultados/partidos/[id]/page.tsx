
import type { Metadata } from "next";

import {
  ResultDetailView,
} from "@/components/results/result-detail-view";

export const metadata: Metadata = {
  title: "Detalle del partido | Liga Amateur",
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ResultMatchPage({
  params,
}: Props) {
  const { id } = await params;

  return <ResultDetailView matchId={id} />;
}
