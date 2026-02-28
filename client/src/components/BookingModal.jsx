import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import api from '../services/api';
import '../styles/modal.css';

const today = new Date();
const minDate = today.toISOString().slice(0, 10);

const BookingModal = ({ resource, booking, onClose }) => {
  const isEditMode = Boolean(booking);
  const activeResource = booking ? booking.resource : resource;
  const isHostel = activeResource.bookingType === 'HOSTEL';

  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  const [availability, setAvailability] = useState(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  /* =========================
     PREFILL (EDIT MODE)
  ========================= */
  useEffect(() => {
    if (booking) {
      const s = new Date(booking.startTime);
      const e = new Date(booking.endTime);

      setStartDate(s.toISOString().slice(0, 10));
      setStartTime(s.toISOString().slice(11, 16));
      setEndDate(e.toISOString().slice(0, 10));
      setEndTime(e.toISOString().slice(11, 16));
    }
  }, [booking]);

  /* =========================
     LIVE INVALID RANGE CHECK
  ========================= */
  const isInvalidRange =
    startDate &&
    startTime &&
    endDate &&
    endTime &&
    new Date(`${startDate}T${startTime}`) >=
      new Date(`${endDate}T${endTime}`);

  /* =========================
     AVAILABILITY CHECK
  ========================= */
  useEffect(() => {
    const fetchAvailability = async () => {
      if (
        isEditMode ||
        !startDate ||
        !startTime ||
        !endDate ||
        !endTime ||
        isInvalidRange
      ) {
        setAvailability(null);
        return;
      }

      try {
        setLoadingAvailability(true);
        const res = await api.get('/bookings/availability', {
          params: {
            resourceId: activeResource._id,
            startTime: `${startDate}T${startTime}`,
            endTime: `${endDate}T${endTime}`,
          },
        });
        setAvailability(res.data);
      } catch {
        setAvailability(null);
      } finally {
        setLoadingAvailability(false);
      }
    };

    fetchAvailability();
  }, [
    startDate,
    startTime,
    endDate,
    endTime,
    isEditMode,
    activeResource,
    isInvalidRange,
  ]);

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async () => {
    setError('');
    setMessage('');

    if (isInvalidRange) {
      setError('End date & time must be after start date & time');
      return;
    }

    try {
      if (isEditMode) {
        await api.put(`/bookings/${booking._id}/update`, {
          startTime: `${startDate}T${startTime}`,
          endTime: `${endDate}T${endTime}`,
        });
        setMessage('✅ Booking updated successfully!');
      } else {
        const res = await api.post('/bookings', {
          resourceId: activeResource._id,
          startTime: `${startDate}T${startTime}`,
          endTime: `${endDate}T${endTime}`,
          purpose: 'General booking',
        });

        setMessage(
          res.data?.booking?.status === 'WAITLISTED'
            ? '⏳ Added to waitlist. You’ll be notified when a spot opens.'
            : '✅ Booking request submitted!'
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    }
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>
          {isEditMode
            ? `Edit Booking – ${activeResource.name}`
            : `Book ${activeResource.name}`}
        </h3>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <label>Start Date</label>
        <input
          type="date"
          min={minDate}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label>Start Time</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />

        <label>End Date</label>
        <input
          type="date"
          min={startDate || minDate}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <label>End Time</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />

        {/* 🔴 LIVE RANGE ERROR */}
        {isInvalidRange && (
          <p className="error">
            End date & time must be after start date & time
          </p>
        )}

        {!isEditMode && availability && !isInvalidRange && (
          <p style={{ marginTop: '8px' }}>
            {isHostel ? 'Beds available' : 'Seats available'}:{' '}
            <strong>
              {availability.remaining} / {availability.capacity}
            </strong>
            {availability.remaining === 0 && (
              <span style={{ color: 'orange', marginLeft: 8 }}>
                (You’ll be waitlisted)
              </span>
            )}
          </p>
        )}

        {loadingAvailability && (
          <p style={{ fontSize: 12 }}>Checking availability…</p>
        )}

        <div className="modal-actions">
          <button
            onClick={handleSubmit}
            disabled={isInvalidRange}
          >
            {isEditMode ? 'Update Booking' : 'Confirm Booking'}
          </button>
          <button className="secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BookingModal;
