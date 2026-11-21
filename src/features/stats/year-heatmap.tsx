import Alert from "@/components/alert";
import StyledCard from "@/components/ui/card";
import StyledText from "@/components/ui/text";
import { useState } from "react";
import { ScrollView } from "react-native";
import { SvgUri } from "react-native-svg";
import { useStatsCtx } from "./context/statsCtxProvider";

export default function YearHeatMap({ labels }: { labels?: boolean }) {
  const { username } = useStatsCtx()
  const [error, setError] = useState<string | null>(null)

  return (
    <StyledCard>
      <StyledText weight="bold" size={20}>Development Activity</StyledText>
      <StyledText size={15} type="seconday">Last 365 days</StyledText>
      <Alert type="error" msg={error} />
      {
        !error ?
          <ScrollView
            horizontal>
            <SvgUri
              width={700}
              height={150}
              uri={`https://heatmap.shymike.dev/?id=${username}&year=current&labels=${labels ? labels : false}`}
              onError={(e) => setError(`${e}`)}
            />
          </ScrollView>
          :
          null
      }
    </StyledCard>
  )
}