import { useState, useEffect } from 'react';

interface RealtimeStats {
  total_registrations: number;
  cloud_workshop: number;
  ai_workshop: number;
  hackathon_entries: number;
  pitch_entries: number;
  max_cloud: number;
  max_ai: number;
  max_hackathon: number;
  max_pitch: number;
  remaining_cloud: number;
  remaining_ai: number;
  remaining_hackathon: number;
  remaining_pitch: number;
  remaining_total: number;
  cloud_closed: boolean;
  ai_closed: boolean;
  hackathon_closed: boolean;
  pitch_closed: boolean;
  event_closed: boolean;
  timestamp: string;
}

export function useRealtimeStats(refreshInterval = 5000) {
  const [stats, setStats] = useState<RealtimeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats/realtime');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { stats, loading, error };
}