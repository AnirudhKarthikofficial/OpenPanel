import re

content = open('src/server/services/docker.ts').read()

new_get_docker = """
export const getDocker = async (nodeId?: string) => {
  if (!nodeId || nodeId === "local") return defaultDocker;
  const nodes = await readJSON("nodes.json") || [];
  const node = nodes.find((n: any) => n.id === nodeId);
  if (node) {
    let host = node.ip;
    let protocol = "http";
    let port = node.port;
    if (host.startsWith("http://") || host.startsWith("https://")) {
      try {
        const url = new URL(host);
        protocol = url.protocol.replace(':', '');
        host = url.hostname;
        if (url.port) port = parseInt(url.port);
        else port = protocol === "https" ? 443 : 80;
      } catch (e) {
        console.error("Invalid URL in node IP", host);
      }
    }
    return new Docker({
      protocol,
      host,
      port,
      headers: { Authorization: "Bearer " + node.key }
    });
  }
  return defaultDocker;
};
"""

content = re.sub(r'export const getDocker = async.*?return defaultDocker;\n};', new_get_docker.strip(), content, flags=re.DOTALL)

open('src/server/services/docker.ts', 'w').write(content)
