import { Colors, Radius, Shadow, Spacing, Typography } from "@/constants/theme"
import { useColorScheme } from "@/hooks/use-color-scheme"
import { AppError } from "@/types"
import { Ionicons } from "@expo/vector-icons"
import React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface ErrorBannerProps {
  error: AppError
  onRetry?: () => void
}

export function ErrorBanner({ error, onRetry }: ErrorBannerProps) {
  const scheme = useColorScheme() ?? "light"
  const c = Colors[scheme]

  const iconName =
    error.code === "NETWORK"
      ? "wifi-outline"
      : error.code === "NOT_FOUND"
        ? "location-outline"
        : error.code === "RATE_LIMIT"
          ? "time-outline"
          : "alert-circle-outline"

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: `${c.error}18`,
          borderColor: `${c.error}40`,
          shadowColor: c.shadow,
          ...Shadow.sm,
        },
      ]}
    >
      <Ionicons name={iconName} size={18} color={c.error} />
      <Text style={[styles.message, { color: c.error }]} numberOfLines={2}>
        {error.message}
      </Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={[styles.retryBtn, { borderColor: c.error }]}
          accessibilityRole="button"
          accessibilityLabel="Retry"
        >
          <Text style={[styles.retryText, { color: c.error }]}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  message: {
    flex: 1,
    ...Typography.bodySm,
    lineHeight: 18,
  },
  retryBtn: {
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  retryText: {
    ...Typography.headingSm,
    fontSize: 12,
  },
})
