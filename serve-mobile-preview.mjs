import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createUiNotesApi } from "./ui-notes-server.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const staticOnly = process.argv.includes("--static-only");
const portArgument = process.argv.find((argument) => argument.startsWith("--port="));
const port = Number(portArgument?.split("=")[1]) || 8767;
const handleUiNotesApi = staticOnly ? null : createUiNotesApi(root);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url || "/", `http://${req.headers.host || "127.0.0.1"}`);
  if (handleUiNotesApi && requestUrl.pathname.startsWith("/api/ui-notes")) {
    await handleUiNotesApi(req, res, requestUrl);
    return;
  }

  let pathname = decodeURIComponent((req.url || "/").split("?")[0]);
  if (pathname === "/") pathname = "/index.html";

  const file = path.normalize(path.join(root, pathname));
  if (!file.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(file, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": mime[path.extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(data);
  });
}).listen(port, "0.0.0.0", () => {
  console.log(`${staticOnly ? "Static" : "Preview"} server running on http://0.0.0.0:${port}`);
});
