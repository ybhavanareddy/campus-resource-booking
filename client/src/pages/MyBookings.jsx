import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import '../styles/my-bookings.css';

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
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    const res = await api.get(`/bookings/user/${user.id}`);
    setBookings(res.data || []);
  };

  const cancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    await api.put(`/bookings/${id}/cancel`);
    fetchBookings();
  };

  if (loading) return <p className="page">Loading bookings…</p>;
  if (!user) return null;

  return (
    <div className="page">
      <h2 className="page-title">My Bookings</h2>

      <div className="timeline">
        {bookings.map((b, index) => (
          <div key={b._id} className="timeline-item">
            {/* LINE */}
            {index !== bookings.length - 1 && (
              <div className="timeline-line" />
            )}

            {/* DOT */}
            <div className="timeline-dot" />

            {/* CARD */}
            <div className="booking-card">
              {/* IMAGE */}
              {b.resource?.images?.[0] && (
                <img
                  src={b.resource.images[0]}
                  alt={b.resource.name}
                  className="booking-image"
                />
              )}

              <div className="booking-info">
                <h3>{b.resource?.name}</h3>

                <p className="meta">
                  📅 {formatDate(b.startTime)}
                </p>

                <p className="meta">
                  ⏰ {formatTime(b.startTime)} –{' '}
                  {formatTime(b.endTime)}
                </p>

                <span className={`status ${b.status}`}>
                  {b.status}
                </span>

                {b.status === 'confirmed' && (
                  <div className="actions">
                    <button onClick={() => setSelectedBooking(b)}>
                      Edit
                    </button>
                    <button
                      className="danger"
                      onClick={() => cancelBooking(b._id)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};

export default MyBookings;
