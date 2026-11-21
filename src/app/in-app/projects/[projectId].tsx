import { useAuthCtx } from "@/features/auth-ctx/auth-ctx-provider";
import ProjectPanel from "@/features/stat-panel/project-panel";
import StatsCtxProvider from "@/features/stats/context/statsCtxProvider";

export default function Details() {
  const { user, userApikey } = useAuthCtx()

  return (
    <StatsCtxProvider username={user?.username} userApikey={userApikey}>
      <ProjectPanel />
    </StatsCtxProvider>
  )
}