const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");

const { services } = require("./config");
const { attachUser, requireAuth, requireRole } = require("./middleware/auth");
const { requestId } = require("./middleware/requestId");
const healthRouterFactory = require("./routes/health");

function createApp(targets = services) {
  const app = express();

  app.use(cors());
  app.use(morgan("dev"));
  app.use(requestId);
  app.use(attachUser); // decodes Bearer token if present, doesn't require one

  app.use("/", healthRouterFactory(targets));

  
  app.use(
    createProxyMiddleware({
      pathFilter: "/api/users",
      target: targets.user,
      changeOrigin: true,
      pathRewrite: { "^/api/users": "/users" },
    })
  );

 
  app.post("/api/notices", requireAuth, (req, res, next) => next());
  app.patch(
    "/api/equipment/:id",
    requireRole("staff", "admin"),
    (req, res, next) => next()
  );

  app.use(
    createProxyMiddleware({
      pathFilter: ["/api/notices", "/api/equipment"],
      target: targets.content,
      changeOrigin: true,
    })
  );

  app.use(
    createProxyMiddleware({
      pathFilter: "/api/ask",
      target: targets.assistant,
      changeOrigin: true,
    })
  );

  app.use((req, res) => {
    res.status(404).json({ detail: "No route matches this path on the gateway" });
  });

  return app;
}

module.exports = createApp;
