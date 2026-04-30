import React, { useCallback } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { HistoryEntry } from '@/types';

interface HistoryListItemProps {
  entry: HistoryEntry;
  onPress: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function HistoryListItem({ entry, onPress, onDelete }: HistoryListItemProps) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => { scale.value = withSpring(0.97, { damping: 15 }); };
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 15 }); };

  const handlePress = useCallback(() => onPress(entry), [entry, onPress]);
  const handleDelete = useCallback(() => onDelete(entry.id), [entry.id, onDelete]);

  const { data } = entry;
  const location = [data.city, data.region, data.countryCode].filter(Boolean).join(', ');

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.container, {
          backgroundColor: c.surface,
          borderColor: c.border,
          shadowColor: c.shadow,
          ...Shadow.sm,
        }]}
        accessibilityRole="button"
        accessibilityLabel={`Re-lookup ${entry.query}`}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${c.tint}15` }]}>
          <Ionicons name="location" size={18} color={c.tint} />
        </View>

        <View style={styles.content}>
          <Text style={[styles.query, { color: c.text }]} numberOfLines={1}>{entry.query}</Text>
          <Text style={[styles.location, { color: c.textSecondary }]} numberOfLines={1}>{location}</Text>
          <Text style={[styles.isp, { color: c.textMuted }]} numberOfLines={1}>{data.isp}</Text>
        </View>

        <View style={styles.right}>
          <Text style={[styles.time, { color: c.textMuted }]}>{formatTimeAgo(entry.timestamp)}</Text>
          <TouchableOpacity
            onPress={handleDelete}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Delete entry"
            style={[styles.deleteBtn, { backgroundColor: `${c.error}15` }]}
          >
            <Ionicons name="trash-outline" size={14} color={c.error} />
          </TouchableOpacity>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  query: {
    ...Typography.headingSm,
  },
  location: {
    ...Typography.bodySm,
  },
  isp: {
    ...Typography.bodySm,
    fontSize: 11,
  },
  right: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  time: {
    ...Typography.labelMd,
    fontSize: 10,
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
