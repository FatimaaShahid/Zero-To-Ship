require("dotenv").config();

const services = {
  user: process.env.USER_SERVICE_URL || "http://localhost:8000",
  content: process.env.CONTENT_SERVICE_URL || "http://localhost:8001",
  assistant: process.env.AI_ASSISTANT_URL || "http://localhost:8002",
};

const port = process.env.GATEWAY_PORT || 4000;
const jwtSecret = process.env.JWT_SECRET_KEY || "dev-only-secret-change-me";

module.exports = { services, port, jwtSecret };
