const fs = require('fs');
const path = 'src/pages/SettingsPage.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `                  <span className="text-sm font-medium text-foreground-muted">Enable Login Screen Cinematic Animation</span>
                </label>
              </div>
            </div>`;

const themeUI = `                  <span className="text-sm font-medium text-foreground-muted">Enable Login Screen Cinematic Animation</span>
                </label>
              </div>
            </div>
            
            <div className="w-full mt-6">
              <label className="block text-sm font-medium text-muted-foreground mb-3">Panel Theme</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={async () => {
                    setNewTheme("dark");
                    try {
                      await axios.put("/api/system/settings", { theme: "dark" });
                      fetchSettings();
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className={\`flex items-center justify-center gap-2 rounded-xl border p-4 transition-all \${newTheme === "dark" ? "border-indigo-500 bg-indigo-500/10 text-indigo-500" : "border-border-subtle bg-background text-foreground-muted hover:border-border hover:bg-muted"}\`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#030305] text-white shadow-inner border border-gray-800">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  </div>
                  <span className="font-semibold">Dark Theme</span>
                </button>
                <button
                  onClick={async () => {
                    setNewTheme("light");
                    try {
                      await axios.put("/api/system/settings", { theme: "light" });
                      fetchSettings();
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className={\`flex items-center justify-center gap-2 rounded-xl border p-4 transition-all \${newTheme === "light" ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-500" : "border-border-subtle bg-white text-gray-700 hover:border-border hover:bg-gray-50"}\`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffffff] text-black shadow-inner border border-gray-200">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  <span className="font-semibold">Light Theme</span>
                </button>
              </div>
            </div>`;

if(content.includes(targetStr)) {
  content = content.replace(targetStr, themeUI);
  fs.writeFileSync(path, content);
  console.log('Inserted Theme UI successfully.');
} else {
  console.log('Could not find target string.');
}
