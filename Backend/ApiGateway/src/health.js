const express = require("express");

async function pingService(name, baseUrl) {
  const start = Date.now();
  try {
    const res = await fetch(`${baseUrl}/health`, { signal: AbortSignal.timeout(3000) });
    return {
      name,
      status: res.ok ? "up" : "degraded",
      httpStatus: res.status,
      latencyMs: Date.now() - start,
    };
  } catch (err) {
    return { name, status: "down", error: err.message, latencyMs: Date.now() - start };
  }
}

function createHealthRouter(targets) {
  const router = express.Router();

  router.get("/health", async (req, res) => {
    const results = await Promise.all([
      pingService("user-service", targets.user),
      pingService("content_service", targets.content),
      pingService("ai_assistant", targets.assistant),
    ]);

    const allUp = results.every((r) => r.status === "up");
    res.status(allUp ? 200 : 503).json({
      status: allUp ? "ok" : "degraded",
      gateway: "up",
      services: results,
    });
  });

  return router;
}

module.exports = createHealthRouter;
