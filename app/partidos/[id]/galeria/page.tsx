import { MatchGalleryView } from "@/components/gallery/match-gallery-view";

export default async function MatchGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MatchGalleryView matchId={id} />;
}
