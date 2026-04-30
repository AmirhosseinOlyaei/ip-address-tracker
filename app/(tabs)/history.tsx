import { HistoryListItem } from "@/components/HistoryListItem"
import { Colors, Radius, Spacing, Typography } from "@/constants/theme"
import { useIpTracker } from "@/context/IpTrackerContext"
import { useColorScheme } from "@/hooks/use-color-scheme"
import { HistoryEntry } from "@/types"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import React, { useCallback } from "react"
import {
  Alert,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function HistoryScreen() {
  const scheme = useColorScheme() ?? "light"
  const c = Colors[scheme]
  const { history, lookup, removeEntry, clearSearchHistory } = useIpTracker()
  const router = useRouter()

  const handlePress = useCallback(
    (entry: HistoryEntry) => {
      lookup(entry.query)
      router.navigate("/(tabs)")
    },
    [lookup, router],
  )

  const handleDeleteEntry = useCallback(
    (id: string) => {
      removeEntry(id)
    },
    [removeEntry],
  )

  const handleClearAll = useCallback(() => {
    if (history.length === 0) return
    Alert.alert(
      "Clear History",
      "This will permanently delete all search history. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => clearSearchHistory(),
        },
      ],
    )
  }, [history.length, clearSearchHistory])

  const renderItem: ListRenderItem<HistoryEntry> = useCallback(
    ({ item }) => (
      <HistoryListItem
        entry={item}
        onPress={handlePress}
        onDelete={handleDeleteEntry}
      />
    ),
    [handlePress, handleDeleteEntry],
  )

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
          <View style={styles.headerRow}>
            <View style={styles.headerTextBlock}>
              <Text style={styles.headerTitle}>Search History</Text>
              <Text style={styles.headerSubtitle}>
                {history.length === 0
                  ? "No searches yet"
                  : `${history.length} saved ${history.length === 1 ? "search" : "searches"}`}
              </Text>
            </View>
            {history.length > 0 && (
              <TouchableOpacity
                onPress={handleClearAll}
                style={styles.clearBtn}
                accessibilityRole="button"
                accessibilityLabel="Clear all history"
              >
                <Ionicons
                  name="trash-outline"
                  size={16}
                  color="rgba(255,255,255,0.9)"
                />
                <Text style={styles.clearBtnText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>

      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={[styles.emptyIcon, { backgroundColor: `${c.tint}15` }]}>
            <Ionicons name="time-outline" size={40} color={c.tint} />
          </View>
          <Text style={[styles.emptyTitle, { color: c.text }]}>
            No history yet
          </Text>
          <Text style={[styles.emptyBody, { color: c.textSecondary }]}>
            Your IP and domain searches will appear here once you start
            exploring.
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={null}
        />
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
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  headerTextBlock: {
    flex: 1,
  },
  headerTitle: {
    ...Typography.displayMd,
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    ...Typography.bodyMd,
    color: "rgba(255,255,255,0.80)",
    marginTop: 2,
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  clearBtnText: {
    ...Typography.headingSm,
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
  },
  list: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: Radius.xl,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    ...Typography.headingLg,
  },
  emptyBody: {
    ...Typography.bodyMd,
    textAlign: "center",
    lineHeight: 22,
  },
})
