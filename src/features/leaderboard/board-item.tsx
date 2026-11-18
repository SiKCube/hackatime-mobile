import StyledCard from "@/components/ui/card";
import StyledText from "@/components/ui/text";
import { Image } from "expo-image";
import { View } from "react-native";
import { gethoursAndMinutes } from "../stats/get-stats";
import { Entries } from "./types";

export default function BoardItem({ rank, user, total_seconds }: Entries) {
  return (
    <StyledCard>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 7, alignItems: "center" }}>
          <StyledText type="primary" weight="bold" size={20}>{rank}</StyledText>
          <Image
            style={{ width: 30, height: 30, borderRadius: 100 }}
            source={{
              uri: user.avatar_url,
            }}
          />
          <StyledText weight="bold">{user.username}</StyledText>
        </View>
        <StyledText weight="bold">{gethoursAndMinutes(total_seconds)}</StyledText>
      </View>
    </StyledCard>
  )
}