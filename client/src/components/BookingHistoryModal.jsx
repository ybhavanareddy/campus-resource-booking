import ReactDOM from 'react-dom';
import '../styles/modal.css';

const actionColor = {
  CREATED: '#2563eb',     // blue
  APPROVED: '#16a34a',    // green
  REJECTED: '#dc2626',    // red
  CANCELLED: '#f59e0b',   // orange
  COMPLETED: '#6b7280',   // gray
  UPDATED: '#7c3aed',     // purple
  WAITLISTED: '#f97316',  // amber
};

const BookingHistoryModal = ({ booking, onClose }) => {
  //Always show oldest → newest
  const trail = [...(booking.auditTrail || [])].sort(
    (a, b) => new Date(a.at) - new Date(b.at)
  );

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Booking History</h3>
        <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>
          Complete lifecycle of this booking
        </p>

        {trail.length === 0 && (
          <p>No history available.</p>
        )}

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {trail.map((a, i) => (
            <li
              key={i}
              style={{
                borderLeft: `4px solid ${actionColor[a.action] || '#999'}`,
                paddingLeft: '12px',
                marginBottom: '14px',
              }}
            >
              <strong
                style={{
                  color: actionColor[a.action] || '#333',
                  textTransform: 'capitalize',
                }}
              >
                {a.action}
              </strong>

              <div style={{ fontSize: 12, color: '#666' }}>
                {new Date(a.at).toLocaleString()}
              </div>

              <div style={{ fontSize: 12, color: '#444' }}>
                {a.by
                  ? `By: ${a.by.name || 'Unknown'} (${a.by.role || 'User'})`
                  : 'By: System'}
              </div>


              {a.message && (
                <div style={{ marginTop: 4 }}>
                  {a.message}
                </div>
              )}
            </li>
          ))}
        </ul>

        <button className="secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>,
    document.body
  );
};

export default BookingHistoryModal;
