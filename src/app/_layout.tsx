import { THEME } from "@/components/theme";
import AuthContextProvider, { useAuthCtx } from "@/features/auth-ctx/auth-ctx-provider";
import { SplashScreenController } from "@/features/auth-ctx/splash-screen-controler";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <RootNavigator />
      <SplashScreenController />
    </AuthContextProvider>
  );
}

function RootNavigator() {
  const { user, userApikey, userToken } = useAuthCtx()
  const islogin = (user && userApikey && userToken) ? true : false

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: THEME.darker
        }
      }}
    >
      <Stack.Protected guard={!islogin}>
        <Stack.Screen name="index" />
      </Stack.Protected>
      <Stack.Protected guard={islogin}>
        <Stack.Screen name="in-app" />
      </Stack.Protected>
    </Stack>
  )
}
