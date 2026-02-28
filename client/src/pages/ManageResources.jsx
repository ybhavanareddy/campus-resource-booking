import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import api from '../services/api';
import ResourceCard from '../components/ResourceCard';
import '../styles/manage-resources.css';
import '../styles/modal.css';

const ManageResources = () => {
  const [resources, setResources] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: '',
    type: '',
    capacity: '',
    status: 'available',
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [query, type, status, resources]);

  const fetchResources = async () => {
    const res = await api.get('/resources');
    setResources(res.data);
  };

  const applyFilters = () => {
    let data = [...resources];

    if (query) {
      data = data.filter(r =>
        r.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (type) data = data.filter(r => r.type === type);
    if (status) data = data.filter(r => r.status === status);

    setFiltered(data);
  };

  const deleteResource = async (id) => {
    if (!window.confirm('Delete resource?')) return;
    await api.delete(`/resources/${id}`);
    fetchResources();
  };

  const openEdit = (r) => {
    setEditing(r._id);
    setForm({
      name: r.name,
      type: r.type,
      capacity: r.capacity,
      status: r.status,
    });
    setImages([]);
    setShowForm(true);
  };

  /* ✅ FIX: MULTI IMAGE APPEND */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages(prev => {
      const existingNames = prev.map(f => f.name);
      const unique = files.filter(
        f => !existingNames.includes(f.name)
      );
      return [...prev, ...unique];
    });

    e.target.value = null; // IMPORTANT
  };

  const submitForm = async () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    images.forEach(img => fd.append('images', img));

    editing
      ? await api.put(`/resources/${editing}`, fd)
      : await api.post('/resources', fd);

    setShowForm(false);
    setEditing(null);
    setForm({ name: '', type: '', capacity: '', status: 'available' });
    setImages([]);
    fetchResources();
  };

  return (
    <div className="page">
      <h2 className="page-title">Manage Resources</h2>

      <div className="admin-toolbar">
        <input
          placeholder="Search resource"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="room">Room</option>
          <option value="lab">Lab</option>
          <option value="sports">Sports</option>
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>

        <button onClick={() => setShowForm(true)}>
          + Add Resource
        </button>
      </div>

      <div className="admin-grid">
        {filtered.map(r => (
          <ResourceCard
            key={r._id}
            resource={r}
            mode="admin"
            onEdit={openEdit}
            onDelete={deleteResource}
          />
        ))}
      </div>

      {/* ✅ REAL MODAL */}
      {showForm &&
        ReactDOM.createPortal(
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div
              className="modal admin-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>{editing ? 'Edit Resource' : 'Add Resource'}</h3>

              <div className="form-grid">
                <input
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />

                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value })
                  }
                >
                  <option value="">Type</option>
                  <option value="room">Room</option>
                  <option value="lab">Lab</option>
                  <option value="sports">Sports</option>
                </select>

                <input
                  type="number"
                  placeholder="Capacity"
                  value={form.capacity}
                  onChange={(e) =>
                    setForm({ ...form, capacity: e.target.value })
                  }
                />

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {images.length > 0 && (
                <p style={{ fontSize: 12 }}>
                  Selected images: <strong>{images.length}</strong>
                </p>
              )}

              <div className="form-actions">
                <button onClick={submitForm}>
                  {editing ? 'Update' : 'Create'}
                </button>
                <button
                  className="secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default ManageResources;
