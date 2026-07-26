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

async function pull(img) {
    console.log("Pulling", img);
    return new Promise((resolve, reject) => {
      docker.pull(img, (err, stream) => {
        if (err) return reject(err);
        docker.modem.followProgress(stream, (err, output) => {
          if (err) return reject(err);
          resolve(output);
        });
      });
    });
}

async function test() {
    try {
        await pull("itzg/minecraft-server:latest");
        console.log("Pulled short");
    } catch(e) {
        console.error("Short failed", e.message);
    }
}
test();
