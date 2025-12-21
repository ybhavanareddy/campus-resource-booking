import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const formatTime = (date) =>
  new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [editing, setEditing] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const res = await api.get(`/bookings/user/${user.id}`);
    setBookings(res.data);
  };

  // CANCEL BOOKING
  const cancelBooking = async (id) => {
    const confirm = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirm) return;

    await api.put(`/bookings/${id}/cancel`);
    fetchBookings();
  };

  // EDIT BOOKING
  const openEdit = (booking) => {
    setEditing(booking._id);

    const s = new Date(booking.startTime);
    const e = new Date(booking.endTime);

    setStartDate(s.toISOString().slice(0, 10));
    setStartTime(s.toISOString().slice(11, 16));
    setEndDate(e.toISOString().slice(0, 10));
    setEndTime(e.toISOString().slice(11, 16));
  };

  const updateBooking = async () => {
    if (!startDate || !startTime || !endDate || !endTime) {
      alert('Select date and time');
      return;
    }

    const startDateTime = `${startDate}T${startTime}`;
    const endDateTime = `${endDate}T${endTime}`;

    await api.put(`/bookings/${editing}/update`, {
      startTime: startDateTime,
      endTime: endDateTime,
    });

    setEditing(null);
    fetchBookings();
  };

  return (
    <div className="page">
      <h2>My Bookings</h2>

      {bookings.length === 0 && <p>No bookings yet</p>}

      {bookings.map((b) => (
        <div key={b._id} style={{ border: '1px solid #ccc', padding: 12, marginBottom: 12 }}>
          <h3>{b.resource.name}</h3>

          <p>📅 {formatDate(b.startTime)}</p>
          <p>
            ⏰ {formatTime(b.startTime)} – {formatTime(b.endTime)}
          </p>

          <p>Status: <strong>{b.status}</strong></p>

          {b.status === 'confirmed' && (
            <>
              <button onClick={() => openEdit(b)} style={{ marginRight: 8 }}>
                Edit
              </button>
              <button onClick={() => cancelBooking(b._id)}>
                Cancel
              </button>
            </>
          )}

          {/* EDIT MODE */}
          {editing === b._id && (
            <div style={{ marginTop: 10 }}>
              <h4>Edit Booking</h4>

              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />

              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

              <br />
              <button onClick={updateBooking}>Save</button>
              <button onClick={() => setEditing(null)} style={{ marginLeft: 6 }}>
                Cancel Edit
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
