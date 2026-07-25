const fs = require('fs');
const path = 'src/pages/SettingsPage.tsx';
let content = fs.readFileSync(path, 'utf8');

// Find the start of Platform Preferences
const targetStart = '{user.role === "admin" && (\\n        <div className="bg-black/40';

// We'll just replace the whole Platform Preferences block up to the Background Configuration block
const blockRegex = /\{user\.role === "admin" && \(\s*<div className="bg-black\/40[\s\S]*?(?=\{user\.role === "admin" && \(\s*<div className="bg-muted backdrop-blur-xl border border-border-subtle rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden mt-8">)/;

const newBlock = `{user.role === "admin" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-10">
          
          {/* Branding & Identity */}
          <div className="bg-card border border-border-subtle rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
            <h2 className="text-xl font-bold mb-6 flex items-center text-foreground">
              <Layout className="mr-3 text-indigo-400 w-5 h-5" /> Branding & Identity
            </h2>
            <div className="flex flex-col gap-8">
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSavingSettings(true);
                  try {
                    await axios.put("/api/system/settings", { panelName: newPanelName });
                    fetchSettings();
                  } catch (err: any) {
                    alert(err.response?.data?.error || "Error updating settings");
                  } finally {
                    setIsSavingSettings(false);
                  }
                }}
              >
                <label className="block text-sm font-medium text-muted-foreground mb-2">Panel Name</label>
                <div className="flex gap-3">
                  <input 
                    required 
                    value={newPanelName} 
                    onChange={e => setNewPanelName(e.target.value)} 
                    type="text" 
                    placeholder="Enter panel name"
                  />
                  <button disabled={isSavingSettings} type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-[0.98] whitespace-nowrap disabled:opacity-50">
                    {isSavingSettings ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">Panel Logo</label>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-muted border border-border-subtle flex items-center justify-center overflow-hidden flex-shrink-0 relative group shadow-inner">
                    {panelLogo ? (
                      <img src={panelLogo} alt="Panel Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Layout className="w-8 h-8 text-muted-foreground/50" />
                    )}
                    {panelLogo && (
                      <button 
                        onClick={async () => {
                          try {
                            await axios.put("/api/system/settings", { panelLogo: "" });
                            fetchSettings();
                          } catch(e) {}
                        }}
                        className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                        title="Remove logo"
                      >
                        <Trash2 size={20} className="text-white" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex-1 w-full text-center sm:text-left">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={(e) => handleFileChange(e, "logo")}
                    />
                    <button 
                      disabled={isUpdatingLogo}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center justify-center gap-2 bg-muted hover:bg-muted-hover text-foreground border border-border font-medium px-5 py-2.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 w-full sm:w-auto mb-2"
                    >
                      {isUpdatingLogo ? <div className="w-4 h-4 rounded-full border-2 border-muted-foreground border-t-foreground animate-spin"></div> : <Upload size={18} />}
                      {isUpdatingLogo ? "Uploading..." : (panelLogo ? "Replace Logo" : "Upload Logo")}
                    </button>
                    <p className="text-xs text-muted-foreground">We recommend a square image, PNG or JPG format, at least 256x256px.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Features */}
          <div className="bg-card border border-border-subtle rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
            <h2 className="text-xl font-bold mb-6 flex items-center text-foreground">
              <RefreshCw className="mr-3 text-emerald-400 w-5 h-5" /> Platform Features
            </h2>
            <div className="flex flex-col gap-6">
              
              <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-muted/50 border border-border-subtle">
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Playit Tunnel Integration</h3>
                  <p className="text-xs text-muted-foreground mt-1">Allow users to expose their local servers to the internet using playit.gg tunnels.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
                  <input 
                    type="checkbox" 
                    checked={newEnablePlayit} 
                    onChange={async (e) => {
                      const val = e.target.checked;
                      setNewEnablePlayit(val);
                      try {
                        await axios.put("/api/system/settings", { enablePlayit: val });
                        fetchSettings();
                      } catch (err) { console.error(err); }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-muted/50 border border-border-subtle">
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Onboarding Tutorial</h3>
                  <p className="text-xs text-muted-foreground mt-1">Show a guided tour to new users when they log in for the first time.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
                  <input 
                    type="checkbox" 
                    checked={newEnableTutorial} 
                    onChange={async (e) => {
                      const val = e.target.checked;
                      setNewEnableTutorial(val);
                      try {
                        await axios.put("/api/system/settings", { enableTutorial: val });
                        fetchSettings();
                      } catch (err) { console.error(err); }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-muted/50 border border-border-subtle">
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Cinematic Login Intro</h3>
                  <p className="text-xs text-muted-foreground mt-1">Enable the animated sequence on the login screen.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
                  <input 
                    type="checkbox" 
                    checked={newEnableLoginAnimation} 
                    onChange={async (e) => {
                      const val = e.target.checked;
                      setNewEnableLoginAnimation(val);
                      try {
                        await axios.put("/api/system/settings", { enableLoginAnimation: val });
                        fetchSettings();
                      } catch (err) { console.error(err); }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

            </div>
          </div>
        </div>
      )}

      `;

if (blockRegex.test(content)) {
  content = content.replace(blockRegex, newBlock);
  fs.writeFileSync(path, content);
  console.log('Successfully applied patch-platform-prefs');
} else {
  console.log('Could not match Platform Preferences block!');
}
