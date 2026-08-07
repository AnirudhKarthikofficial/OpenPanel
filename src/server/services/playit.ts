import axios from "axios";
import { isSandbox } from "./docker.js";
import { readJSON } from "./db.js";

const PLAYIT_API_BASE = "https://api.playit.gg";

// Helper to get the playit agent secret key from settings or environment
export async function getPlayitSecretKey(): Promise<string | null> {
  if (process.env.PLAYIT_SECRET_KEY) {
    return process.env.PLAYIT_SECRET_KEY;
  }
  const settings = await readJSON("settings.json");
  return settings?.playitSecretKey || null;
}

export interface PlayitTunnelResult {
  id: string;
  name: string;
  publicAddress: string;
  status: "active" | "pending" | "error" | "disabled";
}

// Create a playit tunnel targeting local port (TCP and optionally UDP)
export async function createPlayitTunnel(
  serverId: string,
  serverName: string,
  localPort: number,
  isUdpRequired: boolean = false
): Promise<PlayitTunnelResult> {
  if (isSandbox) {
    console.log(`[Playit Sandbox] Mock creating tunnel for server ${serverId} targeting port ${localPort}`);
    return {
      id: `mock-tunnel-${serverId}`,
      name: `Playit-Tunnel-${serverName}`,
      publicAddress: `${serverName.toLowerCase().replace(/[^a-z0-9]/g, "-")}.gl.at.ply.gg:12345`,
      status: "active",
    };
  }

  const secretKey = await getPlayitSecretKey();
  if (!secretKey) {
    throw new Error("Playit Secret Key/Agent Key is not configured in settings.");
  }

  try {
    // Determine PortType and TunnelType
    const portType = isUdpRequired ? "both" : "tcp";
    const tunnelType = "minecraft-java";

    const payload = {
      name: `OpenPanel-${serverName}-${serverId.substring(0, 8)}`,
      tunnelType,
      portType,
      portCount: 1,
      enabled: true,
      origin: {
        type: "local",
        ip: "127.0.0.1",
        port: localPort,
      },
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": secretKey.startsWith("AgentKey ") ? secretKey : `AgentKey ${secretKey}`,
    };

    const response = await axios.post(`${PLAYIT_API_BASE}/tunnels/create`, payload, { headers });
    const data = response.data;

    // Parse Response to retrieve public address and id
    // Playit tunnels list response properties might vary, let's extract carefully
    const tunnelId = data?.id || `tunnel-${Date.now()}`;
    const alloc = data?.alloc || {};
    const ip = alloc?.ip?.ip || "unknown.gl.at.ply.gg";
    const port = alloc?.port?.start || 25565;
    const publicAddress = `${ip}:${port}`;

    return {
      id: tunnelId,
      name: payload.name,
      publicAddress,
      status: "active",
    };
  } catch (error: any) {
    console.error("Failed to create Playit.gg tunnel via API:", error?.response?.data || error?.message);
    throw new Error(error?.response?.data?.error || error?.message || "Failed to create playit.gg tunnel");
  }
}

// Delete a playit tunnel by tunnel ID
export async function deletePlayitTunnel(tunnelId: string): Promise<boolean> {
  if (isSandbox) {
    console.log(`[Playit Sandbox] Mock deleting tunnel ${tunnelId}`);
    return true;
  }

  if (tunnelId.startsWith("mock-")) {
    return true;
  }

  const secretKey = await getPlayitSecretKey();
  if (!secretKey) {
    throw new Error("Playit Secret Key/Agent Key is not configured.");
  }

  try {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": secretKey.startsWith("AgentKey ") ? secretKey : `AgentKey ${secretKey}`,
    };

    await axios.post(`${PLAYIT_API_BASE}/tunnels/delete`, { id: tunnelId }, { headers });
    return true;
  } catch (error: any) {
    console.error(`Failed to delete Playit.gg tunnel ${tunnelId}:`, error?.response?.data || error?.message);
    // Suppress delete errors to avoid blocking flow
    return false;
  }
}

// Fetch status of tunnels/verify public address
export async function getPlayitTunnelsList(): Promise<any[]> {
  if (isSandbox) {
    return [];
  }

  const secretKey = await getPlayitSecretKey();
  if (!secretKey) {
    return [];
  }

  try {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": secretKey.startsWith("AgentKey ") ? secretKey : `AgentKey ${secretKey}`,
    };

    const response = await axios.post(`${PLAYIT_API_BASE}/tunnels/list`, {}, { headers });
    return response.data?.tunnels || response.data || [];
  } catch (error: any) {
    console.error("Failed to list Playit tunnels:", error?.response?.data || error?.message);
    return [];
  }
}
