export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: "Falta el parámetro url" });
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "User-Agent": "VLC/3.0.18 LibVLC/3.0.18",
        "Accept": "*/*"
      }
    });

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    // Copiar los headers del contenido (tipo de video, m3u8, etc.)
    const contentType = response.headers.get("content-type");
    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    res.status(response.status);
    
    // Transmitir el stream de datos
    const buffer = await response.arrayBuffer();
    return res.send(Buffer.from(buffer));

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
