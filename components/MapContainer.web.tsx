import { Colors } from "@/constants/theme"
import { useColorScheme } from "@/hooks/use-color-scheme"
import { IpGeoData } from "@/types"
import React, { useEffect, useRef } from "react"
import { StyleSheet, View } from "react-native"

interface MapContainerProps {
  data: IpGeoData | null
}

const DEFAULT_LAT = 37.7749
const DEFAULT_LON = -122.4194
const DEFAULT_ZOOM = 11
const DETAIL_ZOOM = 13

function buildLeafletHtml(
  lat: number,
  lon: number,
  zoom: number,
  dark: boolean,
  tint: string,
): string {
  const tiles = dark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
  const attribution = '&copy; <a href="https://carto.com/">CARTO</a>'

  return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body, #map { width: 100%; height: 100%; background: ${dark ? "#1a1a2e" : "#e8f4fd"}; }
          .pulse-marker {
            position: relative;
            width: 20px;
            height: 20px;
          }
          .pulse-ring {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 20px; height: 20px;
            border-radius: 50%;
            background: ${tint};
            opacity: 0.4;
            animation: pulse 1.8s ease-out infinite;
          }
          .pulse-dot {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 12px; height: 12px;
            border-radius: 50%;
            background: ${tint};
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          }
          @keyframes pulse {
            0%   { transform: translate(-50%,-50%) scale(1); opacity: 0.5; }
            100% { transform: translate(-50%,-50%) scale(3.5); opacity: 0; }
          }
          .leaflet-control-attribution { font-size: 9px !important; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', { zoomControl: true, attributionControl: true }).setView([${lat}, ${lon}], ${zoom});
          L.tileLayer('${tiles}', { attribution: '${attribution}', maxZoom: 19 }).addTo(map);

          var pulseIcon = L.divIcon({
            className: '',
            html: '<div class="pulse-marker"><div class="pulse-ring"></div><div class="pulse-dot"></div></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });

          var marker = L.marker([${lat}, ${lon}], { icon: pulseIcon }).addTo(map);

          window.addEventListener('message', function(e) {
            try {
              var d = JSON.parse(e.data);
              if (d.type === 'UPDATE_LOCATION') {
                map.flyTo([d.lat, d.lon], ${DETAIL_ZOOM}, { duration: 1.2 });
                marker.setLatLng([d.lat, d.lon]);
              }
            } catch(err) {}
          });
        </script>
      </body>
    </html>`
}

export function MapContainer({ data }: MapContainerProps) {
  const scheme = useColorScheme() ?? "light"
  const c = Colors[scheme]
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const lat = data?.lat ?? DEFAULT_LAT
  const lon = data?.lon ?? DEFAULT_LON

  useEffect(() => {
    if (data && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          type: "UPDATE_LOCATION",
          lat: data.lat,
          lon: data.lon,
        }),
        "*",
      )
    }
  }, [data])

  const html = buildLeafletHtml(
    lat,
    lon,
    data ? DETAIL_ZOOM : DEFAULT_ZOOM,
    scheme === "dark",
    c.tint,
  )

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <iframe
        ref={iframeRef}
        srcDoc={html}
        style={styles.iframe as React.CSSProperties}
        title="IP Location Map"
        sandbox="allow-scripts"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iframe: {
    width: "100%",
    height: "100%",
    borderWidth: 0,
    flex: 1,
  },
})
