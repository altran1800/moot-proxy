import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import compiled Nitro handlers
const indexHandler = (await import(path.join(__dirname, '.output/server/index.mjs'))).default;
const tsHandler = (await import(path.join(__dirname, '.output/server/ts-proxy.mjs'))).default;
const m3u8Handler = (await import(path.join(__dirname, '.output/server/m3u8-proxy.mjs'))).default;

const port = process.env.PORT || 3000;

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '', `http://${req.headers.host}`);

    if (url.pathname.startsWith('/ts-proxy')) {
      await tsHandler({ node: { req, res }, path: url.pathname, query: Object.fromEntries(url.searchParams) });
    } else if (url.pathname.startsWith('/m3u8-proxy')) {
      await m3u8Handler({ node: { req, res }, path: url.pathname, query: Object.fromEntries(url.searchParams) });
    } else {
      await indexHandler({ node: { req, res }, path: url.pathname, query: Object.fromEntries(url.searchParams) });
    }
  } catch (err: any) {
    console.error('Error in handler:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

server.listen(port, () => console.log(`Proxy running on port ${port}`));
