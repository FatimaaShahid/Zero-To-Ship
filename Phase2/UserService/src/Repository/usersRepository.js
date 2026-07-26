const VALID_ROLES = ["student", "faculty", "admin"];

function getPool(pool) {
  return pool || require("../Utils/db");
}

async function findByEmail(email, pool) {
  const db = getPool(pool);
  const { rows } = await db.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return rows[0] || null;
}

async function findById(userId, pool) {
  const db = getPool(pool);
  const { rows } = await db.query(
    "SELECT * FROM users WHERE user_id = $1",
    [userId]
  );
  console.log(rows)
  return rows[0] || null;
}

async function createUser({ fullName, email, passwordHash, role }, pool) {
  const db = getPool(pool);
  const finalRole = role && VALID_ROLES.includes(role) ? role : "student";
  const { rows } = await db.query(
    `INSERT INTO users (full_name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING user_id, full_name, email, role, created_at`,
    [fullName, email, passwordHash, finalRole]
  );
  return rows[0];
}

async function updateUser(userId, { fullName, role }, pool) {
  const db = getPool(pool);
  const { rows } = await db.query(
    `UPDATE users
     SET full_name = COALESCE($2, full_name),
         role = COALESCE($3, role)
     WHERE user_id = $1
     RETURNING user_id, full_name, email, role, created_at`,
    [userId, fullName ?? null, role ?? null]
  );
  return rows[0] || null;
}

module.exports = {
  getPool,
  VALID_ROLES,
  findByEmail,
  findById,
  createUser,
  updateUser,
};
