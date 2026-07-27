import express from "express";
import fs from "fs-extra";
import path from "path";
import crypto from "crypto";
import { readJSON, writeJSON } from "../services/db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();
const NODES_FILE = "nodes.json";

// Initialize nodes file
const initNodes = async () => {
  let nodes = await readJSON(NODES_FILE);
  if (!nodes) {
    nodes = [
      {
        id: "local",
        name: "Local Node",
        ip: "127.0.0.1",
        port: 6767,
        key: "local",
        isLocal: true,
        status: "online",
        createdAt: new Date().toISOString()
      }
    ];
    await writeJSON(NODES_FILE, nodes);
  }
};
initNodes();

router.use(requireAdmin);

router.get("/", async (req, res) => {
  const nodes = await readJSON(NODES_FILE) || [];
  res.json(nodes);
});

router.post("/", async (req, res) => {
  const { name, ip, port, key } = req.body;
  if (!name || !ip || !port || !key) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const nodes = await readJSON(NODES_FILE) || [];
  const newNode = {
    id: crypto.randomBytes(8).toString("hex"),
    name,
    ip,
    port: Number(port),
    key,
    isLocal: false,
    status: "connecting",
    createdAt: new Date().toISOString()
  };

  nodes.push(newNode);
  await writeJSON(NODES_FILE, nodes);
  res.json(newNode);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (id === "local") return res.status(400).json({ error: "Cannot delete local node" });

  const nodes = await readJSON(NODES_FILE) || [];
  const filtered = nodes.filter((n: any) => n.id !== id);
  await writeJSON(NODES_FILE, filtered);
  res.json({ success: true });
});

export default router;
