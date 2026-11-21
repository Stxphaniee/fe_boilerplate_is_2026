import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { NotificationPreferencesView } from "@/components/notifications/notification-preferences-view";

export default async function NotificationPreferencesPage() {
  const token = await getSession();
  if (!token) {
    redirect("/login");
  }

  return <NotificationPreferencesView />;
}
