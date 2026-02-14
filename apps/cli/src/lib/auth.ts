import http from "node:http";
import { exec } from "node:child_process";
import { platform } from "node:os";

function openBrowser(url: string) {
  const plat = platform();
  if (plat === "darwin") exec(`open "${url}"`);
  else if (plat === "win32") exec(`start "" "${url}"`);
  else exec(`xdg-open "${url}"`);
}

export interface AuthResult {
  name: string;
  email: string;
  uid: string;
  photo?: string;
}

export function startAuthFlow(baseUrl: string): Promise<AuthResult> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url || "/", "http://localhost");

      if (url.pathname === "/callback") {
        const name = url.searchParams.get("name") || "";
        const email = url.searchParams.get("email") || "";
        const uid = url.searchParams.get("uid") || "";
        const photo = url.searchParams.get("photo") || undefined;

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`<!DOCTYPE html>
<html>
<head><title>Shipwell</title>
<style>
  body { background: #0a0a0f; color: #e4e4e7; font-family: -apple-system, BlinkMacSystemFont, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
  .card { text-align: center; padding: 3rem; }
  .icon { font-size: 3rem; margin-bottom: 1rem; }
  h1 { font-size: 1.5rem; margin: 0 0 0.5rem; }
  p { color: #71717a; font-size: 0.875rem; margin: 0.25rem 0; }
  .name { color: #818cf8; font-weight: 600; }
  .hint { margin-top: 1.5rem; padding: 1rem; background: #18181b; border-radius: 0.75rem; border: 1px solid #27272a; }
  code { color: #22d3ee; font-size: 0.8rem; }
</style>
</head>
<body>
  <div class="card">
    <div class="icon">⛵</div>
    <h1>Welcome to Shipwell</h1>
    <p>Logged in as <span class="name">${name}</span></p>
    <p style="margin-top: 1rem; color: #52525b;">You can close this tab and return to your terminal.</p>
    <div class="hint">
      <p style="color: #a1a1aa; margin-bottom: 0.5rem;">Next, set your API key:</p>
      <code>shipwell config set api-key sk-ant-...</code>
    </div>
  </div>
</body>
</html>`);

        server.close();
        resolve({ name, email, uid, photo });
      } else {
        res.writeHead(404);
        res.end("Not found");
      }
    });

    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      const port = typeof addr === "object" && addr ? addr.port : 0;
      openBrowser(`${baseUrl}/cli-auth?port=${port}`);
    });

    setTimeout(() => {
      server.close();
      reject(new Error("Authentication timed out (5 minutes)"));
    }, 5 * 60 * 1000);
  });
}
