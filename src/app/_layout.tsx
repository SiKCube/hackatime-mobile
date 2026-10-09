import AuthContextProvider from "@/features/auth-ctx/auth-ctx-provider";
import { Stack } from "expo-router";


export default function RootLayout() {
  return (
    <AuthContextProvider>
      <Stack />
    </AuthContextProvider>
  );
}
