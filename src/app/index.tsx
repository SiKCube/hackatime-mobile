import LoginCard from "@/features/auth-screen/login-card";
import Socials from "@/features/auth-screen/socials";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <LoginCard />
      <Socials />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 20
  },
});
