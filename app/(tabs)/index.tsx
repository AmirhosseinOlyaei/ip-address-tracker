import { ErrorBanner } from "@/components/ErrorBanner"
import { IpInfoCard } from "@/components/IpInfoCard"
import { LoadingOverlay } from "@/components/LoadingOverlay"
import { MapContainer } from "@/components/MapContainer"
import { SearchBar } from "@/components/SearchBar"
import { Colors, Radius, Shadow, Spacing, Typography } from "@/constants/theme"
import { useIpTracker } from "@/context/IpTrackerContext"
import { useColorScheme } from "@/hooks/use-color-scheme"
import { LinearGradient } from "expo-linear-gradient"
import { StatusBar } from "expo-status-bar"
import React, { useCallback } from "react"
import { StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function TrackerScreen() {
  const scheme = useColorScheme() ?? "light"
  const c = Colors[scheme]
  const { current, status, error, lookup, lookupSelf } = useIpTracker()

  const handleSearch = useCallback(
    (query: string) => {
      lookup(query)
    },
    [lookup],
  )

  const handleRetry = useCallback(() => {
    if (current) {
      lookup(current.query)
    } else {
      lookupSelf()
    }
  }, [current, lookup, lookupSelf])

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <StatusBar style={c.statusBar} />

      <LinearGradient
        colors={[c.gradientStart, c.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SafeAreaView edges={["top"]} style={styles.headerInner}>
          <Text style={styles.headerTitle}>IP Tracker</Text>
          <Text style={styles.headerSubtitle}>
            {current
              ? `${current.city}, ${current.country}`
              : "Detecting your location\u2026"}
          </Text>
          <View style={styles.searchWrapper}>
            <SearchBar onSearch={handleSearch} loading={status === "loading"} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      {error && status === "error" && (
        <ErrorBanner error={error} onRetry={handleRetry} />
      )}

      <View style={styles.mapWrapper}>
        <MapContainer data={current} />
        {status === "loading" && <LoadingOverlay />}
      </View>

      {current && (
        <View style={[styles.cardWrapper, { shadowColor: c.shadow }]}>
          <IpInfoCard data={current} />
        </View>
      )}

      {!current && status !== "loading" && status !== "error" && (
        <View
          style={[
            styles.emptyCard,
            { backgroundColor: c.surface, borderColor: c.border, ...Shadow.md },
          ]}
        >
          <Text style={[styles.emptyText, { color: c.textSecondary }]}>
            Enter an IP address or domain above to get started.
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    zIndex: 2,
  },
  headerInner: {
    paddingTop: Spacing.sm,
    paddingBottom: 0,
  },
  headerTitle: {
    ...Typography.displayMd,
    color: "#FFFFFF",
    textAlign: "center",
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    ...Typography.bodyMd,
    color: "rgba(255,255,255,0.80)",
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  searchWrapper: {
    paddingBottom: Spacing.md,
  },
  mapWrapper: {
    flex: 1,
    position: "relative",
  },
  cardWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  emptyCard: {
    position: "absolute",
    bottom: Spacing.xl,
    left: Spacing.md,
    right: Spacing.md,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: "center",
    zIndex: 5,
  },
  emptyText: {
    ...Typography.bodyMd,
    textAlign: "center",
    lineHeight: 22,
  },
})
