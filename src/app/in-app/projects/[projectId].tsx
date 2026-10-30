import ProjectPanel from "@/features/stat-panel/project-panel";
import StatsCtxProvider from "@/features/stats/context/statsCtxProvider";

export default function Details() {
  return (
    <StatsCtxProvider>
      <ProjectPanel />
    </StatsCtxProvider>
  )
}