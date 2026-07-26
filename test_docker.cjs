const Docker = require('dockerode');
const fs = require('fs');
const getSocketPath = () => {
  if (process.env.CONTAINER_ENGINE === 'podman') {
    if (fs.existsSync('/run/podman/podman.sock')) return '/run/podman/podman.sock';
    if (fs.existsSync('/var/run/podman/podman.sock')) return '/var/run/podman/podman.sock';
  }
  if (fs.existsSync('/run/podman/podman.sock')) return '/run/podman/podman.sock';
  if (fs.existsSync('/var/run/podman/podman.sock')) return '/var/run/podman/podman.sock';
  if (fs.existsSync('/var/run/docker.sock')) return '/var/run/docker.sock';
  if (fs.existsSync('/run/docker.sock')) return '/run/docker.sock';
  return '/var/run/docker.sock';
};
const docker = new Docker({ socketPath: getSocketPath() });
async function test() {
  console.log("Using socket:", getSocketPath());
  try {
    const images = await docker.listImages();
    console.log("Images:", images.map(i => i.RepoTags).flat());
  } catch(e) {
    console.error("List error:", e.message);
  }
}
test();
