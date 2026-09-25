import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

// Ensure env validation passes in CI without real secrets
process.env.NODE_ENV ||= "test";
process.env.MONGO_URI ||= "mongodb://localhost:27017/cyberhud_test";
process.env.JWT_ACCESS_SECRET ||= "test_access_secret_32chars_minimum_xxxx";
process.env.JWT_REFRESH_SECRET ||= "test_refresh_secret_32chars_minimum_xxx";
process.env.FRONTEND_URL ||= "http://localhost:5173";

let app;
before(async () => {
  ({ default: app } = await import("../src/app.js"));
});

describe("platform probes", () => {
  it("GET /api/live returns alive", async () => {
    const res = await request(app).get("/api/live");
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
  });

  it("GET /api/health returns version + request envelope", async () => {
    const res = await request(app).get("/api/health");
    assert.ok([200, 503].includes(res.status));
    assert.equal(typeof res.body.data?.version, "string");
  });

  it("unknown route returns JSON 404 with requestId", async () => {
    const res = await request(app).get("/api/does-not-exist");
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.ok(res.headers["x-request-id"]);
  });

  it("CORS blocks unknown origins in test (allowlisted only)", async () => {
    const res = await request(app)
      .get("/api/live")
      .set("Origin", "https://evil.example.com");
    // Either 200 without ACAO echo, or CORS error surfaced as 500 via errorHandler
    assert.ok(res.status === 200 || res.status === 500);
    if (res.status === 200) {
      assert.notEqual(res.headers["access-control-allow-origin"], "https://evil.example.com");
    }
  });
});

describe("auth validation", () => {
  it("POST /api/auth/register rejects weak password with 400 + errors[]", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "test_user",
      email: "test@example.com",
      password: "weak",
    });
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(Array.isArray(res.body.errors));
  });

  it("POST /api/auth/login rejects malformed email with 400", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "not-an-email",
      password: "whatever",
    });
    assert.equal(res.status, 400);
  });
});

describe("battle validation", () => {
  it("GET /api/battles rejects invalid type query with 400", async () => {
    const res = await request(app).get("/api/battles?type=invalid_type");
    assert.equal(res.status, 400);
  });
});
