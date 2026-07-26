const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET_KEY || "dev-only-secret-change-me";
const SALT_ROUNDS = 10;
const TOKEN_EXPIRES_IN = "24h";

async function hashPassword(rawPassword) {
  return bcrypt.hash(rawPassword, SALT_ROUNDS);
}

async function verifyPassword(rawPassword, passwordHash) {
  return bcrypt.compare(rawPassword, passwordHash);
}

function createAccessToken(userId, role) {
  return jwt.sign({ sub: String(userId), role }, SECRET_KEY, {
    expiresIn: TOKEN_EXPIRES_IN,
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

module.exports = {
  hashPassword,
  verifyPassword,
  createAccessToken,
  verifyAccessToken,
};
