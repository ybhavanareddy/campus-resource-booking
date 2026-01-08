import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import api from '../services/api';
import '../styles/modal.css';

const BookingModal = ({ resource, booking, onClose }) => {
  // If booking exists → edit mode
  const isEditMode = Boolean(booking);

  const activeResource = booking
    ? booking.resource
    : resource;

  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Pre-fill values when editing
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

  const handleSubmit = async () => {
    setError('');
    setMessage('');

    if (!startDate || !startTime || !endDate || !endTime) {
      setError('Please select start and end date & time');
      return;
    }

    try {
      if (isEditMode) {
        // UPDATE booking
        await api.put(`/bookings/${booking._id}/update`, {
          startTime: `${startDate}T${startTime}`,
          endTime: `${endDate}T${endTime}`,
        });

        setMessage('✅ Booking updated successfully!');
      } else {
        // CREATE booking
        await api.post('/bookings/book', {
          resourceId: activeResource._id,
          startTime: `${startDate}T${startTime}`,
          endTime: `${endDate}T${endTime}`,
          purpose: 'General booking',
        });

        setMessage('✅ Booking confirmed!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    }
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
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
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <label>End Time</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />

        <div className="modal-actions">
          <button onClick={handleSubmit}>
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
