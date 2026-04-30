exports.handler = async (event) => {
  const query = event.queryStringParameters?.q || ""
  const url = `http://ip-api.com/json/${encodeURIComponent(query)}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,query`

  try {
    const res = await fetch(url)
    const data = await res.json()
    return {
      statusCode: res.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    }
  } catch (_err) {
    return {
      statusCode: 502,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: true, reason: "proxy_error" }),
    }
  }
}
