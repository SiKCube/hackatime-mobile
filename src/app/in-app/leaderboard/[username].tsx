import StyledText from "@/components/ui/text";
import ProfilePanel from "@/features/stat-panel/profile-panel";
import StatsCtxProvider from "@/features/stats/context/statsCtxProvider";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function OtherProfile() {
  const { username }: { username: string } = useLocalSearchParams()

  return (
    <Stack.Screen
      options={{
        headerTitle: props => (<View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Image
            style={{
              borderRadius: 100,
              width: 35,
              height: 35,
            }}
            source={{
              uri: `${username.split("|")[2]}`
            }}
          />
          <StyledText weight="bold">{`${username.split("|")[1]}`}</StyledText>
        </View>),
      }}
    >
      <StatsCtxProvider username={username.split("|")[0]} userApikey={null}>
        <ProfilePanel />
      </StatsCtxProvider>
    </Stack.Screen>
  )
}