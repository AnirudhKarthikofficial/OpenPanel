import re
content = open('src/pages/Nodes.tsx').read()
content = content.replace(
    '<label className="mb-1 block text-sm font-medium text-muted-foreground">IP Address</label>',
    '<label className="mb-1 block text-sm font-medium text-muted-foreground">IP or Domain/URL</label>'
)
content = content.replace(
    'placeholder="192.168.1.100"',
    'placeholder="192.168.1.100 or https://tunnel.yourdomain.com"'
)
open('src/pages/Nodes.tsx', 'w').write(content)
