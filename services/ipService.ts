import { AppError, IpGeoData } from "@/types"
import { Platform } from "react-native"

const IPIFY_URL = "https://api.ipify.org?format=json"
const GEO_FIELDS =
  "status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,query"
const GEO_BASE_NATIVE = "http://ip-api.com/json"
const GEO_PROXY_WEB = "/.netlify/functions/geo"
const IS_LOCALHOST =
  Platform.OS === "web" &&
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")

function buildAppError(e: unknown): AppError {
  if (e instanceof TypeError && e.message.toLowerCase().includes("network")) {
    return {
      code: "NETWORK",
      message: "No internet connection. Please check your network.",
    }
  }
  if (e instanceof AppServiceError) {
    return e.appError
  }
  return {
    code: "UNKNOWN",
    message: "An unexpected error occurred. Please try again.",
  }
}

class AppServiceError extends Error {
  appError: AppError
  constructor(appError: AppError) {
    super(appError.message)
    this.appError = appError
  }
}

export async function getOwnIp(): Promise<string> {
  const res = await fetch(IPIFY_URL)
  if (!res.ok)
    throw new AppServiceError({
      code: "NETWORK",
      message: "Failed to detect your IP.",
    })
  const json = await res.json()
  return json.ip as string
}

export async function lookupIp(query: string): Promise<IpGeoData> {
  const trimmed = query.trim()
  if (!trimmed) {
    throw new AppServiceError({
      code: "INVALID_QUERY",
      message: "Please enter an IP address or domain.",
    })
  }

  const url =
    Platform.OS !== "web" || IS_LOCALHOST
      ? `${GEO_BASE_NATIVE}/${encodeURIComponent(trimmed)}?fields=${GEO_FIELDS}`
      : `${GEO_PROXY_WEB}?q=${encodeURIComponent(trimmed)}`
  let res: Response

  try {
    res = await fetch(url)
  } catch {
    throw new AppServiceError({
      code: "NETWORK",
      message: "No internet connection. Please check your network.",
    })
  }

  if (res.status === 429) {
    throw new AppServiceError({
      code: "RATE_LIMIT",
      message: "Too many requests. Please wait a moment.",
    })
  }

  if (!res.ok) {
    throw new AppServiceError({
      code: "UNKNOWN",
      message: `Server error (${res.status}). Please try again.`,
    })
  }

  const data = await res.json()

  if (data.status === "fail") {
    if (data.message === "private range" || data.message === "reserved range") {
      throw new AppServiceError({
        code: "NOT_FOUND",
        message:
          "This IP address is private/reserved and cannot be geolocated.",
      })
    }
    throw new AppServiceError({
      code: "INVALID_QUERY",
      message: `Could not locate "${trimmed}". Check the IP or domain and try again.`,
    })
  }

  return {
    ip: data.query ?? trimmed,
    city: data.city ?? "Unknown",
    region: data.regionName ?? data.region ?? "Unknown",
    country: data.country ?? "Unknown",
    countryCode: data.countryCode ?? "",
    zip: data.zip ?? "",
    lat: data.lat,
    lon: data.lon,
    timezone: data.timezone ?? "Unknown",
    isp: data.isp ?? "Unknown",
    query: trimmed,
  }
}

export { AppServiceError, buildAppError }
