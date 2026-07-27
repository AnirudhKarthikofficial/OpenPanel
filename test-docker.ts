import { getDocker } from "./src/server/services/docker.js";

async function main() {
  console.log("Testing docker connection...");
  const docker = await getDocker("cftunnel1");
  try {
    const pinger = new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error("Timeout")), 2000);
      docker.ping().then(resolve).catch(reject);
    });
    await pinger;
    console.log("Ping successful!");
  } catch (e: any) {
    console.error("Ping failed:");
    console.error(e.message);
  }
  process.exit(0);
}

main();
