import { useEffect, useState } from 'react';
import api from '../services/api';

const ManageResources = () => {
  const [resources, setResources] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    type: '',
    capacity: '',
    status: 'available',
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    const res = await api.get('/resources');
    setResources(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitResource = async () => {
    if (!form.name || !form.type) {
      alert('Name and type required');
      return;
    }

    if (editing) {
      await api.put(`/resources/${editing}`, form);
    } else {
      await api.post('/resources', form);
    }

    setForm({ name: '', type: '', capacity: '', status: 'available' });
    setEditing(null);
    fetchResources();
  };

  const editResource = (r) => {
    setEditing(r._id);
    setForm({
      name: r.name,
      type: r.type,
      capacity: r.capacity,
      status: r.status,
    });
  };

  const deleteResource = async (id) => {
    if (!window.confirm('Delete this resource?')) return;
    await api.delete(`/resources/${id}`);
    fetchResources();
  };

  return (
    <div className="page">
      <h2>Manage Resources</h2>

      {/* FORM */}
      <div style={{ marginBottom: 20 }}>
        <h3>{editing ? 'Edit Resource' : 'Add Resource'}</h3>

        <input
          name="name"
          placeholder="Resource Name"
          value={form.name}
          onChange={handleChange}
        />

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="">Select Type</option>
          <option value="room">Room</option>
          <option value="lab">Lab</option>
          <option value="sports">Sports</option>
        </select>

        <input
          name="capacity"
          type="number"
          placeholder="Capacity"
          value={form.capacity}
          onChange={handleChange}
        />

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>

        <button onClick={submitResource}>
          {editing ? 'Update' : 'Add'}
        </button>

        {editing && (
          <button onClick={() => setEditing(null)} style={{ marginLeft: 8 }}>
            Cancel
          </button>
        )}
      </div>

      {/* LIST */}
      {resources.map((r) => (
        <div
          key={r._id}
          style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}
        >
          <strong>{r.name}</strong> ({r.type})  
          | Capacity: {r.capacity}  
          | Status: {r.status}

          <div style={{ marginTop: 6 }}>
            <button onClick={() => editResource(r)} style={{ marginRight: 6 }}>
              Edit
            </button>
            <button onClick={() => deleteResource(r._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageResources;
