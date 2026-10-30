import StyledCard from "@/components/ui/card";
import StyledText from "@/components/ui/text";
import ProfileCard from "@/features/profile/profile-card";
import { useTheme } from "@/features/theme/context/theme-ctx-provider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const { push } = useRouter()
  const { themeData, theme } = useTheme()

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ gap: 20, padding: 20 }}>
        <StyledText weight="bold" size={20}><StyledText weight="bold" type="primary" size={20}>Your</StyledText> Settings</StyledText>
        
        <ProfileCard />
        
        <TouchableOpacity onPress={() => push({
          pathname: "/in-app/settings/theme"
        })}>
          <StyledCard>
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
              <StyledText size={20} weight="bold">Pick a theme</StyledText>
              <Ionicons name="open-outline" size={20} color={themeData.surface_content} />
            </View>
            <StyledText type="seconday">The same themes of the original hackatime website.</StyledText>
            <StyledText type="seconday">Current theme: <StyledText weight="bold" type="primary">{theme}</StyledText></StyledText>
          </StyledCard>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}