import React from 'react';
import { Link } from 'react-router-dom';

function PropertyCard({ id, image, address, city, zipCode, price, area, bedrooms, isRental }) {
  return (
    <Link to={`/listing/${id}`}>
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
      <img src={image} alt="Property" style={{ width: '100px', height: '100px' }} />
      <h3>{address}, {zipCode}</h3>
      <p>Price: ${price}</p>
      <p>Area: {area} sqft</p>
      <p>Bedrooms: {bedrooms}</p>
      <p>city: {city.name}</p>
      <p>Region: {city.region.name}</p>
      <p>Rental: {isRental}</p>
    </div>
    </Link>
  );
}

export default PropertyCard;
