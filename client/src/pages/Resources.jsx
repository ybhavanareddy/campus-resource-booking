import { useEffect, useState } from 'react';
import api from '../services/api';
import ResourceCard from '../components/ResourceCard';
import '../styles/resources.css';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await api.get('/resources');
      setResources(res.data || []);
    } catch (err) {
      console.error('Failed to fetch resources', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase());

    const matchType =
      type === 'all' || r.type === type;

    const matchStatus =
      status === 'all' || r.status === status;

    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="resources-page">
      {/* HEADER */}
      <div className="resources-header">
        <h2>Campus Resources</h2>
        <p>Browse and book available campus facilities</p>
      </div>

      {/* FILTER BAR */}
      <div className="resources-toolbar">
        <input
          type="text"
          placeholder="Search by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="room">Room</option>
          <option value="lab">Lab</option>
          <option value="sports">Sports</option>
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      {/* CONTENT */}
      {loading && (
        <div className="resources-loading">
          Loading resources…
        </div>
      )}

      {!loading && filteredResources.length === 0 && (
        <div className="resources-empty">
          <h3>No resources found</h3>
          <p>Try changing filters or search keywords</p>
        </div>
      )}

      {!loading && filteredResources.length > 0 && (
        <div className="resources-grid">
          {filteredResources.map((r) => (
            <ResourceCard key={r._id} resource={r} mode="user" />
          ))}
        </div>
      )}
    </div>
  );
};

export default Resources;
