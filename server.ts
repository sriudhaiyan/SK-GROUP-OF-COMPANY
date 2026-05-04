import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import proxyHandler from "./api/proxy.ts";
import githubHandler from "./api/github.ts";
import nexoraHandler from "./api/nexora.ts";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests
  app.use(express.json({ limit: "50mb" }));

  // Live API WebSocket and HTTP proxy to hide API key
  app.use("/api/proxy", proxyHandler);
  app.get("/api/github", githubHandler);
  app.post("/api/nexora", nexoraHandler);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // To support WebSocket proxying with Express, we must listen on the httpServer.
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
