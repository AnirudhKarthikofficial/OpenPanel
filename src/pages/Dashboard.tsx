import React, { useMemo, useState } from "react";
import { Server, Activity, Cpu, MemoryStick, AlertTriangle, RefreshCw, Plus, HardDrive, ChevronRight, LayoutGrid, List, Search, ShieldCheck, Zap, Key, Settings, Terminal, Radio } from "lucide-react";
import { LazyMotion, domAnimation, m, AnimatePresence, useReducedMotion, useScroll, useSpring, useTransform, Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDashboardData } from "../hooks/useDashboardData";
import { AmbientBackground } from "../components/dashboard/AmbientBackground";
import { PremiumLoader } from "../components/dashboard/PremiumLoader";
import { PrimaryButton, PrimaryLinkButton, Reveal, EASE_OUT_EXPO } from "../components/dashboard/Shared";
import { StatCard } from "../components/dashboard/StatCard";
import { ServerRow } from "../components/dashboard/ServerRow";
import { ServerCard } from "../components/dashboard/ServerCard";
import { ResourcesSlider } from "../components/dashboard/ResourcesSlider";

export default function Dashboard() {
  const { user } = useAuth();
  const reduce = useReducedMotion();
  const { stats, servers, state, lastUpdated, refetch } = useDashboardData();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "online" | "offline">("all");

  const { scrollYProgress, scrollY } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 25, restDelta: 0.001 });

  const headerY = useTransform(scrollY, [0, 300], [0, -30]);
  const headerOpacity = useTransform(scrollY, [0, 300], [1, 0.4]);
  const headerBlur = useTransform(scrollY, [0, 300], ["blur(0px)", "blur(6px)"]);

  const isAdmin = user?.role === "admin" || user?.role === "owner";
  
  const onlineCount = useMemo(() => servers.filter((s) => s.status === "online").length, [servers]);
  const offlineCount = useMemo(() => servers.filter((s) => s.status !== "online").length, [servers]);

  // Filtered servers
  const filteredServers = useMemo(() => {
    return servers.filter((server) => {
      const matchesSearch = 
        server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (server.software && server.software.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (statusFilter === "online") return server.status === "online";
      if (statusFilter === "offline") return server.status !== "online";
      return true;
    });
  }, [servers, searchQuery, statusFilter]);

  const containerAnim: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div aria-hidden style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[100] h-[2px] origin-left bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400" />
      <AmbientBackground />

      {state === "loading" && !stats && servers.length === 0 ? (
        <PremiumLoader />
      ) : state === "error" && !stats && servers.length === 0 ? (
        <div className="relative z-10 mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 backdrop-blur-xl">
            <AlertTriangle className="h-8 w-8 text-rose-400" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-foreground">API Connection Lost</h2>
          <p className="mb-6 text-sm text-muted-foreground">Unable to reach the dashboard services. Please check your network.</p>
          <PrimaryButton onClick={refetch}>
            <RefreshCw className="h-4 w-4" /> Retry Connection
          </PrimaryButton>
        </div>
      ) : (
        <div className="relative z-10 w-full space-y-8">
          {/* Header Banner */}
          <m.header style={reduce ? undefined : { y: headerY, opacity: headerOpacity, filter: headerBlur }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  Nodes Operational
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Overview
                </span>
              </div>

              <h1 className="bg-gradient-to-b from-foreground to-foreground-muted bg-clip-text text-3xl font-extrabold tracking-tight text-transparent drop-shadow-sm md:text-4xl">
                Welcome back, {user?.username || "Commander"} 👋
              </h1>

              <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                <p>Monitor real-time metrics, node telemetry, and active game instances.</p>
                <AnimatePresence mode="wait">
                  {lastUpdated && (
                    <m.button
                      onClick={() => refetch()}
                      key={lastUpdated.getTime()}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                      className="hidden items-center gap-1.5 rounded-full border border-border-subtle bg-muted/80 px-2.5 py-1 text-xs font-medium text-foreground-muted hover:text-foreground transition-all sm:inline-flex"
                      title="Click to refresh"
                    >
                      <RefreshCw className="h-3 w-3 text-indigo-400" />
                      Updated {lastUpdated.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </m.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {isAdmin && (
              <PrimaryLinkButton to="/servers/create">
                <Plus className="h-4 w-4" /> Deploy New Server
              </PrimaryLinkButton>
            )}
          </m.header>

          {/* Key Resources Slider */}
          <ResourcesSlider stats={stats} />

          {/* Server Management Section */}
          <div className="space-y-4">
            {/* Server Display */}
            {filteredServers.length === 0 ? (
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 p-12 text-center backdrop-blur-xl">
                <m.div animate={reduce ? undefined : { y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-muted">
                  <HardDrive className="h-8 w-8 text-muted-foreground" />
                </m.div>
                <h3 className="mb-1 text-base font-bold text-foreground">No servers found</h3>
                <p className="mx-auto max-w-sm text-xs text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== "all" 
                    ? "No instances match your search or status filter." 
                    : "You haven't deployed any servers yet."}
                </p>
                {isAdmin && (
                  <PrimaryLinkButton to="/servers/create">
                    <Plus className="h-4 w-4" /> Deploy First Server
                  </PrimaryLinkButton>
                )}
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServers.map((server) => (
                  <ServerCard key={server.id} server={server} onStatusChange={refetch} />
                ))}
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 shadow-xl backdrop-blur-xl divide-y divide-border-subtle">
                {filteredServers.map((server, index) => (
                  <ServerRow key={server.id} server={server} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </LazyMotion>
  );
}
