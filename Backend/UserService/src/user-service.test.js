const { newDb } = require("pg");
const request = require("supertest");
const createApp = require("../src/app");

async function main() {
  const db = newDb();
  db.public.none(`
    CREATE TABLE users (
      user_id SERIAL PRIMARY KEY,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(30) NOT NULL DEFAULT 'student'
        CHECK (role IN ('student', 'faculty', 'admin')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const { Pool } = db.adapters.createPg();
  const pool = new Pool();
  const app = createApp(pool);

  let pass = 0;
  let fail = 0;
  function check(label, cond, extra) {
    if (cond) {
      pass++;
      console.log(`  PASS  ${label}`);
    } else {
      fail++;
      console.log(`  FAIL  ${label}`, extra || "");
    }
  }

  // 1. Register
  let r = await request(app).post("/users/register").send({
    full_name: "Abdul Moazzim",
    email: "abdul@neduet.edu.pk",
    password: "testpass123",
  });
  check("register -> 201", r.status === 201, r.body);
  check("register returns user_id", typeof r.body.user_id === "number", r.body);
  const userId = r.body.user_id;

  // 2. Duplicate email
  r = await request(app).post("/users/register").send({
    full_name: "Dup",
    email: "abdul@neduet.edu.pk",
    password: "testpass123",
  });
  check("duplicate register -> 409", r.status === 409, r.body);

  // 3. Weak password rejected
  r = await request(app).post("/users/register").send({
    full_name: "Weak",
    email: "weak@neduet.edu.pk",
    password: "123",
  });
  check("short password -> 422", r.status === 422, r.body);

  // 4. Invalid role rejected
  r = await request(app).post("/users/register").send({
    full_name: "BadRole",
    email: "badrole@neduet.edu.pk",
    password: "testpass123",
    role: "superuser",
  });
  check("invalid role -> 422", r.status === 422, r.body);

  // 5. Login success
  r = await request(app).post("/users/login").send({
    email: "abdul@neduet.edu.pk",
    password: "testpass123",
  });
  check("login -> 200", r.status === 200, r.body);
  check("login returns token", typeof r.body.token === "string" && r.body.token.length > 10, r.body);

  // 6. Login wrong password
  r = await request(app).post("/users/login").send({
    email: "abdul@neduet.edu.pk",
    password: "wrongpass",
  });
  check("bad login -> 401", r.status === 401, r.body);

  // 7. Get user
  r = await request(app).get(`/users/${userId}`);
  check("get user -> 200", r.status === 200, r.body);
  check("get user returns correct email", r.body.email === "abdul@neduet.edu.pk", r.body);

  // 8. Get missing user
  r = await request(app).get("/users/9999");
  check("get missing user -> 404", r.status === 404, r.body);

  // 9. Patch user
  r = await request(app).patch(`/users/${userId}`).send({ role: "faculty" });
  check("patch user -> 200", r.status === 200, r.body);
  check("patch user updated role", r.body.role === "faculty", r.body);

  // 10. Patch with invalid role
  r = await request(app).patch(`/users/${userId}`).send({ role: "hacker" });
  check("patch invalid role -> 422", r.status === 422, r.body);

  // 11. Health check
  r = await request(app).get("/health");
  check("health -> 200", r.status === 200, r.body);

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
