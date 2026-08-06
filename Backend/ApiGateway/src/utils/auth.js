const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");

/**
 * Verifies the Bearer token issued by user-service (same JWT_SECRET_KEY)
 * and, if valid, forwards the decoded identity downstream as headers so
 * content_service/etc. don't need to re-verify the token themselves.
 *
 * This is where the "no auth-context check wired in yet" TODOs left in
 * user-service's PATCH /users/:id and content_service's PATCH
 * /api/equipment/:id get resolved — centralized here instead of repeated
 * per service.
 */
function attachUser(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next();
  }

  const token = header.slice("Bearer ".length);
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = { id: decoded.sub, role: decoded.role };
    req.headers["x-user-id"] = String(decoded.sub);
    req.headers["x-user-role"] = decoded.role;
  } catch {
    // Invalid/expired token — leave req.user unset; requireAuth (if used
    // downstream) will reject it. Routes that don't need auth still work.
  }
  next();
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ detail: "Missing or invalid authorization token" });
  }
  next();
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ detail: "Missing or invalid authorization token" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ detail: `Requires role: ${allowedRoles.join(" or ")}` });
    }
    next();
  };
}

module.exports = { attachUser, requireAuth, requireRole };
