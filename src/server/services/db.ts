import fs from "fs-extra";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");

export const readJSON = async (filename: string) => {
  const filePath = path.join(DATA_DIR, filename);
  try {
    return await fs.readJson(filePath);
  } catch (err) {
    return null;
  }
};

export const initDefaults = async () => {
  const analyticsFile = path.join(DATA_DIR, "analytics.json");
  if (!(await fs.pathExists(analyticsFile))) {
    const defaultAnalytics = {
      totalRequests: 0,
      activeUsers: 0,
      totalLogins: 0,
      mostActiveUser: "N/A",
      avgResponseTime: 0,
      uptime: "99.9%"
    };
    await fs.writeJson(analyticsFile, defaultAnalytics, { spaces: 2 });
  }
};

export const writeJSON = async (filename: string, data: any) => {
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeJson(filePath, data, { spaces: 2 });
};
