// @ts-nocheck
import React, { useMemo, useState, useCallback, useDeferredValue, useRef, useEffect } from "react";
import { 
  AlertTriangle, RefreshCw, Plus, LayoutGrid, List, Search, 
  Filter, Server as ServerIcon, X
} from "lucide-react";
import { 
  LazyMotion, domAnimation, m, AnimatePresence, useReducedMotion, 
  useScroll, useSpring, useTransform 
} from "framer-motion";

import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { useDashboardData } from "../hooks/useDashboardData";
import { PrimaryButton, PrimaryLinkButton } from "../components/dashboard/Shared";
import { ResourcesSlider } from "../components/dashboard/ResourcesSlider";
import { ServerRow } from "../components/dashboard/ServerRow";
import { ServerCard } from "../components/dashboard/ServerCard";

// ==========================================
// Types & Constants
// ==========================================

type ViewMode = "grid" | "list";
type StatusFilter = "all" | "online" | "offline";

const TRANSITION_SPRING = { type: "spring", stiffness: 300, damping: 30 };

// ==========================================
// Animated Background System
// ==========================================

const AnimatedBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { panelBackgroundImage } = useSettings();

  useEffect(() => {
    if (reduceMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [reduceMotion]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Base gradient - only shown if no custom background image set */}
      {!panelBackgroundImage ? (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      ) : (
        <div className="absolute inset-0 bg-slate-950/20" />
      )}

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Orb 1 - Indigo */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-30 blur-[100px] animate-float-1"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.8) 0%, transparent 70%)",
            top: "10%",
            left: "15%",
          }}
        />
        
        {/* Orb 2 - Purple */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] animate-float-2"
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.8) 0%, transparent 70%)",
            top: "50%",
            right: "10%",
          }}
        />
        
        {/* Orb 3 - Blue */}
        <div 
          className="absolute w-[400px] h-[400px] rounded-full opacity-25 blur-[80px] animate-float-3"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.8) 0%, transparent 70%)",
            bottom: "10%",
            left: "30%",
          }}
        />

        {/* Orb 4 - Pink accent */}
        <div 
          className="absolute w-[300px] h-[300px] rounded-full opacity-15 blur-[60px] animate-float-4"
          style={{
            background: "radial-gradient(circle, rgba(236,72,153,0.8) 0%, transparent 70%)",
            top: "30%",
            right: "30%",
          }}
        />
      </div>

      {/* Interactive mouse-following gradient */}
      <div 
        className="absolute inset-0 transition-all duration-300 ease-out pointer-events-none"
        style={{
          background: reduceMotion 
            ? "transparent" 
            : `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(99,102,241,0.15), transparent 40%)`,
        }}
      />

      {/* Dot grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Animated mesh lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke="rgba(255,255,255,1)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-950/80 to-transparent" />
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950/80 to-transparent" />
    </div>
  );
};

// ==========================================
// Utility Components
// ==========================================

const ScrollProgressIndicator = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <m.div 
      className="fixed left-0 right-0 top-0 z-50 h-[3px] origin-left bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
};

const DashboardSkeleton = () => (
  <div className="relative z-10 mx-auto max-w-7xl space-y-8 px-4 pb-20 pt-8 sm:px-6 lg:px-8 animate-pulse">
    <div className="space-y-4">
      <div className="h-6 w-32 rounded-full bg-card/50" />
      <div className="h-12 w-80 rounded-lg bg-card/50" />
      <div className="h-4 w-96 rounded bg-card/30" />
    </div>
    <div className="h-32 rounded-2xl bg-card/50" />
    <div className="h-14 rounded-2xl bg-card/50" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-56 rounded-2xl bg-card/50" />
      ))}
    </div>
  </div>
);

// ==========================================
// Feature Components
// ==========================================

interface DashboardHeaderProps {
  username?: string;
  lastUpdated: Date | null;
  isAdmin: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const DashboardHeader = ({ username, lastUpdated, isAdmin, onRefresh, isRefreshing }: DashboardHeaderProps) => {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  
  const y = useTransform(scrollY, [0, 300], [0, -20]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  return (
    <m.header 
      style={reduceMotion ? undefined : { y, opacity }}
      className="relative z-20 flex flex-col gap-6 pb-6 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            System Nominal
          </span>
          <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest">Control Center</span>
        </div>

        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
              Welcome back,
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {username || "Commander"}
            </span>
          </h1>
          
          <p className="mt-3 max-w-xl text-base text-muted-foreground leading-relaxed">
            Real-time infrastructure telemetry and node orchestration dashboard.
          </p>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <AnimatePresence mode="wait">
            {lastUpdated && (
              <m.button
                onClick={onRefresh}
                disabled={isRefreshing}
                key={lastUpdated.getTime()}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-background/50 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md transition-all hover:border-indigo-500/30 hover:bg-indigo-500/5 hover:text-indigo-400 disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 transition-transform duration-700 ${isRefreshing ? "animate-spin" : "group-hover:rotate-180"}`} />
                Synced {lastUpdated.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
              </m.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {isAdmin && (
        <m.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <PrimaryLinkButton to="/servers/create" className="shadow-lg shadow-indigo-500/20">
            <Plus className="mr-2 h-4 w-4" /> 
            Deploy Instance
          </PrimaryLinkButton>
        </m.div>
      )}
    </m.header>
  );
};

interface QuickStatsProps {
  total: number;
  online: number;
  offline: number;
}

const QuickStats = ({ total, online, offline }: QuickStatsProps) => (
  <div className="flex flex-wrap items-center gap-4 rounded-xl border border-white/5 bg-background/40 px-4 py-3 text-sm text-muted-foreground backdrop-blur-sm">
    <div className="flex items-center gap-1.5">
      <ServerIcon className="h-3.5 w-3.5" />
      <span className="font-semibold text-foreground">{total}</span> Total
    </div>
    <div className="h-4 w-px bg-border" />
    <div className="flex items-center gap-1.5">
      <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
      <span className="font-semibold text-emerald-400">{online}</span> Online
    </div>
    <div className="h-4 w-px bg-border" />
    <div className="flex items-center gap-1.5">
      <div className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
      <span className="font-semibold text-rose-400">{offline}</span> Offline
    </div>
  </div>
);

interface ControlBarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (s: StatusFilter) => void;
  filteredCount: number;
  totalCount: number;
}

const ControlBar = ({ 
  viewMode, setViewMode, searchQuery, setSearchQuery, 
  statusFilter, setStatusFilter, filteredCount, totalCount
}: ControlBarProps) => {
  return (
    <div className="sticky top-4 z-30 mb-6 overflow-hidden rounded-2xl border border-white/10 bg-background/80 p-2 shadow-2xl shadow-black/10 backdrop-blur-xl">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        
        {/* Search Section */}
        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-indigo-400" />
          <input
            type="text"
            placeholder="Search instances by name, ID, or software..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-transparent bg-transparent pl-10 pr-10 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-indigo-500/20 focus:bg-indigo-500/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-white/5 pt-3 md:border-t-0 md:pt-0">
          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="h-10 appearance-none rounded-xl border border-transparent bg-transparent pl-9 pr-8 text-sm font-medium text-foreground focus:bg-indigo-500/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer transition-all"
            >
              <option value="all">All Nodes</option>
              <option value="online">Active Only</option>
              <option value="offline">Offline Only</option>
            </select>
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 border-l border-white/10 pl-2">
              <div className="h-0 w-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-muted-foreground" />
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center rounded-xl bg-black/20 p-1 border border-white/5">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-2 transition-all duration-200 ${viewMode === "grid" ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
              aria-label="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg p-2 transition-all duration-200 ${viewMode === "list" ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
              aria-label="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Active Filters Indicator */}
      <AnimatePresence>
        {(searchQuery || statusFilter !== "all") && (
          <m.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex items-center gap-2 border-t border-white/5 px-3 pt-2 text-xs text-muted-foreground overflow-hidden"
          >
            <span>Showing <span className="font-semibold text-foreground">{filteredCount}</span> of {totalCount} instances</span>
            <button 
              onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
              className="ml-auto text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
            >
              Clear all filters
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface EmptyStateProps {
  hasFilters: boolean;
  isAdmin: boolean;
  reduceMotion: boolean;
  key?: string;
}

const EmptyState = ({ hasFilters, isAdmin, reduceMotion }: EmptyStateProps) => (
  <m.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/10 bg-background/40 p-12 text-center backdrop-blur-sm"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
    
    <m.div 
      animate={reduceMotion ? {} : { y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 ring-1 ring-inset ring-indigo-500/20"
    >
      {hasFilters ? <Search className="h-8 w-8 text-indigo-400" /> : <ServerIcon className="h-8 w-8 text-indigo-400" />}
    </m.div>
    
    <h3 className="relative mb-2 text-xl font-bold text-foreground">
      {hasFilters ? "No matching instances found" : "Infrastructure Empty"}
    </h3>
    <p className="relative mb-8 max-w-sm text-sm text-muted-foreground leading-relaxed">
      {hasFilters 
        ? "Try adjusting your search parameters or clearing filters to see more results." 
        : "Get started by deploying your first server instance to begin monitoring."}
    </p>
    
    {!hasFilters && isAdmin && (
      <PrimaryLinkButton to="/servers/create" className="relative shadow-xl shadow-indigo-500/20">
        <Plus className="mr-2 h-4 w-4" /> Initialize Deployment
      </PrimaryLinkButton>
    )}
  </m.div>
);

// ==========================================
// Main Dashboard Component
// ==========================================

export default function Dashboard() {
  const { user } = useAuth();
  const reduceMotion = useReducedMotion();
  const { stats, servers, state, lastUpdated, refetch } = useDashboardData();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const deferredSearchQuery = useDeferredValue(searchQuery);

  const isAdmin = user?.role === "admin" || user?.role === "owner";

  const filteredServers = useMemo(() => {
    const query = deferredSearchQuery.toLowerCase().trim();
    
    return servers.filter((server) => {
      const matchesSearch = !query || 
        server.name.toLowerCase().includes(query) ||
        server.id.toLowerCase().includes(query) ||
        server.software?.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      if (statusFilter === "online") return server.status === "online";
      if (statusFilter === "offline") return server.status !== "online";
      
      return true;
    });
  }, [servers, deferredSearchQuery, statusFilter]);

  const onlineCount = useMemo(() => servers.filter(s => s.status === "online").length, [servers]);
  const offlineCount = servers.length - onlineCount;

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 600);
  }, [refetch]);

  if (state === "loading" && !stats && servers.length === 0) {
    return (
      <LazyMotion features={domAnimation} strict>
        <AnimatedBackground />
        <DashboardSkeleton />
      </LazyMotion>
    );
  }

  if (state === "error" && !stats && servers.length === 0) {
    return (
      <LazyMotion features={domAnimation} strict>
        <AnimatedBackground />
        <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
          <m.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md rounded-3xl border border-rose-500/20 bg-background/80 p-8 text-center shadow-2xl backdrop-blur-xl"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 ring-1 ring-rose-500/30">
              <AlertTriangle className="h-8 w-8 text-rose-400" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">Connection Failed</h2>
            <p className="mb-8 text-muted-foreground">
              Unable to establish secure connection with the telemetry backend. 
              Please verify network connectivity and try again.
            </p>
            <PrimaryButton onClick={handleRefresh} className="w-full justify-center">
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Reinitialize Connection
            </PrimaryButton>
          </m.div>
        </div>
      </LazyMotion>
    );
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="relative min-h-screen w-full overflow-x-hidden bg-transparent text-foreground selection:bg-indigo-500/30">
        <AnimatedBackground />
        <ScrollProgressIndicator />

        <main className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
          <DashboardHeader 
            username={user?.username}
            lastUpdated={lastUpdated}
            isAdmin={isAdmin}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />

          <div className="space-y-8">
            <ResourcesSlider stats={stats} />

            <section aria-label="Server Management" className="space-y-6">
              <QuickStats total={servers.length} online={onlineCount} offline={offlineCount} />
              
              <ControlBar 
                viewMode={viewMode}
                setViewMode={setViewMode}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                totalCount={servers.length}
                filteredCount={filteredServers.length}
              />

              <AnimatePresence mode="popLayout">
                {filteredServers.length === 0 ? (
                  <EmptyState 
                    key="empty"
                    hasFilters={searchQuery.length > 0 || statusFilter !== "all"} 
                    isAdmin={isAdmin}
                    reduceMotion={reduceMotion}
                  />
                ) : viewMode === "grid" ? (
                  <m.div 
                    key="grid-view"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={TRANSITION_SPRING}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  >
                    <AnimatePresence>
                      {filteredServers.map((server) => (
                        <m.div 
                          key={server.id} 
                          layout 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ServerCard server={server} onStatusChange={handleRefresh} />
                        </m.div>
                      ))}
                    </AnimatePresence>
                  </m.div>
                ) : (
                  <m.div 
                    key="list-view"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={TRANSITION_SPRING}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-background/40 shadow-xl backdrop-blur-md"
                  >
                    <div className="divide-y divide-border-subtle">
                      {filteredServers.map((server, index) => (
                        <ServerRow key={server.id} server={server} index={index} />
                      ))}
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        </main>
      </div>

      {/* CSS Animations for floating orbs */}
      <style>{`
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, 30px) scale(0.95); }
          66% { transform: translate(30px, -40px) scale(1.05); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, 20px) scale(1.05); }
          66% { transform: translate(-30px, -30px) scale(0.95); }
        }
        @keyframes float-4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, -35px) scale(0.95); }
          66% { transform: translate(35px, 25px) scale(1.05); }
        }
        .animate-float-1 { animation: float-1 20s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 25s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 18s ease-in-out infinite; }
        .animate-float-4 { animation: float-4 22s ease-in-out infinite; }
      `}</style>
    </LazyMotion>
  );
}
