import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import BookingHistoryModal from '../components/BookingHistoryModal';
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

const statusLabel = {
  PENDING: 'Pending Approval',
  APPROVED: 'Approved',
  WAITLISTED: 'Waitlisted',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
};

const MyBookings = () => {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState([]);

  // 🔹 existing edit modal
  const [selectedBooking, setSelectedBooking] = useState(null);

  // 🔹 NEW: history modal
  const [historyBooking, setHistoryBooking] = useState(null);

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
            {index !== bookings.length - 1 && (
              <div className="timeline-line" />
            )}
            <div className="timeline-dot" />

            <div className="booking-card">
              <div className="booking-info">
                <h3>{b.resource?.name}</h3>

                <p className="meta">📅 {formatDate(b.startTime)}</p>
                <p className="meta">
                  ⏰ {formatTime(b.startTime)} –{' '}
                  {formatTime(b.endTime)}
                </p>

                {b.resource?.bookingType === 'HOSTEL' && (
                  <p className="meta">
                    🛏 Occupied till{' '}
                    <strong>{formatDate(b.endTime)}</strong>
                  </p>
                )}

                <span className={`status ${b.status}`}>
                  {statusLabel[b.status]}
                </span>

                {/* 🔹 ACTIONS */}
                <div className="actions">
                  {b.status === 'PENDING' && (
                    <>
                      <button onClick={() => setSelectedBooking(b)}>
                        Edit
                      </button>
                      <button
                        className="danger"
                        onClick={() => cancelBooking(b._id)}
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {/* 🔹 NEW: View History (always allowed) */}
                  <button
                    className="secondary"
                    onClick={() => setHistoryBooking(b)}
                  >
                    View History
                  </button>
                </div>

                {b.status === 'WAITLISTED' && (
                  <p className="hint">
                    You’ll be notified if a spot opens.
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 EXISTING EDIT MODAL */}
      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => {
            setSelectedBooking(null);
            fetchBookings();
          }}
        />
      )}

      {/* 🔹 NEW HISTORY MODAL */}
      {historyBooking && (
        <BookingHistoryModal
          booking={historyBooking}
          onClose={() => setHistoryBooking(null)}
        />
      )}
    </div>
  );
};

export default MyBookings;
