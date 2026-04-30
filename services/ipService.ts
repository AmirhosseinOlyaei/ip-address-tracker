import { AppError, IpGeoData } from "@/types"
const IPIFY_URL = "https://api.ipify.org?format=json"
const GEO_BASE = "https://ipapi.co"

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

  const url = `${GEO_BASE}/${encodeURIComponent(trimmed)}/json/`
  let res: Response

  try {
    res = await fetch(url, { headers: { Accept: "application/json" } })
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

  if (data.error) {
    if (data.reason === "private range" || data.reason === "reserved range") {
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
    ip: data.ip ?? trimmed,
    city: data.city ?? "Unknown",
    region: data.region ?? "Unknown",
    country: data.country_name ?? "Unknown",
    countryCode: data.country_code ?? "",
    zip: data.postal ?? "",
    lat: data.latitude,
    lon: data.longitude,
    timezone: data.timezone ?? "Unknown",
    isp: data.org ?? "Unknown",
    query: trimmed,
  }
}

export { AppServiceError, buildAppError }
