import { useState } from 'react';
import api from '../services/api';

const BookingModal = ({ resource, onClose }) => {
  const [startDate, setStartDate] = useState('');
const [startTime, setStartTime] = useState('');
const [endDate, setEndDate] = useState('');
const [endTime, setEndTime] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleBooking = async () => {
  setError('');
  setMessage('');

  if (!startDate || !startTime || !endDate || !endTime) {
    setError('Please select start and end date & time');
    return;
  }

  const startDateTime = `${startDate}T${startTime}`;
  const endDateTime = `${endDate}T${endTime}`;

  try {
    await api.post('/bookings/book', {
      resourceId: resource._id,
      startTime: startDateTime,
      endTime: endDateTime,
      purpose: 'General booking',
    });

    setMessage('✅ Booking confirmed!');
  } catch (err) {
    setError(err.response?.data?.message || 'Booking failed');
  }
};



  return (
    <div className='modal-overlay'>
      <div className='modal'>
        <h3>Book {resource.name}</h3>

        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <label>Start Date</label><br />
<input
  type="date"
  value={startDate}
  onChange={(e) => setStartDate(e.target.value)}
/><br /><br />

<label>Start Time</label><br />
<input
  type="time"
  value={startTime}
  onChange={(e) => setStartTime(e.target.value)}
/><br /><br />

<label>End Date</label><br />
<input
  type="date"
  value={endDate}
  onChange={(e) => setEndDate(e.target.value)}
/><br /><br />

<label>End Time</label><br />
<input
  type="time"
  value={endTime}
  onChange={(e) => setEndTime(e.target.value)}
/><br /><br />

        <button
  onClick={handleBooking}
  disabled={!startTime || !endTime}
>
  Confirm Booking
</button>

        <button onClick={onClose} style={{ marginLeft: 10 }}>
          Close
        </button>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalStyle = {
  background: '#fff',
  padding: 20,
  borderRadius: 8,
  width: 320,
};

export default BookingModal;
