import { useState } from 'react';
import Slider from 'react-slick';
import BookingModal from './BookingModal';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/resource-card.css';

const ResourceCard = ({ resource, mode = 'user', onEdit, onDelete }) => {
  const [showModal, setShowModal] = useState(false);

  if (!resource) return null;

  const images = Array.isArray(resource.images) ? resource.images : [];

  const sliderSettings = {
    dots: images.length > 1,
    arrows: images.length > 1,
    infinite: images.length > 1,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  return (
    <div className={`resource-card ${mode}`}>
      {/* IMAGE CAROUSEL */}
      {images.length > 0 && (
        <div className="resource-carousel">
          <Slider {...sliderSettings} key={resource._id}>
            {images.map((img, i) => (
              <div key={i} className="slide">
                <img src={img} alt={resource.name} />
              </div>
            ))}
          </Slider>
        </div>
      )}

      {/* CONTENT */}
      <div className="resource-content">
        <div className="resource-header">
          <h3>{resource.name}</h3>
          <span className={`badge type ${resource.type}`}>
            {resource.type}
          </span>
        </div>

        <p className="resource-meta">
          Capacity: <strong>{resource.capacity}</strong>
        </p>

        <span className={`status ${resource.status}`}>
          {resource.status}
        </span>

        {mode === 'user' && (
          <button
            className="book-btn"
            disabled={resource.status !== 'available'}
            onClick={() => setShowModal(true)}
          >
            Book Now
          </button>
        )}

        {mode === 'admin' && (
          <div className="card-actions">
            <button onClick={() => onEdit?.(resource)}>Edit</button>
            <button
              className="danger"
              onClick={() => onDelete(resource._id)}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <BookingModal
          resource={resource}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ResourceCard;
