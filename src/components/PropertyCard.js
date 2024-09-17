import React from 'react';

function PropertyCard() {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
      <img src="https://via.placeholder.com/150" alt="Property" />
      <h3>123 Main St, City, ZIP</h3>
      <p>Price: $500,000</p>
      <p>Area: 2000 sqft</p>
      <p>Bedrooms: 3</p>
    </div>
  );
}

export default PropertyCard;
