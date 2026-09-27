import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import handler from "../api/demandes.js";

const root = join(process.cwd(), "dist");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

function apiResponse(response) {
  response.status = (code) => { response.statusCode = code; return response; };
  response.json = (body) => {
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(JSON.stringify(body));
  };
  return response;
}

createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost:4173");
  if (url.pathname === "/api/demandes") {
    let raw = "";
    for await (const chunk of request) raw += chunk;
    request.body = raw ? JSON.parse(raw) : {};
    await handler(request, apiResponse(response));
    return;
  }

  let requested = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.(\/|\\|$))+/, "");
  let file = join(root, requested);
  if (url.pathname === "/") file = join(root, "index.html");
  else if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  else if (!extname(file)) file = join(file, "index.html");
  if (!existsSync(file)) {
    response.statusCode = 404;
    file = join(root, "404.html");
  }
  response.setHeader("Content-Type", mime[extname(file)] || "application/octet-stream");
  response.end(readFileSync(file));
}).listen(4173, "127.0.0.1", () => console.log("Nexora Digital preview: http://127.0.0.1:4173"));
