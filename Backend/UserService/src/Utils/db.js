const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    process.env.USER_DB_URL ||
    "postgresql://postgres:postgres@localhost:5433/user_db",
});

module.exports = pool;
