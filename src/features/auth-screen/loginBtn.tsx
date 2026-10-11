import { Link } from "expo-router"
import { Button, Text, View } from "react-native"
import { useAuthCtx } from "../auth-ctx/auth-ctx-provider"

export default function LoginBtn() {
  const { startLogin, userApikey, userToken, loading, error, logout } = useAuthCtx()

  return (
    <View>
      <Text>
        {error}
      </Text>
      {
        userApikey && userToken ?
          <>
            <Link href={"/in-app"}>
              Enter
            </Link>
            <Button
              title="Logout"
              onPress={logout}
              disabled={loading}
            />
          </>
          :
          <Button
            title="Login"
            onPress={startLogin}
            disabled={loading}
          />
      }
    </View>
  )
}