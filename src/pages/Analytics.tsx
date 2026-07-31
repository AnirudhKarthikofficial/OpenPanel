import React, { useEffect, useState } from 'react';

export default function AnalyticsPage(): React.ReactElement {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(response => response.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-card border border-border-subtle rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-2">Server Statistics</h2>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Requests: {stats.totalRequests || 0}</p>
            <p className="text-sm text-muted-foreground">Active Users: {stats.activeUsers || 0}</p>
          </div>
        </div>

        <div className="bg-card border border-border-subtle rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-2">User Activity</h2>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Logins: {stats.totalLogins || 0}</p>
            <p className="text-sm text-muted-foreground">Most Active User: {stats.mostActiveUser || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}