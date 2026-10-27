import Alert from "@/components/alert"
import StyledButton from "@/components/ui/button"
import StyledCard from "@/components/ui/card"
import StyledText from "@/components/ui/text"
import StyledTextLink from "@/components/ui/text-link"
import { Image } from "expo-image"
import { View } from "react-native"
import { useAuthCtx } from "../auth-ctx/auth-ctx-provider"

export default function LoginCard() {
  const { startLogin, loading, error } = useAuthCtx()

  return (
    <>
      <View style={{ width: "100%" }}>
        <Alert
          msg={error}
          type="error"
        />
      </View>
      <StyledCard>
        <View style={{ gap: 30 }}>
          <View style={{ justifyContent: "center", alignItems: "center", gap: 10 }}>
            <Image
              source={require("@/assets/hackatime-mobile.png")}
              style={{ width: 200, height: 200 }}
            />
            <StyledText textAling="center" weight="bold" size={20}>Welcome to <StyledText weight="bold" size={20} type="primary">Hackatime Mobile</StyledText></StyledText>
          </View>
          <View style={{ gap: 20 }}>
            <StyledText type="seconday">
              Start by logging in with your <StyledTextLink href={"https://hackatime.hackclub.com/"} type="primary">Hackatime account</StyledTextLink>.
            </StyledText>
            <StyledButton
              text={loading ? "Logging In..." : "Log In"}
              type="primary"
              onClick={startLogin}
              disable={loading}
            />
          </View>
        </View>
      </StyledCard>
    </>
  )
}
