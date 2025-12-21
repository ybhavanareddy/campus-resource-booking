import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { useState } from 'react';
import BookingModal from './BookingModal';

const ResourceCard = ({ resource }) => {
  const [showModal, setShowModal] = useState(false);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className='resource-card'>
      <Slider {...settings}>
        {resource.images?.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={resource.name}
            style={{ width: '100%', height: 180, objectFit: 'cover' }}
          />
        ))}
      </Slider>

      <h3>{resource.name}</h3>
      <p>Type: {resource.type}</p>
      <p>Capacity: {resource.capacity}</p>
      <p>Status: {resource.status}</p>

      <button
  disabled={resource.status !== 'available'}
  onClick={() => setShowModal(true)}
>
  Book Now
</button>
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
