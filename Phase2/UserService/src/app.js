const express = require("express");
const cors = require("cors");
const createUsersRouter = require("./routes/users");
const {getPool} = require("./Repository/usersRepository")

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "user-service" });
  });

  const pool = getPool()

  app.use("/users", createUsersRouter(pool));

  return app;
}

module.exports = createApp;
