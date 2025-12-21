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
  Legend
} from 'recharts';

const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#f59e0b', '#7c3aed'];

const AdminAnalytics = () => {
  const [usageData, setUsageData] = useState([]);
  const [topRooms, setTopRooms] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const usageRes = await api.get('/analytics/usage');
      const topRes = await api.get('/analytics/top-rooms');

      setUsageData(usageRes.data);
      setTopRooms(topRes.data);
    } catch (err) {
      console.error('Failed to load analytics');
    }
  };

  return (
    <div className="page">
      <h2>Admin Analytics</h2>

      {/* Usage Bar Chart */}
      <h3>Resource Usage</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={usageData}>
          <XAxis dataKey="resourceName" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="totalBookings" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>

      {/* Top Rooms Pie Chart */}
      <h3 style={{ marginTop: 40 }}>Top Booked Resources</h3>
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
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminAnalytics;
