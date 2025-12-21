import { useEffect, useState } from 'react';
import api from '../services/api';
import ResourceCard from '../components/ResourceCard';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    const res = await api.get('/resources');
    setResources(res.data);
  };

  const handleSearch = async () => {
    const res = await api.get(`/resources/search?query=${query}`);
    setResources(res.data);
  };

  const handleFilter = async (value) => {
    setType(value);
    const res = await api.get(`/resources/filter?type=${value}`);
    setResources(res.data);
  };

  const handleSort = async (value) => {
    setSort(value);
    const res = await api.get(`/resources/sort?by=${value}`);
    setResources(res.data);
  };

  return (
    <div>
      <h2>Campus Resources</h2>

      {/* Controls */}
      <input
        placeholder="Search by name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <select onChange={(e) => handleFilter(e.target.value)}>
        <option value="">Filter by Type</option>
        <option value="room">Room</option>
        <option value="lab">Lab</option>
        <option value="sports">Sports</option>
      </select>

      <select onChange={(e) => handleSort(e.target.value)}>
        <option value="">Sort</option>
        <option value="date">Date</option>
        <option value="name">Name</option>
      </select>

      {/* Resource Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 20,
          marginTop: 20,
        }}
      >
        {resources.map((r) => (
          <ResourceCard key={r._id} resource={r} />
        ))}
      </div>
    </div>
  );
};

export default Resources;
