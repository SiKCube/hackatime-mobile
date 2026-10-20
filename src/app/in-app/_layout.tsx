import { neon, THEME } from "@/components/theme";
import StatsCtxProvider from "@/features/stats-ctx/statsCtxProvider";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { ChartKitProvider } from "react-native-chart-kit/v2";

export default function AppTabLayout() {
  return (
    <ChartKitProvider preset={"neon"} mode="dark" presets={{ neon }}>
      <StatsCtxProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: THEME.darkless,
              borderWidth: 0
            },
            sceneStyle: {
              backgroundColor: THEME.darker,
            },
            tabBarActiveTintColor: THEME.primary,
            tabBarInactiveTintColor: THEME.secondary
          }}
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
            name="projects"
            options={{
              title: "Projects",
              tabBarIcon: ({ focused, color }) => focused ?
                <Ionicons name="list-circle" size={24} color={color} />
                :
                <Ionicons name="list-circle-outline" size={24} color={color} />
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
    </ChartKitProvider>
  )
}
