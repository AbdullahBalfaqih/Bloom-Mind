const http = require('http');

const PORT = 11435;
const OLLAMA_PORT = 11434;

const server = http.createServer((req, res) => {
  // CORS Headers for Expo
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const options = {
    hostname: '127.0.0.1',
    port: OLLAMA_PORT,
    path: req.url,
    method: req.method,
    headers: req.headers
  };
  // Delete host header to avoid issues
  delete options.headers.host;

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (e) => {
    console.error(`Proxy Error: ${e.message}`);
    res.writeHead(500);
    res.end();
  });

  req.pipe(proxyReq, { end: true });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Ollama Proxy] Listening on 0.0.0.0:${PORT} and forwarding to 127.0.0.1:${OLLAMA_PORT}`);
});
