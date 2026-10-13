import { readFileSync, existsSync } from "node:fs";
import { createServer } from "node:https";
import { X509Certificate } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { networkInterfaces } from "node:os";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
let app;
let server;

function readCertificate(path, label) {
  try {
    return readFileSync(path);
  } catch {
    throw new Error(`Không đọc được ${label}: ${path}. Tạo chứng chỉ local bằng npm run dev hoặc cấu hình HTTPS_KEY_FILE và HTTPS_CERT_FILE.`);
  }
}

async function main() {
  process.env.NODE_ENV = "production";
  const { default: nextEnv } = await import("@next/env");
  nextEnv.loadEnvConfig(projectRoot, false);

  const { values } = parseArgs({
    options: {
      port: { type: "string", short: "p" },
      hostname: { type: "string", short: "H" },
      help: { type: "boolean", short: "h" },
    },
  });
  if (values.help) {
    console.log("npm run start -- [--port 3000] [--hostname 0.0.0.0]\nChứng chỉ: HTTPS_KEY_FILE, HTTPS_CERT_FILE; mặc định certificates/localhost-*.pem.");
    return;
  }

  const portValue = values.port ?? process.env.PORT ?? "3000";
  const port = Number(portValue);
  if (!/^\d+$/.test(portValue) || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT phải là số nguyên từ 1 đến 65535.");
  }
  const hostname = values.hostname ?? process.env.HTTPS_HOST ?? "0.0.0.0";
  if (!hostname.trim()) throw new Error("Hostname không được để trống.");
  const customKey = process.env.HTTPS_KEY_FILE;
  const customCert = process.env.HTTPS_CERT_FILE;
  if (Boolean(customKey) !== Boolean(customCert)) {
    throw new Error("Cần cấu hình đồng thời HTTPS_KEY_FILE và HTTPS_CERT_FILE.");
  }

  if (!existsSync(resolve(projectRoot, ".next/BUILD_ID"))) {
    throw new Error("Chưa có production build. Chạy npm run build trước npm run start.");
  }
  const key = readCertificate(resolve(projectRoot, customKey || "certificates/localhost-key.pem"), "khóa TLS");
  const cert = readCertificate(resolve(projectRoot, customCert || "certificates/localhost.pem"), "chứng chỉ TLS");
  const leaf = new X509Certificate(cert);
  const now = Date.now();
  if (now < Date.parse(leaf.validFrom) || now >= Date.parse(leaf.validTo)) {
    throw new Error("Chứng chỉ TLS chưa có hiệu lực hoặc đã hết hạn. Hãy thay chứng chỉ hợp lệ.");
  }

  const { default: next } = await import("next");
  let handle;
  // Creating the TLS context also rejects malformed certificates/key mismatches.
  server = createServer({ key, cert, minVersion: "TLSv1.2" }, (req, res) => {
    Promise.resolve(handle(req, res)).catch(error => {
      console.error("[HTTPS] Không xử lý được yêu cầu:", error.message);
      if (res.headersSent) return res.destroy();
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Không thể xử lý yêu cầu. Vui lòng thử lại.");
    });
  });
  app = next({ dev: false, dir: projectRoot, hostname, port, httpServer: server });
  await app.prepare();
  handle = app.getRequestHandler();
  await new Promise((ready, reject) => {
    server.once("error", reject);
    server.listen(port, hostname, () => {
      server.off("error", reject);
      ready();
    });
  });

  const displayHost = hostname === "0.0.0.0" || hostname === "::" ? "localhost" : hostname;
  const urlHost = displayHost.includes(":") ? `[${displayHost}]` : displayHost;
  console.log(`LAVITA production HTTPS: https://${urlHost}:${port}`);
  if (hostname === "0.0.0.0" || hostname === "::") {
    const addresses = new Set(Object.values(networkInterfaces()).flat().filter(entry => entry?.family === "IPv4" && !entry.internal).map(entry => entry.address));
    for (const address of addresses) {
      console.log(`Network: https://${address}:${port}`);
      if (!leaf.checkIP(address)) {
        console.warn(`[HTTPS] Chứng chỉ chưa bao gồm IP ${address}. Tạo lại chứng chỉ có IP này trước khi truy cập qua LAN.`);
      }
    }
  }

  let stopping = false;
  async function shutdown(exitCode = 0) {
    if (stopping) return;
    stopping = true;
    const timeout = setTimeout(() => process.exit(exitCode), 10000);
    timeout.unref();
    await new Promise(done => server.close(done));
    await app.close();
    clearTimeout(timeout);
    process.exit(exitCode);
  }
  process.once("SIGINT", () => { shutdown().catch(() => process.exit(1)); });
  process.once("SIGTERM", () => { shutdown().catch(() => process.exit(1)); });
  server.on("error", error => {
    console.error("[HTTPS] Lỗi server:", error.message);
    shutdown(1).catch(() => process.exit(1));
  });
}

main().catch(async error => {
  console.error("[HTTPS] Không thể khởi động:", error.message);
  server?.close();
  await app?.close().catch(() => {});
  process.exit(1);
});
