import http from "http";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import fs from "fs";
import os from "os";
import path from "path";
import { OAuth2Client } from "google-auth-library";

function readJson(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString("utf8");
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res: http.ServerResponse, status: number, payload: any, corsOrigin: string) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(payload));
}

function sendHtml(res: http.ServerResponse, status: number, html: string) {
  res.writeHead(status, {
    "Content-Type": "text/html; charset=utf-8",
  });
  res.end(html);
}

const CONFIG_DIR = path.join(os.homedir(), ".gmail-mcp");
const OAUTH_PATH = process.env.GMAIL_OAUTH_PATH || path.join(CONFIG_DIR, "gcp-oauth.keys.json");
const CREDENTIALS_PATH =
  process.env.GMAIL_CREDENTIALS_PATH || path.join(CONFIG_DIR, "credentials.json");

function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

function loadOAuthKeys(): { client_id: string; client_secret: string } {
  ensureConfigDir();

  if (!fs.existsSync(OAUTH_PATH)) {
    throw new Error(
      `OAuth keys file not found at ${OAUTH_PATH}. Place gcp-oauth.keys.json there (or set GMAIL_OAUTH_PATH).`
    );
  }

  const keysContent = JSON.parse(fs.readFileSync(OAUTH_PATH, "utf8"));
  const keys = keysContent.installed || keysContent.web;
  if (!keys?.client_id || !keys?.client_secret) {
    throw new Error("Invalid gcp-oauth.keys.json format (missing client_id/client_secret)");
  }
  return { client_id: String(keys.client_id), client_secret: String(keys.client_secret) };
}

function getRedirectUri(host: string, port: number): string {
  return process.env.GMAIL_REDIRECT_URI || `http://${host}:${port}/oauth2callback`;
}

function createOAuthClient(host: string, port: number): OAuth2Client {
  const { client_id, client_secret } = loadOAuthKeys();
  return new OAuth2Client(client_id, client_secret, getRedirectUri(host, port));
}

async function main() {
  const port = Number(process.env.MCP_HTTP_PORT || 3004);
  const host = process.env.MCP_HTTP_HOST || "127.0.0.1";

  const childEnv: Record<string, string> = {};
  for (const [k, v] of Object.entries(process.env)) {
    if (typeof v === "string") childEnv[k] = v;
  }

  let mcpClient: Client | null = null;
  let connecting: Promise<void> | null = null;

  const connectMcp = async () => {
    if (mcpClient) return;
    if (connecting) return connecting;

    connecting = (async () => {
      const transport = new StdioClientTransport({
        command: "node",
        args: ["dist/index.js"],
        env: childEnv,
      });

      const client = new Client({
        name: "wozif-gmail-http-bridge",
        version: "1.0.0",
        capabilities: { tools: {} },
      } as any);

      await client.connect(transport);
      mcpClient = client;
    })();

    return connecting;
  };

  const server = http.createServer(async (req, res) => {
    const origin = typeof req.headers.origin === "string" ? req.headers.origin : "";
    const corsOrigin = origin || `http://${host}:${port}`;

    if (req.method === "OPTIONS") {
      return sendJson(res, 200, { ok: true }, corsOrigin);
    }

    if (req.method === "GET" && req.url === "/health") {
      return sendJson(res, 200, { ok: true }, corsOrigin);
    }

    if (req.method === "GET" && req.url?.startsWith("/auth/status")) {
      return sendJson(res, 200, { connected: fs.existsSync(CREDENTIALS_PATH) }, corsOrigin);
    }

    if (req.method === "GET" && req.url?.startsWith("/auth/start")) {
      try {
        const url = new URL(req.url, `http://${host}:${port}`);
        const returnTo = url.searchParams.get("returnTo") || "";

        const client = createOAuthClient(host, port);
        const authUrl = client.generateAuthUrl({
          access_type: "offline",
          prompt: "consent",
          scope: [
            "https://www.googleapis.com/auth/gmail.modify",
            "https://www.googleapis.com/auth/gmail.settings.basic",
          ],
          state: returnTo ? Buffer.from(returnTo, "utf8").toString("base64") : undefined,
        });

        res.writeHead(302, { Location: authUrl });
        res.end();
        return;
      } catch (e: any) {
        return sendHtml(
          res,
          500,
          `<pre>Erreur OAuth: ${String(e?.message || e)}</pre>`
        );
      }
    }

    if (req.method === "GET" && req.url?.startsWith("/oauth2callback")) {
      try {
        const url = new URL(req.url, `http://${host}:${port}`);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state") || "";
        const returnTo = state ? Buffer.from(state, "base64").toString("utf8") : "";

        if (!code) {
          return sendHtml(res, 400, `<pre>Code OAuth manquant</pre>`);
        }

        const client = createOAuthClient(host, port);
        const { tokens } = await client.getToken(code);
        ensureConfigDir();
        fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify(tokens));

        // Reset MCP connection so it can start using fresh credentials
        mcpClient = null;
        connecting = null;

        const backLink = returnTo || "http://localhost:3001";
        return sendHtml(
          res,
          200,
          `<div style="font-family: ui-sans-serif, system-ui; padding: 24px;">
            <h2>Gmail connecté ✅</h2>
            <p>Tu peux fermer cet onglet.</p>
            <a href="${backLink}">Revenir à l'application</a>
          </div>`
        );
      } catch (e: any) {
        return sendHtml(
          res,
          500,
          `<pre>Erreur OAuth callback: ${String(e?.message || e)}</pre>`
        );
      }
    }

    if (req.method === "GET" && req.url === "/tools") {
      try {
        await connectMcp();
        if (!mcpClient) {
          return sendJson(res, 503, { error: "MCP not connected" }, corsOrigin);
        }
        const tools = await mcpClient.listTools();
        return sendJson(res, 200, { tools: tools.tools || [] }, corsOrigin);
      } catch (e: any) {
        return sendJson(
          res,
          500,
          {
            error: e?.message || String(e),
            hint: "Si Gmail n'est pas connecté, ouvre /auth/start pour faire l'OAuth.",
          },
          corsOrigin
        );
      }
    }

    if (req.method === "POST" && req.url === "/call") {
      try {
        const body = await readJson(req);
        const name = body?.name;
        const args = body?.arguments || {};
        if (!name || typeof name !== "string") {
          return sendJson(res, 400, { error: "Missing tool name" }, corsOrigin);
        }
        await connectMcp();
        if (!mcpClient) {
          return sendJson(res, 503, { error: "MCP not connected" }, corsOrigin);
        }
        const result = await mcpClient.callTool({ name, arguments: args });
        return sendJson(res, 200, { result }, corsOrigin);
      } catch (e: any) {
        return sendJson(res, 500, { error: e?.message || String(e) }, corsOrigin);
      }
    }

    return sendJson(res, 404, { error: "Not found" }, corsOrigin);
  });

  server.listen(port, host);
}

main().catch((e) => {
  process.stderr.write(String(e?.stack || e) + "\n");
  process.exit(1);
});
