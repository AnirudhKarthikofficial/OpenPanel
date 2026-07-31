import express from "express";
import { readJSON } from "../services/db.js";

const router = express.Router();

router.get("/analytics", async (req, res) => {
  const stats = await readJSON("analytics.json") || {};

  res.json({ 
    totalRequests: stats.totalRequests || 0,
    activeUsers: stats.activeUsers || 0,
    totalLogins: stats.totalLogins || 0,
    mostActiveUser: stats.mostActiveUser || "N/A",
    avgResponseTime: stats.avgResponseTime || 0,
    uptime: stats.uptime || "99.9%"
  });
});

export default router;