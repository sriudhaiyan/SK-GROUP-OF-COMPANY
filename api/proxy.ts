import { createProxyMiddleware } from 'http-proxy-middleware';

// Explicitly use the provided key per user request to use the API for SK ORBIX
// The environment variable may be a dummy key, so we use the explicitly provided one.
const TARGET_API_KEY = "AIzaSyDEQyjTcwfMZVNOnXzJlvxTeHd1ndyKDCg";

export default createProxyMiddleware({
  target: 'https://generativelanguage.googleapis.com',
  changeOrigin: true,
  ws: true,
  pathRewrite: (path, req) => {
    let newPath = path.replace('/api/proxy', '');
    if (TARGET_API_KEY) {
      if (newPath.includes('key=proxy_dummy_key')) {
        newPath = newPath.replace('key=proxy_dummy_key', `key=${TARGET_API_KEY}`);
      } else {
        newPath += (newPath.includes('?') ? '&' : '?') + `key=${TARGET_API_KEY}`;
      }
    }
    return newPath;
  },
  on: {
    proxyReq: (proxyReq, req, res) => {
      if (TARGET_API_KEY) {
        proxyReq.setHeader('x-goog-api-key', TARGET_API_KEY);
      }
    }
  }
});
