import Docker from "dockerode";
async function main() {
  const docker = new Docker({
    protocol: "https",
    host: "nodjtg.gtk.qzz.io",
    port: 443,
  });
  try {
    const res = await docker.ping();
    console.log("Ping success:", res.toString());
  } catch (e: any) {
    console.error("Ping failed:", e.message || e);
    console.error("Status:", e.statusCode);
  }
}
main();
