import axios from "axios";
import { makeRedirectUri, ResponseType, useAuthRequest } from "expo-auth-session";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

const AUTH_URL = "https://hackatime.hackclub.com/oauth/authorize"
const REVOKE_URL = "https://hackatime.hackclub.com/oauth/revoke"
const TOKEN_URL = "https://hackatime.hackclub.com/oauth/token"

export default function Auth() {
  if (!process.env.OAUTH_APP_UUID) throw Error("OAUTH_APP_UUID doesnt exist")

  const [request, response, promntSync] = useAuthRequest({
    clientId: process.env.OAUTH_APP_UUID,
    redirectUri: makeRedirectUri(),
    responseType: ResponseType.Code,
    scopes: ["profile",],
  }, {
    authorizationEndpoint: AUTH_URL,
    revocationEndpoint: REVOKE_URL,
  })
  const [token, setToken] = useState()

  useEffect(() => {
    const fetchToken = async (codeSend: string) => {
      const { data, status } = await axios.request({
        method: 'POST',
        url: TOKEN_URL,
        params: {
          client_id: process.env.OAUTH_APP_UUID,
          code: codeSend,
          grant_type: 'authorization_code',
          redirect_uri: 'hackatimemobile://'
        },
      })
      console.log(data)

      if (status === 200) {
        setToken(data)
      }
    }

    if (response && response.type === "success") {
      const code = response.params.code

      console.warn("TOKEN: " + JSON.stringify(code))

      fetchToken(code)
    }
  }, [response])

  return (
    <View>
      <Button
        title={"Login"}
        onPress={() => promntSync()}
        disabled={!request}
      />
      <Button
        title="Send"
        onPress={async () => {
          const { data } = await axios.request({
            url: `https://hackatime.hackclub.com/api/v1/users/sikcube/projects`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            },
          })

          console.log(JSON.stringify(data))
        }}
        disabled={!token}
      />
      <Text>
        {JSON.stringify(token)}
      </Text>
    </View>
  )
}