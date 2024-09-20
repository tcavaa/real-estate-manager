import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import PropertyCard from "../components/PropertyCard";
import DeleteModal from "../components/DeleteModal";

function InnerListing() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [listings, setListings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await API.fetchListings();

        setListings(response);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };
    fetchListings();
  }, []);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await API.fetchListing(id);
        setItem(response);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };
    fetchListing();
  }, [id]);

  if (!item) {
    // Render a loading message or placeholder while the data is being fetched
    return <div>Loading...</div>;
  }

  // Filter listings to find those with the same region_id as the current item
  const similarListings = listings.filter(
    (property) =>
      property.city.region.id === item.city.region.id && property.id !== item.id
  );

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    setIsModalOpen(false);
    // Already handled in the DeleteModal component
  };

  return (
    <>
      <div className="listing-page">
        <div className="listing-image">
          <img src={`${item.image}`} alt="Listing Picture" />
        </div>

        <div className="listing-details">
          <h2>Address: {item.address}</h2>
          <p>City: {item.city.name}</p>
          <p>ZIP Code: {item.zip_code}</p>

          <p>Price: {item.price}</p>
          <p>Area: {item.area}</p>
          <p>Number of Bedrooms: {item.bedrooms}</p>

          <p>Status: {item.is_rental}</p>

          <div className="listing-description">
            <h3>Description:</h3>
            <p>{item.description}</p>
          </div>

          <p>Date of Publication: {item.created_at}</p>
        </div>

        <div className="agent-info">
          <div className="agent-image">
            <img src={`${item.agent.avatar}`} alt="Agent Picture" />
          </div>
          <div className="agent-details">
            <h3>Agent Name: {item.agent.name}</h3>
            <p>Email: {item.agent.email}</p>
            <p>Mobile Number: {item.agent.phone}</p>
          </div>
          <div>
            {" "}
            <button onClick={handleDeleteClick}>Delete Listing</button>
          </div>
          <DeleteModal
            isOpen={isModalOpen}
            onRequestClose={handleModalClose}
            onConfirm={handleDeleteConfirm}
            id={item.id}
          />
        </div>
      </div>
      <div>
        Simmilar Listings
        {similarListings.length > 0 ? (
          similarListings.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              image={property.image}
              address={property.address}
              city={property.city}
              zipCode={property.zip_code}
              price={property.price}
              area={property.area}
              bedrooms={property.bedrooms}
              isRental={property.is_rental}
            />
          ))
        ) : (
          <p>No similar listings available.</p>
        )}
      </div>
    </>
  );
}

export default InnerListing;
