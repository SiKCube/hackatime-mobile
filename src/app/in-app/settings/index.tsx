import StyledLinkButton from "@/components/ui/button-link";
import StyledText from "@/components/ui/text";
import ProfileCard from "@/features/profile/profile-card";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ gap: 20, padding: 20 }}>
        <StyledText weight="bold" size={20}><StyledText weight="bold" type="primary" size={20}>Your</StyledText> Settings</StyledText>
        
        <ProfileCard />
        
        <StyledLinkButton text="Select a theme" type="primary" href={{
          pathname: "/in-app/settings/theme"
        }} />
      </ScrollView>
    </SafeAreaView>
  )
}