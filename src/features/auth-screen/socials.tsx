import StyledTextLink from "@/components/ui/text-link";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

export default function Socials() {
  return (
    <View style={{ flexDirection: "row", gap: "10", width: "100%", justifyContent: "space-evenly" }}>
      <StyledTextLink href={"https://github.com/SiKCube"}>
        <Ionicons name="logo-github" size={25} />
      </StyledTextLink>
      <StyledTextLink href={"https://x.com/sikcube"}>
        <Ionicons name="logo-x" size={25} />
      </StyledTextLink>
      <StyledTextLink href={"https://github.com/SiKCube/hackatime-mobile"}>
        <Ionicons name="code-slash" size={25} />
      </StyledTextLink>
    </View>
  )
}