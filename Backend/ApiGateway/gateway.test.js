const express = require("express");
const request = require("supertest");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET_KEY = "test-secret"; // must be set before app.js/config.js is required
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const createApp = require("../src/app");

let pass = 0;
let fail = 0;
function check(label, cond, extra) {
  if (cond) {
    pass++;
    console.log(`  PASS  ${label}`);
  } else {
    fail++;
    console.log(`  FAIL  ${label}`, extra ?? "");
  }
}

function startFakeService(setup) {
  const app = express();
  app.use(express.json());
  setup(app);
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      resolve({ server, url: `http://localhost:${port}` });
    });
  });
}

async function main() {
  const fakeUser = await startFakeService((app) => {
    app.get("/health", (req, res) => res.json({ status: "ok" }));
    app.get("/users/:id", (req, res) =>
      res.json({ user_id: Number(req.params.id), full_name: "Test User", email: "t@x.com", role: "student" })
    );
  });

  const fakeContent = await startFakeService((app) => {
    app.get("/health", (req, res) => res.json({ status: "ok" }));
    app.get("/api/equipment", (req, res) => res.json([{ item_id: 1, service_name: "Central Lab" }]));
    app.post("/api/notices", (req, res) => {
      res.status(201).json({ notice_id: 1, ...req.body });
    });
    app.patch("/api/equipment/:id", (req, res) => {
      res.json({ item_id: Number(req.params.id), ...req.body });
    });
  });

  const fakeAssistant = await startFakeService((app) => {
    app.get("/health", (req, res) => res.json({ status: "ok" }));
    app.post("/api/ask", (req, res) => {
      res.setHeader("Content-Type", "text/plain");
      res.write("hello ");
      setTimeout(() => {
        res.write("streamed ");
        res.end("world");
      }, 20);
    });
  });

  const gatewayApp = createApp({
    user: fakeUser.url,
    content: fakeContent.url,
    assistant: fakeAssistant.url,
  });

  let r = await request(gatewayApp).get("/health");
  check("aggregated health -> 200", r.status === 200, r.body);
  check("aggregated health reports all 3 up", r.body.status === "ok", r.body);
  check(
    "aggregated health lists each service",
    r.body.services.map((s) => s.name).sort().join(",") === "ai_assistant,content_service,user-service",
    r.body
  );

  r = await request(gatewayApp).get("/api/users/5");
  check("user-service path rewrite -> 200", r.status === 200, r.body);
  check("user-service path rewrite returns correct user_id", r.body.user_id === 5, r.body);

  r = await request(gatewayApp).get("/api/equipment");
  check("content_service equipment passthrough -> 200", r.status === 200, r.body);
  check("content_service equipment returns array", Array.isArray(r.body), r.body);

  r = await request(gatewayApp).post("/api/notices").send({ title: "x", body: "y", created_by: 1 });
  check("unauthenticated notice POST -> 401", r.status === 401, r.body);

  const studentToken = jwt.sign({ sub: "1", role: "student" }, JWT_SECRET);
  r = await request(gatewayApp)
    .post("/api/notices")
    .set("Authorization", `Bearer ${studentToken}`)
    .send({ title: "Library closed", body: "Maintenance", created_by: 1 });
  check("authenticated notice POST -> 201", r.status === 201, r.body);
  check("authenticated notice POST reaches content_service", r.body.notice_id === 1, r.body);

  r = await request(gatewayApp)
    .patch("/api/equipment/1")
    .set("Authorization", `Bearer ${studentToken}`)
    .send({ status: "Maintenance" });
  check("student PATCH equipment -> 403", r.status === 403, r.body);

  const staffToken = jwt.sign({ sub: "3", role: "staff" }, JWT_SECRET);
  r = await request(gatewayApp)
    .patch("/api/equipment/1")
    .set("Authorization", `Bearer ${staffToken}`)
    .send({ status: "Maintenance" });
  check("staff PATCH equipment -> 200", r.status === 200, r.body);
  check("staff PATCH equipment reaches content_service", r.body.status === "Maintenance", r.body);

  r = await request(gatewayApp)
    .post("/api/notices")
    .set("Authorization", "Bearer garbage.not.a.token")
    .send({ title: "x", body: "y", created_by: 1 });
  check("garbage token -> 401 (not 500)", r.status === 401, r.body);

  const gatewayServer = gatewayApp.listen(0);
  const gatewayServerPort = gatewayServer.address().port;

  const streamResult = await new Promise((resolve, reject) => {
    const req = require("http").request(
      {
        hostname: "localhost",
        port: gatewayServerPort,
        path: "/api/ask",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      (res) => {
        const chunkTimestamps = [];
        let body = "";
        res.on("data", (d) => {
          chunkTimestamps.push(Date.now());
          body += d.toString();
        });
        res.on("end", () => resolve({ body, chunkCount: chunkTimestamps.length }));
        res.on("error", reject);
      }
    );
    req.on("error", reject);
    req.write(JSON.stringify({ query: "test" }));
    req.end();
  });

  check("streamed response body complete", streamResult.body === "hello streamed world", streamResult);
  check(
    "streamed response arrived in multiple chunks (not buffered)",
    streamResult.chunkCount >= 2,
    streamResult
  );

  await new Promise((resolve) => gatewayServer.close(resolve));

  r = await request(gatewayApp).get("/api/nonexistent");
  check("unmatched route -> 404", r.status === 404, r.body);

  await fakeUser.server.close();
  await fakeContent.server.close();
  await fakeAssistant.server.close();

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
