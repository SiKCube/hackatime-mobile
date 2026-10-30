import AuthContextProvider, { useAuthCtx } from "@/features/auth-ctx/auth-ctx-provider";
import { SplashScreenController } from "@/features/auth-ctx/splash-screen-controler";
import ThemeProvider, { useTheme } from "@/features/theme/context/theme-ctx-provider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthContextProvider>
        <RootNavigator />
        <SplashScreenController />
      </AuthContextProvider>
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { user, userApikey, userToken } = useAuthCtx()
  const islogin = (user && userApikey && userToken) ? true : false
  const { themeData } = useTheme()

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: themeData.darker
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
