import StatsCtxProvider from "@/features/stats-ctx/statsCtxProvider";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function AppTabLayout() {
  return (
    <StatsCtxProvider>
      <Tabs
        screenOptions={{
          headerShown: false
        }
        }
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ focused, color }) => focused ?
              <Ionicons name="home" size={24} color={color} />
              :
              <Ionicons name="home-outline" size={24} color={color} />
          }}
        />
        <Tabs.Screen
          name="streak"
          options={{
            title: "Racha",
            tabBarIcon: ({ focused, color }) => focused ?
              <Ionicons name="flame" size={24} color={color} />
              :
              <Ionicons name="flame-outline" size={24} color={color} />
          }}
        />
        <Tabs.Screen
          name="programs"
          options={{
            title: "Programs",
            tabBarIcon: ({ focused, color }) => focused ?
              <Ionicons name="calendar-clear" size={24} color={color} />
              :
              <Ionicons name="calendar-clear-outline" size={24} color={color} />
          }}
        />
        <Tabs.Screen
          name="my-mail"
          options={{
            title: "Mails",
            tabBarIcon: ({ focused, color }) => focused ?
              <Ionicons name="mail" size={24} color={color} />
              :
              <Ionicons name="mail-outline" size={24} color={color} />
          }}
        />
      </Tabs>
    </StatsCtxProvider>
  )
}
