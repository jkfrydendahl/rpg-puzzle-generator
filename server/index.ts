import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getConfig } from "./config.js";
import { decorateRoute } from "./routes/decorate.js";

const config = getConfig();

if (!config.apiKey) {
  console.warn("⚠ OPENAI_API_KEY not set — AI decoration will fail");
}

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use("/api/decorate", decorateRoute);

// In production, serve the Vite-built static files
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});

export { app };
