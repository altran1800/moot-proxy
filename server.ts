// server.ts
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Nitro build handlers
const indexHandler = (await import(path.join(__dirname, '.output/server/index.mjs'))).default;
const tsHandler = (await import(path.join(__dirname, '.output/server/ts-proxy.mjs'))).default;
const m3u8Handler = (await import(path.join(__dirname, '.output/server/m3u8-proxy.mjs'))).default;

// Use Railway's PORT env or default 3000
const port = process.env.PORT || 3000;

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const query = Object.fromEntries(url.searchParams);

    // Health check route
    if (url.pathname === '/test') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Server is alive!');
      return;
    }

    // Proxy routes
    if (url.pathname.startsWith('/ts-proxy')) {
      await tsHandler({ node: { req, res }, path: url.pathname, query });
    } else if (url.pathname.startsWith('/m3u8-proxy')) {
      await m3u8Handler({ node: { req, res }, path: url.pathname, query });
    } else {
      await indexHandler({ node: { req, res }, path: url.pathname, query });
    }
  } catch (err: any) {
    console.error('Error in handler:', err);
    if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

// Start server
server.listen(port, () => {
  console.log(`Proxy running on port ${port}`);
});
