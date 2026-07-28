import sys

with open("install.sh", "r") as f:
    content = f.read()

content = content.replace("Node.js 20.x", "Node.js 22.x")
content = content.replace("-lt 20", "-lt 22")
content = content.replace("setup_20.x", "setup_22.x")

with open("install.sh", "w") as f:
    f.write(content)

print("install.sh patched for Node 22")
