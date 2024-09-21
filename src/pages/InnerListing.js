import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import PropertyCard from "../components/PropertyCard";
import DeleteModal from "../components/DeleteModal";
import styles from "./innerListing.module.css";
import Backi from "../icons/back.png";
import Areai from "../icons/area.png";
import Bedroomi from "../icons/bedroom.png";
import Locationi from "../icons/location.png";
import Postali from "../icons/postal.png";
import Maili from "../icons/mail.png";
import Phonei from "../icons/phone.png";

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
  const date = new Date(item.created_at);

  // Format the date to dd/mm/yy
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
  let isRental = "";
  if (item.is_rental == 0) {
    isRental = "იყიდება";
  } else {
    isRental = "ქირავდება";
  }

  return (
    <>
      <div className={styles.innerPageContainer}>
        <Link to="/">
          <img src={Backi} />
        </Link>
        <div className={styles.innerCont}>
          <div className={styles.innerListingPicture}>
            <img src={`${item.image}`} />
            <span>{isRental}</span>
            <p>გამოქვეყნების თარიღი {formattedDate}</p>
          </div>

          <div className={styles.listingDetails}>
            <h1>{item.price} ₾</h1>
            <p>
              <img src={Locationi} /> {item.city.name} {item.address}
            </p>
            <p>
              <img src={Areai} />
              ფართი {item.area} მ<sup>2</sup>
            </p>
            <p>
              <img src={Bedroomi} />
              საძინებელი {item.bedrooms}
            </p>
            <p>
              <img src={Postali} />
              საფოსტო ინდექსი {item.zip_code}
            </p>
            <p className={styles.itemDesc}>{item.description}</p>
            <div className={styles.agentinfo}>
              <div className={styles.agentImage}>
                <img src={`${item.agent.avatar}`} alt="Agent Picture" />
                <div>
                  <h3>
                    {item.agent.name} {item.agent.surname}
                  </h3>
                  <p>აგენტი</p>
                </div>
              </div>
              <div className={styles.agentDets}>
                <p>
                  <img src={Maili} />
                  {item.agent.email}
                </p>
                <p>
                  <img src={Phonei} />
                  {item.agent.phone}
                </p>
              </div>
            </div>

            <button className={styles.dltLstng} onClick={handleDeleteClick}>
              ლისტინგის წაშლა
            </button>

            <DeleteModal
              isOpen={isModalOpen}
              onRequestClose={handleModalClose}
              onConfirm={handleDeleteConfirm}
              id={item.id}
            />
          </div>
        </div>
      </div>
      <div className={styles.carruselDiv}>
        <h2>ბინები მსგავს ლოკაციაზე</h2>
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
          <p>მსგავს ლოკაციაზე ბინები ვერ მოიძებნა.</p>
        )}
      </div>
    </>
  );
}

export default InnerListing;
