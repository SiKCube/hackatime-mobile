import { useAuthCtx } from "@/features/auth-ctx/auth-ctx-provider";
import GeneralPanel from "@/features/stat-panel/general-panel";
import StatsCtxProvider from "@/features/stats/context/statsCtxProvider";

export default function HomeScreen() {
  const { user, userApikey } = useAuthCtx()

  return (
    <StatsCtxProvider username={user?.username} userApikey={userApikey}>
      <GeneralPanel />
    </StatsCtxProvider>
  )
}