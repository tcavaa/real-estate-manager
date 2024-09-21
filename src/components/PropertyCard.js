import React from "react";
import { Link } from "react-router-dom";
import styles from "./PropertyCard.module.css";
import Backi from "../icons/back.png";
import Areai from "../icons/area.png";
import Bedroomi from "../icons/bedroom.png";
import Locationi from "../icons/location.png";
import Postali from "../icons/postal.png";

function PropertyCard({
  id,
  image,
  address,
  city,
  zipCode,
  price,
  area,
  bedrooms,
  isRental,
}) {
  let rentalProberty = "";
  if (isRental == 0) {
    rentalProberty = "იყიდება";
  } else {
    rentalProberty = "ქირავდება";
  }
  return (
    <Link to={`/listing/${id}`}>
      <div className={styles.cardBox}>
        <div className={styles.cardBoxImg}>
          <img src={image} alt="Property" />
          <p>{rentalProberty}</p>
        </div>
        <div className={styles.cardBoxBottom}>
          <h2>{price} ₾</h2>
          <p className={styles.cardBoxLoc}>
            <img src={Locationi} />{city.name}, {address}
          </p>
          <div className={styles.cardBoxDets}>
            <p><img src={Bedroomi} />{bedrooms}</p>
            <p>
            <img src={Areai} /> {area} მ<sup>2</sup>
            </p>
            <p><img src={Postali} /> {zipCode}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PropertyCard;
