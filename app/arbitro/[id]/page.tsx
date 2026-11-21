import {
  MatchLiveView,
} from "@/components/referee/match-live-view";

interface MatchLivePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MatchLivePage({
  params,
}: MatchLivePageProps) {
  const { id } = await params;

  return <MatchLiveView matchId={id} />;
}