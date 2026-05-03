# Reflection — IP Address Tracker

## Development Process

This project began as a React Native mobile app built with Expo, targeting iOS as the primary platform. The architecture centered on a clean separation of concerns: a context-based state layer (`IpTrackerContext`), a typed service layer (`ipService.ts`), and platform-aware UI components. File-based routing via Expo Router kept navigation declarative and minimal.

## Challenges Faced

The most significant challenge was **cross-platform compatibility**. `react-native-maps` works natively on iOS but has no web support, requiring a platform-specific web fallback using Leaflet embedded in an iframe. A second major challenge was **CORS**. Browser security blocks direct calls to most free geolocation APIs from a web origin — `freeipapi.com`, `ipapi.co`, and the HTTP version of `ip-api.com` all failed at some point due to CORS restrictions or rate limits during development.

Deployment surfaced another issue: `netlify dev` auto-detected Expo and expected a legacy port (19006), causing startup failures that required manually overriding the framework and target port.

## Solutions Implemented

For the map, a `.web.tsx` platform extension resolved the split cleanly without any conditional imports in shared code. For CORS, the final solution was a **Netlify serverless function** (`netlify/functions/geo.js`) acting as a server-side proxy — the browser calls the function, which calls `ip-api.com` directly with no CORS exposure. A `IS_LOCALHOST` flag in `ipService.ts` bypasses the proxy during local development, hitting `ip-api.com` HTTP directly instead.

## Potential Improvements

- Add a map tile toggle (satellite vs. street view) on web
- Implement rate-limit awareness with exponential backoff
- Add IPv6 display formatting
- Support bulk lookups from a CSV upload
- Add unit tests for `ipService.ts` error paths
