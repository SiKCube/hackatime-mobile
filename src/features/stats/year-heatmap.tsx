import Alert from "@/components/alert";
import { useState } from "react";
import { ScrollView } from "react-native";
import { SvgUri } from "react-native-svg";
import { useAuthCtx } from "../auth-ctx/auth-ctx-provider";
import StyledCard from "@/components/ui/card";
import StyledText from "@/components/ui/text";

export default function YearHeatMap() {
  const { user } = useAuthCtx()
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
              width={1000}
              height={150}
              uri={`https://heatmap.shymike.dev/?id=${user?.id}&timezone=America/La_Paz`}
              onError={(e) => setError(`${e}`)}
            />
          </ScrollView>
          :
          null
      }
    </StyledCard>
  )
}