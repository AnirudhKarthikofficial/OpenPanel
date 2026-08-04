import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clock, Trash2, Calendar, Plus, Play, ToggleLeft, ToggleRight, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Schedule {
  id: string;
  serverId: string;
  name: string;
  action: "start" | "stop" | "restart" | "backup";
  intervalType: "minutes" | "hourly" | "daily" | "weekly";
  intervalMinutes?: number;
  hour?: number;
  minute?: number;
  dayOfWeek?: number;
  lastRun?: string;
  isActive: boolean;
  createdAt: string;
}

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

export default function ServerSchedules({ serverId }: { serverId: string }) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [action, setAction] = useState<"start" | "stop" | "restart" | "backup">("restart");
  const [intervalType, setIntervalType] = useState<"minutes" | "hourly" | "daily" | "weekly">("daily");
  const [intervalMinutes, setIntervalMinutes] = useState(30);
  const [hour, setHour] = useState(3);
  const [minute, setMinute] = useState(0);
  const [dayOfWeek, setDayOfWeek] = useState(0);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/servers/${serverId}/schedules`);
      setSchedules(res.data);
    } catch (err) {
      showToast("Failed to fetch schedules", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [serverId]);

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Schedule name is required", "error");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`/api/servers/${serverId}/schedules`, {
        name: name.trim(),
        action,
        intervalType,
        intervalMinutes: intervalType === "minutes" ? intervalMinutes : undefined,
        hour: (intervalType === "daily" || intervalType === "weekly") ? hour : undefined,
        minute: (intervalType === "hourly" || intervalType === "daily" || intervalType === "weekly") ? minute : undefined,
        dayOfWeek: intervalType === "weekly" ? dayOfWeek : undefined
      });
      showToast("Schedule created successfully", "success");
      setShowAddForm(false);
      setName("");
      setAction("restart");
      setIntervalType("daily");
      setIntervalMinutes(30);
      setHour(3);
      setMinute(0);
      setDayOfWeek(0);
      fetchSchedules();
    } catch (err: any) {
      showToast(err.response?.data?.error || "Failed to create schedule", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm("Are you sure you want to delete this schedule?")) return;
    try {
      await axios.delete(`/api/servers/${serverId}/schedules/${id}`);
      showToast("Schedule deleted successfully", "success");
      fetchSchedules();
    } catch (err) {
      showToast("Failed to delete schedule", "error");
    }
  };

  const formatScheduleTime = (sch: Schedule) => {
    const actText = sch.action.toUpperCase();
    let timeText = "";
    if (sch.intervalType === "minutes") {
      timeText = `Every ${sch.intervalMinutes} minutes`;
    } else if (sch.intervalType === "hourly") {
      timeText = `Every hour at minute ${sch.minute}`;
    } else if (sch.intervalType === "daily") {
      const hStr = String(sch.hour).padStart(2, "0");
      const mStr = String(sch.minute).padStart(2, "0");
      timeText = `Daily at ${hStr}:${mStr} UTC`;
    } else if (sch.intervalType === "weekly") {
      const hStr = String(sch.hour).padStart(2, "0");
      const mStr = String(sch.minute).padStart(2, "0");
      const dayStr = DAYS_OF_WEEK[sch.dayOfWeek ?? 0];
      timeText = `Every ${dayStr} at ${hStr}:${mStr} UTC`;
    }
    return { actText, timeText };
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto custom-scrollbar bg-transparent">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 right-4 z-50 flex items-center px-4 py-3 rounded-xl border shadow-xl text-sm ${
              toast.type === "success"
                ? "bg-slate-900/90 border-emerald-500/30 text-emerald-400"
                : "bg-slate-900/90 border-rose-500/30 text-rose-400"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Task Automation</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Automate server tasks like restarts or backups</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
        >
          {showAddForm ? "Cancel" : <><Plus size={14} /> Add Schedule</>}
        </button>
      </div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border-subtle rounded-2xl p-5 shadow-sm space-y-4"
        >
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 border-b border-border-subtle pb-2.5">
            <Clock size={16} className="text-indigo-400" /> New Automated Schedule
          </h3>
          <form onSubmit={handleCreateSchedule} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Schedule Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Schedule Name</label>
                <input
                  type="text"
                  placeholder="e.g. Daily Auto Restart"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Action */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Action to Execute</label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value as any)}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500"
                >
                  <option value="restart">Restart Server</option>
                  <option value="start">Start Server</option>
                  <option value="stop">Stop Server</option>
                  <option value="backup">Create Backup</option>
                </select>
              </div>

              {/* Interval Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Execution Interval</label>
                <select
                  value={intervalType}
                  onChange={(e) => setIntervalType(e.target.value as any)}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500"
                >
                  <option value="minutes">Every N Minutes</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              {/* Conditional parameters based on interval type */}
              {intervalType === "minutes" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Minutes Interval</label>
                  <input
                    type="number"
                    min={1}
                    max={1440}
                    value={intervalMinutes}
                    onChange={(e) => setIntervalMinutes(Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              {intervalType === "hourly" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Minute of Hour (0-59)</label>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={minute}
                    onChange={(e) => setMinute(Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              {intervalType === "daily" && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Hour (0-23 UTC)</label>
                    <input
                      type="number"
                      min={0}
                      max={23}
                      value={hour}
                      onChange={(e) => setHour(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Minute (0-59)</label>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={minute}
                      onChange={(e) => setMinute(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {intervalType === "weekly" && (
                <div className="grid grid-cols-3 gap-2 col-span-1 md:col-span-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Day of Week</label>
                    <select
                      value={dayOfWeek}
                      onChange={(e) => setDayOfWeek(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500"
                    >
                      {DAYS_OF_WEEK.map((d, idx) => (
                        <option key={d} value={idx}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Hour (0-23 UTC)</label>
                    <input
                      type="number"
                      min={0}
                      max={23}
                      value={hour}
                      onChange={(e) => setHour(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Minute (0-59)</label>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={minute}
                      onChange={(e) => setMinute(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-border-subtle pt-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground bg-muted hover:bg-muted-hover rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
              >
                {submitting && <Loader2 size={13} className="animate-spin" />}
                Create Schedule
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground text-sm gap-2">
          <Loader2 className="animate-spin" size={16} /> Loading schedules...
        </div>
      ) : schedules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-2xl bg-card">
          <Clock className="text-muted-foreground w-12 h-12 mb-3.5 opacity-40" />
          <h4 className="text-sm font-bold text-foreground">No schedules configured</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm text-center">Set up automated tasks to automatically restart or back up your game server.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedules.map((sch) => {
            const { actText, timeText } = formatScheduleTime(sch);
            return (
              <div
                key={sch.id}
                className="bg-card border border-border-subtle rounded-2xl p-5 shadow-sm hover:border-indigo-500/20 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-foreground leading-snug">{sch.name}</h4>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      sch.action === "backup"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : sch.action === "restart"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {actText}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                    <Calendar size={13} /> {timeText}
                  </p>

                  <div className="text-[11px] text-muted-foreground pt-1.5 space-y-0.5 border-t border-border-subtle">
                    <p>Last Run: <span className="text-foreground-muted">{sch.lastRun ? new Date(sch.lastRun).toLocaleString() : "Never"}</span></p>
                    <p>Status: <span className={sch.isActive ? "text-emerald-400" : "text-zinc-500"}>{sch.isActive ? "Active" : "Paused"}</span></p>
                  </div>
                </div>

                <div className="flex justify-end gap-1.5 pt-4 border-t border-border-subtle mt-4">
                  <button
                    onClick={() => handleDeleteSchedule(sch.id)}
                    className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Delete Schedule"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
