import { Text, View } from "react-native"
import { useAuthCtx } from "./auth-ctx-provider"
import { getSecure } from "./secure-save"
import { SECURE_KEYS_TYPE, TESTING } from "../../../consts"

export default function AuthLogger() {
  const { userApikey, userToken, user, error, loading } = useAuthCtx()
  const islogin = (user && userApikey && userToken) ? true : false

  
  const getget = async (securekey: SECURE_KEYS_TYPE) => {
    const r = await getSecure(securekey)
    
    return r ? r : "NULL"
  }

  if (TESTING) return (
    <View>
      <Text>
        Auth Context Values
      </Text>
      <Text>
        Current user API_KEY: {userApikey ? userApikey : "NULL"}
      </Text>
      <Text>
        Current stored user API_KEY: {getget("apikey")}
      </Text>
      <Text>
        Current user token: {userToken ? userToken : "NULL"}
      </Text>
      <Text>
        Current stored token: {getget("oauth-token")}
      </Text>

      <Text>
        User metadata:
      </Text>
      <Text>
        {JSON.stringify(user)}
      </Text>
      
      <Text>
        Auth Context states
      </Text>
      <Text>
        Loading: {loading}
        Error: {error}
        Autenticated?: {String(islogin)}
      </Text>
    </View>
  )

  return null
}