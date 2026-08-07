// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function PlayitHub() {
  const [servers, setServers] = useState<any[]>([]);

  useEffect(() => { fetchList(); }, []);

  const fetchList = async () => {
    const res = await axios.get('/api/servers');
    setServers(res.data);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Playit Hub</h1>
      <div className="grid grid-cols-1 gap-3">
        {servers.map(s => (
          <div key={s.id} className="p-3 bg-card border border-border rounded-lg flex items-center justify-between">
            <div>
              <div className="font-semibold">{s.name}</div>
              <div className="text-sm text-muted-foreground">Status: {s.tunnelStatus || 'disabled'}</div>
            </div>
            <div className="flex items-center gap-2">
              <Link to={`/servers/${s.id}/playit`} className="px-3 py-1 bg-indigo-500 text-white rounded">Manage</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
