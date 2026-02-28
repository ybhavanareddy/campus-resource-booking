import { useEffect, useState } from 'react';
import api from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import '../styles/admin-analytics.css';

const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#f59e0b', '#7c3aed'];

const AdminAnalytics = () => {
  const [usageData, setUsageData] = useState([]);
  const [topRooms, setTopRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const usageRes = await api.get('/analytics/usage');
      const topRes = await api.get('/analytics/top-rooms');

      setUsageData(usageRes.data || []);
      setTopRooms(topRes.data || []);
    } catch (err) {
      console.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page admin-analytics">
        <p>Loading analytics…</p>
      </div>
    );
  }

  return (
    <div className="page admin-analytics">
      {/* Header */}
      <div className="analytics-header">
        <h2>Admin Analytics</h2>
        <p>
          Overview of campus resource usage based on approved and completed
          bookings
        </p>
      </div>

      {usageData.length === 0 && topRooms.length === 0 && (
        <p className="empty-state">
          No analytics data available yet.
        </p>
      )}

      <div className="analytics-grid">
        {/* Resource Usage */}
        <div className="analytics-card">
          <h3>Resource Usage</h3>

          {usageData.length === 0 ? (
            <p className="empty-state">No booking data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usageData}>
                <XAxis dataKey="resourceName" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="totalBookings"
                  fill="#2563eb"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Booked Resources */}
        <div className="analytics-card">
          <h3>Top Booked Resources</h3>

          {topRooms.length === 0 ? (
            <p className="empty-state">No popular resources yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topRooms}
                  dataKey="totalBookings"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {topRooms.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
