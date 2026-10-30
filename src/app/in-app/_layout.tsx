import StatsCtxProvider from "@/features/stats/context/statsCtxProvider";
import { useTheme } from "@/features/theme/context/theme-ctx-provider";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { ChartKitProvider } from "react-native-chart-kit/v2";

export default function AppTabLayout() {
  const { themeData, chartTheme } = useTheme()

  return (
    <ChartKitProvider preset={"chartTheme"} presets={{ chartTheme }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: themeData.darkless,
              borderWidth: 0
            },
            sceneStyle: {
              backgroundColor: themeData.darker,
            },
            tabBarActiveTintColor: themeData.primary,
            tabBarInactiveTintColor: themeData.secondary
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
              title: "Goals",
              tabBarIcon: ({ focused, color }) => focused ?
                <Ionicons name="flame" size={24} color={color} />
                :
                <Ionicons name="flame-outline" size={24} color={color} />
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: "Settings",
              tabBarIcon: ({ focused, color }) => focused ?
                <Ionicons name="settings" size={24} color={color} />
                :
                <Ionicons name="settings-outline" size={24} color={color} />
            }}
          />
        </Tabs>
    </ChartKitProvider>
  )
}
