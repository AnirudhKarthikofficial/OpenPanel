import { readJSON, writeJSON } from "./db.js";
import { startContainer, stopContainer, restartContainer } from "./docker.js";
import { ZipArchive } from "archiver";
import fs from "fs-extra";
import path from "path";

export interface Schedule {
  id: string;
  serverId: string;
  name: string;
  action: "start" | "stop" | "restart" | "backup";
  intervalType: "minutes" | "hourly" | "daily" | "weekly";
  intervalMinutes?: number;
  hour?: number;
  minute?: number;
  dayOfWeek?: number;
  lastRun?: string;
  isActive: boolean;
  createdAt: string;
}

const SCHEDULES_FILE = "schedules.json";

async function performBackup(serverId: string): Promise<void> {
  const serverDir = path.join(process.cwd(), ".data", "servers", serverId);
  const backupsDir = path.join(process.cwd(), ".data", "backups", serverId);
  await fs.ensureDir(backupsDir);

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `backup-scheduled-${timestamp}.zip`;
  const backupPath = path.join(backupsDir, filename);

  const serverExists = await fs.pathExists(serverDir);
  if (!serverExists) {
    await fs.ensureDir(serverDir);
  }

  const output = fs.createWriteStream(backupPath);
  const archive = new ZipArchive({ zlib: { level: 9 } });

  return new Promise<void>((resolve, reject) => {
    output.on("close", () => resolve());
    archive.on("error", (err: any) => reject(err));
    archive.pipe(output);
    archive.directory(serverDir, false);
    archive.finalize();
  });
}

export async function runScheduledTask(serverId: string, action: string): Promise<void> {
  const servers = await readJSON("servers.json") || [];
  const server = servers.find((s: any) => s.id === serverId);
  if (!server) {
    console.error(`[Scheduler] Server not found for ID: ${serverId}`);
    return;
  }

  console.log(`[Scheduler] Running action ${action} for server ${server.name} (${serverId})`);

  try {
    if (action === "start") {
      if (server.containerId) {
        await startContainer(server.containerId, server.nodeId);
      } else {
        console.warn(`[Scheduler] No containerId found for server: ${serverId}`);
      }
    } else if (action === "stop") {
      if (server.containerId) {
        await stopContainer(server.containerId, server.nodeId);
      }
    } else if (action === "restart") {
      if (server.containerId) {
        await restartContainer(server.containerId, server.nodeId);
      }
    } else if (action === "backup") {
      await performBackup(serverId);
    } else {
      console.error(`[Scheduler] Unknown action: ${action}`);
    }
  } catch (err: any) {
    console.error(`[Scheduler] Error running task ${action} for server ${serverId}:`, err.message || err);
  }
}

export async function checkAndRunSchedules(): Promise<void> {
  let schedules: Schedule[] = await readJSON(SCHEDULES_FILE) || [];
  let updated = false;

  const now = new Date();
  const currentMinutes = now.getUTCMinutes();
  const currentHours = now.getUTCHours();
  const currentDay = now.getUTCDay();

  for (const schedule of schedules) {
    if (!schedule.isActive) continue;

    let shouldRun = false;
    const lastRunTime = schedule.lastRun ? new Date(schedule.lastRun).getTime() : 0;

    if (schedule.intervalType === "minutes") {
      const intervalMs = (schedule.intervalMinutes || 30) * 60 * 1000;
      if (Date.now() - lastRunTime >= intervalMs) {
        shouldRun = true;
      }
    } else if (schedule.intervalType === "hourly") {
      const targetMinute = schedule.minute !== undefined ? schedule.minute : 0;
      if (currentMinutes === targetMinute) {
        // Run if never run, or last run was at least 45 minutes ago
        if (Date.now() - lastRunTime >= 45 * 60 * 1000) {
          shouldRun = true;
        }
      }
    } else if (schedule.intervalType === "daily") {
      const targetHour = schedule.hour !== undefined ? schedule.hour : 0;
      const targetMinute = schedule.minute !== undefined ? schedule.minute : 0;
      if (currentHours === targetHour && currentMinutes === targetMinute) {
        // Run if never run, or last run was at least 23 hours ago
        if (Date.now() - lastRunTime >= 23 * 60 * 60 * 1000) {
          shouldRun = true;
        }
      }
    } else if (schedule.intervalType === "weekly") {
      const targetDay = schedule.dayOfWeek !== undefined ? schedule.dayOfWeek : 0;
      const targetHour = schedule.hour !== undefined ? schedule.hour : 0;
      const targetMinute = schedule.minute !== undefined ? schedule.minute : 0;
      if (currentDay === targetDay && currentHours === targetHour && currentMinutes === targetMinute) {
        // Run if never run, or last run was at least 6 days ago
        if (Date.now() - lastRunTime >= 6 * 24 * 60 * 60 * 1000) {
          shouldRun = true;
        }
      }
    }

    if (shouldRun) {
      schedule.lastRun = now.toISOString();
      updated = true;
      // Run asynchronously to not block the tick loop
      runScheduledTask(schedule.serverId, schedule.action).catch((err) => {
        console.error(`[Scheduler] Task execution failed:`, err);
      });
    }
  }

  if (updated) {
    await writeJSON(SCHEDULES_FILE, schedules);
  }
}

export function startScheduler(): void {
  console.log("[Scheduler] Background task runner initialized.");
  // Run checks every 30 seconds
  setInterval(() => {
    checkAndRunSchedules().catch((err) => {
      console.error("[Scheduler] Error checking schedules:", err);
    });
  }, 30 * 1000);
}
