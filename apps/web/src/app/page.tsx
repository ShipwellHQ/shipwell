import { cookies } from "next/headers";
import { HomeSwitch } from "@/components/home-switch";

export default async function HomePage() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.has("__session");
  return <HomeSwitch hasSession={hasSession} />;
}
