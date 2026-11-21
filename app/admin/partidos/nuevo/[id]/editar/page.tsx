
import { MatchEditView } from "@/components/matches/match-edit-view";

interface MatchEditPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    jornadaId?: string | string[];
  }>;
}

export default async function MatchEditPage({
  params,
  searchParams,
}: MatchEditPageProps) {
  const [{ id }, query] = await Promise.all([
    params,
    searchParams,
  ]);

  const initialRoundId = Array.isArray(query.jornadaId)
    ? query.jornadaId[0]
    : query.jornadaId;

  return (
    <MatchEditView
      matchId={id}
      initialRoundId={initialRoundId}
    />
  );
}
