import { IpTrackerProvider } from "@/context/IpTrackerContext"
import { Stack } from "expo-router"
import "react-native-reanimated"

export const unstable_settings = {
  anchor: "(tabs)",
}

export default function RootLayout() {
  return (
    <IpTrackerProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </IpTrackerProvider>
  )
}
