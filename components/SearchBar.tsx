import { Colors, Radius, Shadow, Spacing, Typography } from "@/constants/theme"
import { useColorScheme } from "@/hooks/use-color-scheme"
import { Ionicons } from "@expo/vector-icons"
import React, { useCallback, useRef, useState } from "react"
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"

interface SearchBarProps {
  onSearch: (query: string) => void
  loading: boolean
}

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const scheme = useColorScheme() ?? "light"
  const c = Colors[scheme]
  const [value, setValue] = useState("")
  const inputRef = useRef<TextInput>(null)
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || loading) return
    inputRef.current?.blur()
    onSearch(trimmed)
  }, [value, loading, onSearch])

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 })
  }
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 })
  }

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        {
          backgroundColor: c.surface,
          borderColor: c.border,
          shadowColor: c.shadow,
          ...Shadow.md,
        },
      ]}
    >
      <Ionicons
        name="search"
        size={18}
        color={c.icon}
        style={styles.searchIcon}
      />
      <TextInput
        ref={inputRef}
        style={[styles.input, { color: c.text }]}
        placeholder="Search IP address or domain..."
        placeholderTextColor={c.textMuted}
        value={value}
        onChangeText={setValue}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        clearButtonMode="while-editing"
        selectionColor={c.tint}
      />
      <Pressable
        onPress={handleSubmit}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={loading || !value.trim()}
        style={[
          styles.button,
          {
            backgroundColor: c.tint,
            opacity: !value.trim() || loading ? 0.5 : 1,
          },
        ]}
        accessibilityLabel="Search"
        accessibilityRole="button"
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        )}
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.xs,
    paddingVertical: Spacing.xs,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.bodyLg,
    paddingVertical: Spacing.sm,
    minHeight: 36,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.xs,
  },
})
