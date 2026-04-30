import { Platform } from "react-native"

export const Colors = {
  light: {
    text: "#0F172A",
    textSecondary: "#475569",
    textMuted: "#94A3B8",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceElevated: "#FFFFFF",
    border: "#E2E8F0",
    borderSubtle: "#F1F5F9",
    tint: "#0EA5E9",
    tintSecondary: "#7C3AED",
    accent: "#06B6D4",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    icon: "#64748B",
    tabIconDefault: "#94A3B8",
    tabIconSelected: "#0EA5E9",
    mapOverlay: "rgba(248,250,252,0.92)",
    cardBlur: "rgba(255,255,255,0.85)",
    shadow: "#0F172A",
    gradientStart: "#0EA5E9",
    gradientEnd: "#7C3AED",
    statusBar: "dark" as const,
  },
  dark: {
    text: "#F1F5F9",
    textSecondary: "#94A3B8",
    textMuted: "#475569",
    background: "#0F172A",
    surface: "#1E293B",
    surfaceElevated: "#1E293B",
    border: "#334155",
    borderSubtle: "#1E293B",
    tint: "#38BDF8",
    tintSecondary: "#A78BFA",
    accent: "#22D3EE",
    success: "#34D399",
    warning: "#FBBF24",
    error: "#F87171",
    icon: "#94A3B8",
    tabIconDefault: "#475569",
    tabIconSelected: "#38BDF8",
    mapOverlay: "rgba(15,23,42,0.92)",
    cardBlur: "rgba(30,41,59,0.88)",
    shadow: "#000000",
    gradientStart: "#0EA5E9",
    gradientEnd: "#7C3AED",
    statusBar: "light" as const,
  },
}

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
}

export const Shadow = {
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  lg: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 10,
  },
}

export const Typography = {
  displayLg: { fontSize: 32, fontWeight: "700" as const, letterSpacing: -0.5 },
  displayMd: { fontSize: 26, fontWeight: "700" as const, letterSpacing: -0.3 },
  headingLg: { fontSize: 20, fontWeight: "600" as const, letterSpacing: -0.2 },
  headingMd: { fontSize: 17, fontWeight: "600" as const },
  headingSm: { fontSize: 15, fontWeight: "600" as const },
  bodyLg: { fontSize: 17, fontWeight: "400" as const },
  bodyMd: { fontSize: 15, fontWeight: "400" as const },
  bodySm: { fontSize: 13, fontWeight: "400" as const },
  labelLg: {
    fontSize: 12,
    fontWeight: "600" as const,
    letterSpacing: 0.8,
    textTransform: "uppercase" as const,
  },
  labelMd: {
    fontSize: 11,
    fontWeight: "600" as const,
    letterSpacing: 0.6,
    textTransform: "uppercase" as const,
  },
  mono: {
    fontSize: 15,
    fontFamily: Platform.select({
      ios: "Menlo",
      android: "monospace",
      default: "monospace",
    }),
    fontWeight: "500" as const,
  },
}
