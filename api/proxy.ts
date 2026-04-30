import { createProxyMiddleware } from 'http-proxy-middleware';

export default createProxyMiddleware({
  target: 'https://generativelanguage.googleapis.com',
  changeOrigin: true,
  ws: true,
  pathRewrite: (path, req) => {
    let newPath = path.replace('/api/proxy', '');
    if (process.env.GEMINI_API_KEY) {
      if (newPath.includes('key=proxy_dummy_key')) {
        newPath = newPath.replace('key=proxy_dummy_key', `key=${process.env.GEMINI_API_KEY}`);
      } else {
        newPath += (newPath.includes('?') ? '&' : '?') + `key=${process.env.GEMINI_API_KEY}`;
      }
    }
    return newPath;
  },
  on: {
    proxyReq: (proxyReq, req, res) => {
      if (process.env.GEMINI_API_KEY) {
        proxyReq.setHeader('x-goog-api-key', process.env.GEMINI_API_KEY);
      }
    }
  }
});
