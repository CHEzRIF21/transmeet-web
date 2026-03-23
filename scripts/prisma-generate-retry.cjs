/**
 * Windows: Prisma peut échouer avec EPERM lors du rename de query_engine-windows.dll.node
 * (antivirus, sync cloud, ou contention). Retries avec délai progressif.
 */
const { spawnSync } = require("node:child_process");
const path = require("node:path");

function sleepSync(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    /* spin */
  }
}

const root = path.resolve(__dirname, "..");
const webDir = path.join(root, "apps", "web");
const attempts = Math.max(
  1,
  parseInt(process.env.PRISMA_GENERATE_RETRIES || "5", 10) || 5
);

for (let i = 0; i < attempts; i++) {
  const result = spawnSync("pnpm", ["exec", "prisma", "generate"], {
    cwd: webDir,
    stdio: "inherit",
    shell: true,
    env: process.env,
  });

  if (result.status === 0) {
    process.exit(0);
  }

  if (i < attempts - 1) {
    const ms = 800 * (i + 1);
    console.error(
      `[prisma-generate-retry] Échec (code ${result.status}), nouvel essai dans ${ms} ms…`
    );
    sleepSync(ms);
  }
}

console.error("[prisma-generate-retry] prisma generate a échoué après", attempts, "tentatives.");
process.exit(1);
