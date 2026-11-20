
import type { Metadata } from "next";

import {
  ResultsListView,
} from "@/components/results/results-list-view";

export const metadata: Metadata = {
  title: "Resultados públicos | Liga Amateur",
};

export default function ResultsPage() {
  return <ResultsListView />;
}
