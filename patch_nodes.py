import re

content = open('src/pages/Nodes.tsx').read()

content = content.replace(
    'const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);',
    'const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);\n  const [setupPort, setSetupPort] = useState("6768");'
)

new_setup_modal = """
              <p className="mb-4 text-sm text-muted-foreground">
                Run this command as root on your Ubuntu/Debian VPS to automatically install Docker, set up the agent, and generate a connection key.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Custom Port (Optional, e.g. 67678)</label>
                <input 
                  type="text" 
                  value={setupPort}
                  onChange={(e) => setSetupPort(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="6768"
                />
              </div>

              <div className="relative">
                <pre className="overflow-x-auto rounded-xl bg-black/50 p-4 text-sm text-emerald-400 border border-white/5">
                  <code>{`curl -sSL ${window.location.origin}/node.sh | bash -s -- --port ${setupPort || "6768"}`}</code>
                </pre>
                <button 
                  onClick={() => navigator.clipboard.writeText(`curl -sSL ${window.location.origin}/node.sh | bash -s -- --port ${setupPort || "6768"}`)}
                  className="absolute right-2 top-2 rounded-lg bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
                >
                  Copy
                </button>
              </div>
"""

content = re.sub(
    r'<p className="mb-4 text-sm text-muted-foreground">.*?</div>',
    new_setup_modal.strip(),
    content,
    flags=re.DOTALL
)

open('src/pages/Nodes.tsx', 'w').write(content)
