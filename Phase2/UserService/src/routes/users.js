const express = require("express");
const usersRepo = require("../Repository/usersRepository");
const { hashPassword, verifyPassword, createAccessToken } = require("../Utils/auth");

function createUsersRouter(pool) {
  const router = express.Router();

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  router.post("/register", async (req, res) => {
    const { full_name, email, password, role } = req.body || {};

    if (!full_name || typeof full_name !== "string" || full_name.length > 100) {
      return res.status(422).json({ detail: "full_name is required (max 100 chars)" });
    }
    if (!email || !EMAIL_RE.test(email)) {
      return res.status(422).json({ detail: "A valid email is required" });
    }
    if (!password || password.length < 8) {
      return res.status(422).json({ detail: "password must be at least 8 characters" });
    }
    if (role && !usersRepo.VALID_ROLES.includes(role)) {
      return res.status(422).json({ detail: "role must be one of student, faculty, admin" });
    }

    const existing = await usersRepo.findByEmail(email, pool);
    if (existing) {
      return res.status(409).json({ detail: "Email already registered" });
    }

    try {
      const passwordHash = await hashPassword(password);
      const user = await usersRepo.createUser(
        { fullName: full_name, email, passwordHash, role },
        pool
      );
      return res.status(201).json({
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      if (err.code === "23505") {
        // Postgres unique_violation — race condition on concurrent registers
        return res.status(409).json({ detail: "Email already registered" });
      }
      console.error(err);
      return res.status(500).json({ detail: "Internal server error" });
    }
  });

  router.post("/login", async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(422).json({ detail: "email and password are required" });
    }

    const user = await usersRepo.findByEmail(email, pool);
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return res.status(401).json({ detail: "Invalid email or password" });
    }

    const token = createAccessToken(user.user_id, user.role);
    return res.status(200).json({ token, user_id: user.user_id, role: user.role });
  });

  router.get("/:id", async (req, res) => {
    // try {

    // } catch {

    // }
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId)) {
      return res.status(422).json({ detail: "id must be an integer" });
    }

    const user = await usersRepo.findById(userId, pool);
    if (!user) {
      return res.status(404).json({ detail: "User not found" });
    }

    return res.status(200).json({
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    });
  });

  router.patch("/:id", async (req, res) => {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId)) {
      return res.status(422).json({ detail: "id must be an integer" });
    }

    const { full_name, role } = req.body || {};
    if (role && !usersRepo.VALID_ROLES.includes(role)) {
      return res.status(422).json({ detail: "role must be one of student, faculty, admin" });
    }

    const existing = await usersRepo.findById(userId, pool);
    if (!existing) {
      return res.status(404).json({ detail: "User not found" });
    }

    // NOTE: per api_contract.md, only admin/faculty should be able to set
    // role. No auth-context check wired in yet — add a requireAuth
    // middleware here once "current user" extraction from the JWT is
    // needed (Phase 2 follow-up), same as the FastAPI version's TODO.
    const updated = await usersRepo.updateUser(userId, { fullName: full_name, role }, pool);
    return res.status(200).json({
      user_id: updated.user_id,
      full_name: updated.full_name,
      email: updated.email,
      role: updated.role,
      created_at: updated.created_at,
    });
  });

  return router;
}

module.exports = createUsersRouter;
