import Alert from "@/components/alert"
import StyledButton from "@/components/ui/button"
import StyledCard from "@/components/ui/card"
import StyledText from "@/components/ui/text"
import StyledTextLink from "@/components/ui/text-link"
import { Image } from "expo-image"
import { View } from "react-native"
import { useAuthCtx } from "../auth-ctx/auth-ctx-provider"
import LoadingSpinner from "@/components/loading-spinner"
import Appi18n from "@/i18n/i18n"

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
            <StyledText textAling="center" weight="bold" size={20}>{Appi18n.t("main.welcome")}
              <StyledText weight="bold" size={20} type="primary"> Hackatime Mobile</StyledText>
            </StyledText>
          </View>
          <View style={{ gap: 20 }}>
            <StyledText type="seconday">
              {Appi18n.t("main.start-by")}
              <StyledTextLink href={"https://hackatime.hackclub.com/"} type="primary"> {Appi18n.t("main.link-to-hackatime")}</StyledTextLink>.
            </StyledText>
            <StyledButton
              text={loading ? Appi18n.t("loading") : Appi18n.t("login")}
              type="primary"
              onClick={startLogin}
              disable={loading}
            >
              {loading && <LoadingSpinner size={"small"} />}
            </StyledButton>
          </View>
        </View>
      </StyledCard>
    </>
  )
}
