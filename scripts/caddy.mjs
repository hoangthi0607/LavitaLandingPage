import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const action = process.argv[2];
if (!['validate', 'run'].includes(action)) {
  console.error("Dùng npm run https:check hoặc npm run https:public.");
  process.exit(1);
}
const binary = process.env.CADDY_BIN || resolve(projectRoot, ".tools/caddy", process.platform === "win32" ? "caddy.exe" : "caddy");
if (!existsSync(binary)) {
  console.error("Chưa có Caddy. Xem docs/public-https.md để tải Caddy hoặc đặt CADDY_BIN tới executable.");
  process.exit(1);
}
if (!existsSync(resolve(projectRoot, "certificates/rootCA.pem"))) {
  console.error("Thiếu certificates/rootCA.pem. Sao chép CA công khai của mkcert theo docs/public-https.md.");
  process.exit(1);
}
const args = [action, '--config', resolve(projectRoot, 'Caddyfile'), '--adapter', 'caddyfile'];
const child = spawn(binary, args, { cwd: projectRoot, stdio: 'inherit', windowsHide: true });
child.on('error', error => { console.error('Không thể chạy Caddy:', error.message); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
process.once('SIGINT', () => child.kill('SIGINT'));
process.once('SIGTERM', () => child.kill('SIGTERM'));
