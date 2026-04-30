import { Colors } from "@/constants/theme"
import { useColorScheme } from "@/hooks/use-color-scheme"
import { Ionicons } from "@expo/vector-icons"
import { Tabs } from "expo-router"
import React from "react"

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light"
  const c = Colors[colorScheme]

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.tint,
        tabBarInactiveTintColor: c.tabIconDefault,
        tabBarStyle: {
          backgroundColor: c.surface,
          borderTopColor: c.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          letterSpacing: 0.3,
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tracker",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
