import { Router, type IRouter } from "express";
import { AdminLoginBody } from "@workspace/api-zod";

const router: IRouter = Router();

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "acim2024";
const MOCK_TOKEN = "acim-admin-token-mock-2024";

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (
    parsed.data.username !== ADMIN_USERNAME ||
    parsed.data.password !== ADMIN_PASSWORD
  ) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  res.json({ token: MOCK_TOKEN, username: ADMIN_USERNAME });
});

router.get("/admin/me", async (req, res): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (token !== MOCK_TOKEN) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  res.json({ username: ADMIN_USERNAME, authenticated: true });
});

export default router;
