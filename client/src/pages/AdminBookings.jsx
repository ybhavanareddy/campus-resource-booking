import { useEffect, useState } from 'react';
import api from '../services/api';
import BookingHistoryModal from '../components/BookingHistoryModal';
import '../styles/admin-bookings.css';

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
  PENDING: 'Pending',
  WAITLISTED: 'Waitlisted',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 History modal state
  const [historyBooking, setHistoryBooking] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  const fetchPendingBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings?status=PENDING,WAITLISTED');
      setBookings(res.data || []);
    } catch (err) {
      console.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const approveBooking = async (id) => {
    try {
      setActionLoading(true);
      await api.patch(`/bookings/${id}/approve`);
      fetchPendingBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed');
    } finally {
      setActionLoading(false);
    }
  };

  const rejectBooking = async (id) => {
    const reason = window.prompt('Reason for rejection?');
    if (!reason) return;

    try {
      setActionLoading(true);
      await api.patch(`/bookings/${id}/reject`, { reason });
      fetchPendingBookings();
    } catch {
      alert('Rejection failed');
    } finally {
      setActionLoading(false);
    }
  };

  // 🔹 Fetch latest booking before showing history
  const openHistory = async (id) => {
    try {
      const res = await api.get(`/bookings/${id}`);
      setHistoryBooking(res.data);
    } catch {
      alert('Failed to load booking history');
    }
  };

  if (loading) {
    return <p className="page">Loading pending bookings…</p>;
  }

  return (
    <div className="page">
      <h2 className="page-title">Booking Approvals</h2>

      {bookings.length === 0 && (
        <p className="empty-state">No pending bookings</p>
      )}

      <div className="booking-approval-list">
        {bookings.map((b) => (
          <div key={b._id} className="approval-card">
            <h3>{b.resource?.name}</h3>

            <p>
              👤 <strong>{b.user?.name}</strong>
            </p>

            <p>📅 {formatDate(b.startTime)}</p>
            <p>
              ⏰ {formatTime(b.startTime)} – {formatTime(b.endTime)}
            </p>

            <span className={`status ${b.status}`}>
              {statusLabel[b.status] || b.status}
            </span>

            <div className="actions">
              <button
                disabled={actionLoading}
                onClick={() => approveBooking(b._id)}
              >
                Approve
              </button>

              <button
                className="danger"
                disabled={actionLoading}
                onClick={() => rejectBooking(b._id)}
              >
                Reject
              </button>

              <button
                className="secondary"
                onClick={() => openHistory(b._id)}
              >
                View History
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 HISTORY MODAL */}
      {historyBooking && (
        <BookingHistoryModal
          booking={historyBooking}
          onClose={() => setHistoryBooking(null)}
        />
      )}
    </div>
  );
};

export default AdminBookings;
