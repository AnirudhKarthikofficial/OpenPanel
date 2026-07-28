const fs = require('fs');

let content = fs.readFileSync('src/server/routes/system.ts', 'utf-8');

const regex = /router\.get\("\/stats", async \(req, res\) => \{[\s\S]*?\n\}\);\n/;

const newBlock = `import { getDocker, isSandbox, mockState } from "../services/docker.js";

function getCpuUsage(): Promise<number> {
  return new Promise((resolve) => {
    const startCpus = os.cpus();
    setTimeout(() => {
      const endCpus = os.cpus();
      let totalIdle = 0, totalTick = 0;
      
      for (let i = 0, len = startCpus.length; i < len; i++) {
        const start = startCpus[i].times;
        const end = endCpus[i].times;
        
        const startTick = start.user + start.nice + start.sys + start.idle + start.irq;
        const endTick = end.user + end.nice + end.sys + end.idle + end.irq;
        
        const idle = end.idle - start.idle;
        const total = endTick - startTick;
        
        totalIdle += idle;
        totalTick += total;
      }
      
      const usage = 100 - ~~(100 * totalIdle / totalTick);
      resolve(usage);
    }, 100);
  });
}

router.get("/stats", async (req, res) => {
  let diskSpace = 0;
  try {
    const { stdout } = await execPromise("df -h /home");
    const lines = stdout.split("\\n");
    if (lines.length > 1) {
      const parts = lines[1].trim().split(/\\s+/);
      if (parts.length >= 5) {
        diskSpace = parseInt(parts[4].replace("%", "")) || 0;
      }
    }
  } catch (err) {}
  
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  
  let cpuUsage = await getCpuUsage();
  
  let activeContainers = 0;
  let totalContainers = 0;
  
  try {
    if (isSandbox) {
       totalContainers = Object.keys(mockState).length;
       activeContainers = Object.values(mockState).filter(v => v).length;
    } else {
       const docker = await getDocker();
       const containers = await docker.listContainers({ all: true });
       totalContainers = containers.length;
       activeContainers = containers.filter(c => c.State === 'running').length;
    }
  } catch (err) {
     // fallback
  }
  
  res.json({
    cpuUsage: cpuUsage,
    totalMemory,
    freeMemory,
    ramUsage: Math.round(((totalMemory - freeMemory) / totalMemory) * 100),
    diskUsage: diskSpace,
    activeContainers,
    totalContainers
  });
});
`;

if (regex.test(content)) {
    content = content.replace(regex, newBlock);
    fs.writeFileSync('src/server/routes/system.ts', content);
    console.log("Replaced successfully");
} else {
    console.log("Could not find the block to replace!");
}
