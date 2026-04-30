import { Colors } from "@/constants/theme"
import { useColorScheme } from "@/hooks/use-color-scheme"
import { IpGeoData } from "@/types"
import React, { useEffect, useRef } from "react"
import { StyleSheet, View } from "react-native"
import MapView, {
  MapViewProps,
  Marker,
  PROVIDER_DEFAULT,
} from "react-native-maps"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"

interface MapContainerProps {
  data: IpGeoData | null
}

const DELTA = 0.05

export function MapContainer({ data }: MapContainerProps) {
  const scheme = useColorScheme() ?? "light"
  const c = Colors[scheme]
  const mapRef = useRef<MapView>(null)

  const pulseScale = useSharedValue(1)
  const pulseOpacity = useSharedValue(0.6)

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(2.2, { duration: 900 }),
        withTiming(1, { duration: 900 }),
      ),
      -1,
      false,
    )
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 900 }),
        withTiming(0.6, { duration: 0 }),
      ),
      -1,
      false,
    )
  }, [pulseScale, pulseOpacity])

  useEffect(() => {
    if (data && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: data.lat,
          longitude: data.lon,
          latitudeDelta: DELTA,
          longitudeDelta: DELTA,
        },
        600,
      )
    }
  }, [data])

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }))

  const mapProps: Partial<MapViewProps> = {
    mapType: scheme === "dark" ? "mutedStandard" : "standard",
    showsUserLocation: false,
    showsCompass: true,
    showsScale: true,
    showsBuildings: true,
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: data?.lat ?? 37.7749,
          longitude: data?.lon ?? -122.4194,
          latitudeDelta: DELTA,
          longitudeDelta: DELTA,
        }}
        {...mapProps}
      >
        {data && (
          <Marker
            coordinate={{ latitude: data.lat, longitude: data.lon }}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={false}
          >
            <View style={styles.markerContainer}>
              <Animated.View
                style={[styles.pulse, { backgroundColor: c.tint }, pulseStyle]}
              />
              <View
                style={[
                  styles.markerOuter,
                  { backgroundColor: `${c.tint}30`, borderColor: c.tint },
                ]}
              >
                <View
                  style={[styles.markerInner, { backgroundColor: c.tint }]}
                />
              </View>
            </View>
          </Marker>
        )}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  pulse: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  markerOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  markerInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
})
