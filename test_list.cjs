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
console.log(docker);
