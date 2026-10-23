import axios from "axios";
import { makeRedirectUri, ResponseType, revokeAsync, useAuthRequest } from "expo-auth-session";
import { createContext, useContext, useEffect, useState } from "react";
import { getStoredData, killAllStoredData, storeData } from "../storage";
import { getSecure, killSecures, saveSecure } from "./secure-save";
import { router } from "expo-router"
import { STORE_KEYS } from "../../../consts";

interface AuthContextType {
  userToken: string | null,
  userApikey: string | null,
  user: UserMetadata | null,
  loading: boolean,
  error: string | null,
  startLogin: () => void,
  logout: () => void
}

interface UserMetadata {
  id: string
  username: string
  display_name: string
  full_name: string
  photo: string
  timezone: string
  created_at: string
  modified_at: string
  plan: string
}

const AuthContext = createContext<AuthContextType>({
  userToken: null,
  userApikey: null,
  user: null,
  loading: false,
  error: null,
  startLogin: () => { },
  logout: () => { }
})

const APP_UUID = "hNxiOrqENsDE7pZhxLsXbK7p0-1B6KCOO7XsK7peb3c"
const AUTH_URL = "https://hackatime.hackclub.com/oauth/authorize"
const OAUTH_REVOKE_URL = "https://hackatime.hackclub.com/oauth/revoke"
const OAUTH_TOKEN_URL = "https://hackatime.hackclub.com/oauth/token"

const DISCOVERY = {
  authorizationEndpoint: AUTH_URL,
  revocationEndpoint: OAUTH_REVOKE_URL,
}

const getOauthToken = async (codeSend: string) => {
  const { data, status } = await axios.request({
    method: 'POST',
    url: OAUTH_TOKEN_URL,
    params: {
      client_id: APP_UUID,
      code: codeSend,
      grant_type: 'authorization_code',
      redirect_uri: 'hackatimemobile://'
    },
  })

  if (status !== 200) throw Error(`Can't get access token, error code: ${status}`)

  const oauthToken: string = data.access_token

  if (!oauthToken) throw Error("Access token not found")

  return oauthToken
}

const getApikey = async (oauthToken: string) => {
  const { data, status } = await axios.request({
    method: "GET",
    url: "https://hackatime.hackclub.com/api/v1/authenticated/api_keys",
    headers: {
      Authorization: `Bearer ${oauthToken}`
    }
  })

  if (status !== 200) throw Error("Can't get API_KEY")

  const apikey: string = data.token

  if (!apikey) throw Error("API_KEY not found in data fetched")

  return apikey
}

const getUserMetadata = async (oauthtoken: string, apikey: string): Promise<UserMetadata> => {
  const authMe = await axios.request({
    method: "GET",
    url: "https://hackatime.hackclub.com/api/v1/authenticated/me",
    headers: {
      Authorization: `Bearer ${oauthtoken}`
    }
  })

  const userId = authMe.data.id

  if (!userId || authMe.status !== 200) throw Error("Can't get userId")

  const { data, status } = await axios.request({
    method: "GET",
    url: `https://hackatime.hackclub.com/api/hackatime/v1/users/${userId}`,
    headers: {
      Authorization: `Bearer ${apikey}`
    },
    params: {
      api_key: apikey
    }
  })

  if (status !== 200) throw Error("Can't get user metadata")

  const usermetadata: UserMetadata = data.data

  if (!usermetadata) throw Error("Empty user metadata")

  return usermetadata
}

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null)
  const [userApikey, setUserApiKey] = useState<string | null>(null)
  const [user, setUser] = useState<UserMetadata | null>(null)

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [request, response, promntSync] = useAuthRequest({
    clientId: APP_UUID,
    redirectUri: makeRedirectUri(),
    responseType: ResponseType.Code,
    scopes: ["profile",],
  }, DISCOVERY)

  // init
  useEffect(() => {
    const getStoredAuthData = async () => {
      try {
        setLoading(true)
        setError(null)

        const storedUserToken = await getSecure("oauth-token")
        const storedUserApikey = await getSecure("apikey")
        const usermetadata = await getStoredData(STORE_KEYS.usermetadata)

        if (usermetadata && storedUserApikey && storedUserToken) {
          const parseUserMetadata: UserMetadata = JSON.parse(usermetadata)

          setUser(parseUserMetadata)
          setUserApiKey(storedUserApikey)
          setUserToken(storedUserToken)
          router.replace("/in-app")
        } else {
          await killSecures()
          await killAllStoredData()

          setUser(null)
          setUserApiKey(null)
          setUserToken(null)
        }

        setLoading(false)
      } catch (e) {
        setLoading(false)
        setError("When getting stored auth: " + e)
      }
    }

    getStoredAuthData()
  }, [])

  // auth handler
  useEffect(() => {
    const fetchTokens = async (codeSend: string) => {
      try {
        setLoading(true)
        setError(null)

        const oauthToken = await getOauthToken(codeSend)

        const apikey = await getApikey(oauthToken)

        const usermetadata = await getUserMetadata(oauthToken, apikey)

        await saveSecure("oauth-token", oauthToken)
        setUserToken(oauthToken)

        await saveSecure("apikey", apikey)
        setUserApiKey(apikey)

        await storeData("usermetadata", JSON.stringify(usermetadata))
        setUser(usermetadata)

        setLoading(false)
        router.replace("/in-app")
      } catch (e) {
        setLoading(false)
        setError(`Error when handling auth: ${e}`)
      }
    }

    if (response && response.type === "success" && !userToken && !userApikey) {
      const code = response.params.code
      fetchTokens(code)
    } else if (response && (response.type === "cancel" || response.type === "dismiss")) {
      setError(`You ${response.type} the autentication`)
    } else if (response && response.type === "error") {
      setError("Something broke while auth")
    } else if (response && response.type === "locked") {
      setError("Auth process is locked")
    }
  }, [response])

  const startLogin = () => promntSync()
  const logout = async () => {
    if (userToken && userApikey) {
      try {
        setLoading(true)

        const success = await revokeAsync({
          clientId: APP_UUID,
          token: userToken,
          scopes: ["profile"],
        }, DISCOVERY)

        if (!success) {
          setLoading(false)
          setError(`Error on logout`)
          return
        }

        await killSecures()

        setUserToken(null)
        setUserApiKey(null)

        setLoading(false)
      } catch (e) {
        setLoading(false)
        setError(`Upps: ${e}`)
      }
    }
  }

  return (
    <AuthContext.Provider value={{
      userToken, userApikey, user,
      loading, error,
      startLogin, logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthCtx = () => useContext(AuthContext)
