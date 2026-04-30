import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IpGeoData } from '@/types';

interface IpInfoCardProps {
  data: IpGeoData;
}

interface InfoFieldProps {
  label: string;
  value: string;
  iconName: keyof typeof Ionicons.glyphMap;
  tintColor: string;
  textColor: string;
  secondaryColor: string;
  borderColor: string;
  isLast?: boolean;
}

function InfoField({ label, value, iconName, tintColor, textColor, secondaryColor, borderColor, isLast }: InfoFieldProps) {
  return (
    <View style={[styles.field, !isLast && { borderRightWidth: 1, borderRightColor: borderColor }]}>
      <View style={styles.fieldIcon}>
        <Ionicons name={iconName} size={14} color={tintColor} />
        <Text style={[styles.fieldLabel, { color: secondaryColor }]}>{label}</Text>
      </View>
      <Text style={[styles.fieldValue, { color: textColor }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
        {value || '—'}
      </Text>
    </View>
  );
}

export function IpInfoCard({ data }: IpInfoCardProps) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  const cardContent = (
    <View style={styles.row}>
      <InfoField
        label="IP Address"
        value={data.ip}
        iconName="globe-outline"
        tintColor={c.tint}
        textColor={c.text}
        secondaryColor={c.textSecondary}
        borderColor={c.border}
      />
      <InfoField
        label="Location"
        value={`${data.city}, ${data.countryCode}`}
        iconName="location-outline"
        tintColor={c.tint}
        textColor={c.text}
        secondaryColor={c.textSecondary}
        borderColor={c.border}
      />
      <InfoField
        label="Timezone"
        value={data.timezone.replace('/', ' / ')}
        iconName="time-outline"
        tintColor={c.tint}
        textColor={c.text}
        secondaryColor={c.textSecondary}
        borderColor={c.border}
      />
      <InfoField
        label="ISP"
        value={data.isp}
        iconName="server-outline"
        tintColor={c.tint}
        textColor={c.text}
        secondaryColor={c.textSecondary}
        borderColor={c.border}
        isLast
      />
    </View>
  );

  const containerStyle = [
    styles.container,
    {
      shadowColor: c.shadow,
      borderColor: c.border,
      ...Shadow.lg,
    },
  ];

  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={scheme === 'dark' ? 60 : 80}
        tint={scheme === 'dark' ? 'dark' : 'light'}
        style={containerStyle}
      >
        {cardContent}
      </BlurView>
    );
  }

  return (
    <View style={[containerStyle, { backgroundColor: c.cardBlur }]}>
      {cardContent}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  field: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
    gap: 6,
  },
  fieldIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fieldLabel: {
    ...Typography.labelMd,
  },
  fieldValue: {
    ...Typography.headingSm,
    lineHeight: 20,
  },
});
