import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Locating...' }: LoadingOverlayProps) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  return (
    <View style={[styles.container, { backgroundColor: c.mapOverlay }]} pointerEvents="none">
      <ActivityIndicator size="large" color={c.tint} />
      <Text style={[styles.text, { color: c.textSecondary }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    zIndex: 10,
  },
  text: {
    ...Typography.bodyMd,
  },
});
