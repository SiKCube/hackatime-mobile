import LoadingSpinner from "@/components/loading-spinner";
import StyledButton from "@/components/ui/button";
import StyledCard from "@/components/ui/card";
import StyledText from "@/components/ui/text";
import { Image } from "expo-image";
import { Redirect } from "expo-router";
import { View } from "react-native";
import { useAuthCtx } from "../auth-ctx/auth-ctx-provider";

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function ProfileCard() {
  const { user, userApikey, logout, loading } = useAuthCtx()

  if (user && userApikey) return (
    <StyledCard>
      <View style={{ flexDirection: "row", gap: 10, alignItems: "center", marginBottom: 10 }}>
        <Image
          style={{ width: 100, height: 100 }}
          source={{
            uri: user.photo
          }}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={500}
        />
        <View>
          <StyledText weight="bold" size={20}>{user.display_name}</StyledText>
          <StyledText type="seconday">{user.username}</StyledText>
        </View>
      </View>
      <StyledButton type="error" text={loading ? "Loging out..." : "Log out"} disable={loading} onClick={() => logout()}>
        {loading && <LoadingSpinner size={"small"} />}
      </StyledButton>
    </StyledCard>
  )

  return <Redirect href={"/"} />
}
