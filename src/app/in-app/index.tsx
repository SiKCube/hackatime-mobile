import GeneralPanel from "@/features/stat-panel/general-panel";
import StatsCtxProvider from "@/features/stats/context/statsCtxProvider";

export default function HomeScreen() {
  return (
    <StatsCtxProvider>
      <GeneralPanel />
    </StatsCtxProvider>
  )
}