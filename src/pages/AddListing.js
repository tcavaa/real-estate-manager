import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api"; // Adjust the path as needed
import styles from "./AddListing.module.css";

function AddListing() {
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [description, setDescription] = useState("");
  const [forSale, setForSale] = useState(0);
  const [agent, setAgent] = useState("");
  const [agents, setAgents] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAddressValid, setIsAddressValid] = useState();
  const [isPostalCodeValid, setIsPostalCodeValid] = useState();
  const [isPriceValid, setIsPriceValid] = useState();
  const [isAreaValid, setIsAreaValid] = useState();
  const [isBedroomsValid, setIsBedroomsValid] = useState();
  const [isDescValid, setIsDescValid] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const regionsResponse = await API.fetchRegions();
        setRegions(regionsResponse);

        const citiesResponse = await API.fetchCities(); // Assuming this returns all cities
        setCities(citiesResponse);

        const agentsResponse = await API.fetchAgents();
        setAgents(agentsResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Load saved form data from local storage
    const savedData = JSON.parse(localStorage.getItem("addListingForm"));

    if (savedData) {
      setAddress(savedData.address || "");
      setSelectedRegion(savedData.selectedRegion || "");
      setSelectedCity(savedData.selectedCity || "");
      setPostalCode(savedData.postalCode || "");
      setPrice(savedData.price || "");
      setArea(savedData.area || "");
      setBedrooms(savedData.bedrooms || "");
      setDescription(savedData.description || "");
      setForSale(savedData.forSale || 0);
      setAgent(savedData.agent || "");
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Filter cities based on the selected region
    if (selectedRegion) {
      const filtered = cities.filter(
        (city) => city.region_id === parseInt(selectedRegion)
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [selectedRegion, cities]);

  useEffect(() => {
    // Save form data to local storage whenever any form field changes
    if (isLoaded) {
      const formData = {
        address,
        selectedRegion,
        selectedCity,
        postalCode,
        price,
        area,
        bedrooms,
        description,
        forSale,
        agent,
      };
      localStorage.setItem("addListingForm", JSON.stringify(formData));
    }
  }, [
    address,
    selectedRegion,
    selectedCity,
    postalCode,
    price,
    area,
    bedrooms,
    description,
    forSale,
    agent,
    isLoaded,
  ]);

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    if (value && value.length >= 2) {
      setIsAddressValid(true); // Set true if the length is 2 or more
    } else {
      setIsAddressValid(false); // Set false if less than 2
    }
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    // Check file size (1MB limit)
    if (file.size > 1048576) {
      alert("File size cannot exceed 1MB.");
      return;
    }

    // Check file type (only images)
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only image files (JPEG, PNG, GIF) are allowed.");
      return;
    }

    setImage(file);
  };
  const handleRegionChange = (e) => setSelectedRegion(e.target.value);
  const handleCityChange = (e) => setSelectedCity(e.target.value);
  const handlePostalCodeChange = (e) => {
    const value = e.target.value;
    setPostalCode(value);
    if (value && /^\d+$/.test(value)) {
      setIsPostalCodeValid(true); // Set true if only numbers
    } else {
      setIsPostalCodeValid(false); // Set false if not only numbers
    }
  };
  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPrice(value);

    if (value && /^\d+$/.test(value)) {
      setIsPriceValid(true); // Set true if only numbers
    } else {
      setIsPriceValid(false); // Set false if not only numbers
    }
  };
  const handleAreaChange = (e) => {
    const value = e.target.value;
    setArea(value);

    if (value && /^\d+$/.test(value)) {
      setIsAreaValid(true); // Set true if only numbers
    } else {
      setIsAreaValid(false); // Set false if not only numbers
    }
  };

  const handleBedroomsChange = (e) => {
    const value = e.target.value;
    setBedrooms(value);

    if (value && /^\d+$/.test(value)) {
      setIsBedroomsValid(true); // Set true if only numbers
    } else {
      setIsBedroomsValid(false); // Set false if not only numbers
    }
  };
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);

    const wordCount = value.trim().split(/\s+/).length;

    if (wordCount >= 5) {
      setIsDescValid(true); // Set true if 5 or more words
    } else {
      setIsDescValid(false); // Set false if less than 5 words
    }
  };
  const handleForSaleChange = (e) => {
    setForSale(Number(e.target.value));
  };
  const handleAgentChange = (e) => setAgent(e.target.value);

  const handleReset = (e) => {
    e.preventDefault();

    // Clear all fields
    setAddress("");
    setImage(null);
    setSelectedRegion("");
    setSelectedCity("");
    setPostalCode("");
    setPrice("");
    setArea("");
    setBedrooms("");
    setDescription("");
    setForSale(0);
    setAgent("");
    setIsAddressValid();
    setIsPostalCodeValid();
    setIsPriceValid();
    setIsAreaValid();
    setIsBedroomsValid();
    setIsDescValid();

    // Remove from localStorage
    localStorage.removeItem("addListingForm");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validations
    if (
      !address ||
      !image ||
      !selectedRegion ||
      !selectedCity ||
      !postalCode ||
      !price ||
      !area ||
      !bedrooms ||
      !description ||
      !agent
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await API.addListing({
        address,
        image,
        selectedRegion,
        description,
        selectedCity,
        postalCode,
        price,
        area,
        bedrooms,
        forSale,
        agent,
      });
      console.log(response);
      const redirectUrl = `/listing/${response.id}`; // Assuming the ID is a string
      navigate(redirectUrl);

      localStorage.removeItem("addListingForm"); // Clear saved form data
      // Optionally redirect or clear form
    } catch (error) {
      console.error("Error adding listing:", error);
      alert("Failed to add listing.");
    }
  };

  return (
    <div>
      <h1 className={styles.listingadd_heading}>ლისტინგის დამატება</h1>
      <form className={styles.listingadd_form} onSubmit={handleSubmit}>
        <div className={styles.inputradio}>
          <label className={styles.listingadd_isrental}>გარიგების ტიპი</label>
          <label className={styles.radios}>
            <input
              type="radio"
              value="0"
              checked={forSale == 0}
              onChange={handleForSaleChange}
            />
            იყიდება
          </label>
          <label className={styles.radios}>
            <input
              type="radio"
              value="1"
              checked={forSale == 1}
              onChange={handleForSaleChange}
            />
            ქირავდება
          </label>
        </div>
        <h2 className={styles.formHeadings}>მდებარეობა</h2>
        <div className={styles.location}>
          <div className={styles.formGroups}>
            <label className={styles.formlabels}>მისამართი *</label>
            <input
              type="text"
              value={address}
              onChange={handleAddressChange}
              required
              minLength="2"
              className={`${
                isAddressValid === undefined
                  ? ""
                  : isAddressValid
                  ? styles.valid
                  : styles.invalid
              }`}
            />
            <p
              className={`${
                isAddressValid === undefined
                  ? ""
                  : isAddressValid
                  ? styles.validp
                  : styles.invalidp
              }`}
            >
              ✔️ მინიმუმ ორი სიმბოლო
            </p>
          </div>
          <div className={styles.formGroups}>
            <label className={styles.formlabels}>საფოსტო ინდექსი *</label>
            <input
              type="text"
              value={postalCode}
              onChange={handlePostalCodeChange}
              required
              pattern="\d+"
              className={`${
                isPostalCodeValid === undefined
                  ? ""
                  : isPostalCodeValid
                  ? styles.valid
                  : styles.invalid
              }`}
            />
            <p
              className={`${
                isPostalCodeValid === undefined
                  ? ""
                  : isPostalCodeValid
                  ? styles.validp
                  : styles.invalidp
              }`}
            >
              ✔️ მხოლოდ რიცხვები
            </p>
          </div>

          <div className={styles.formGroups}>
            <label className={styles.formlabels}>რეგიონი</label>
            <select
              value={selectedRegion}
              onChange={handleRegionChange}
              required
              className={`${
                selectedRegion == ""
                  ? ""
                  : selectedRegion
                  ? styles.valid
                  : styles.invalid
              }`}
            >
              <option value="">აირჩიე რეგიონი</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          {selectedRegion && (
            <div className={styles.formGroups}>
              <label className={styles.formlabels}>ქალაქი:</label>
              <select
                value={selectedCity}
                onChange={handleCityChange}
                required
                className={`${selectedCity ? styles.valid : styles.invalid}`}
              >
                <option value="">აირჩიე ქალაქი</option>
                {filteredCities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <h2 className={styles.formHeadings2}>ბინის დეტალები</h2>
        <div className={styles.location}>
          <div className={styles.formGroups}>
            <label className={styles.formlabels}>ფასი:</label>
            <input
              type="text"
              value={price}
              onChange={handlePriceChange}
              required
              pattern="\d+"
              className={`${
                isPriceValid === undefined
                  ? ""
                  : isPriceValid
                  ? styles.valid
                  : styles.invalid
              }`}
            />
            <p
              className={`${
                isPriceValid === undefined
                  ? ""
                  : isPriceValid
                  ? styles.validp
                  : styles.invalidp
              }`}
            >
              ✔️ მხოლოდ რიცხვები
            </p>
          </div>

          <div className={styles.formGroups}>
            <label className={styles.formlabels}>ფართობი</label>
            <input
              type="text"
              value={area}
              onChange={handleAreaChange}
              required
              pattern="\d+"
              className={`${
                isAreaValid === undefined
                  ? ""
                  : isAreaValid
                  ? styles.valid
                  : styles.invalid
              }`}
            />
            <p
              className={`${
                isAreaValid === undefined
                  ? ""
                  : isAreaValid
                  ? styles.validp
                  : styles.invalidp
              }`}
            >
              ✔️ მხოლოდ რიცხვები
            </p>
          </div>

          <div className={styles.formGroups}>
            <label className={styles.formlabels}>საძინებლების რაოდენობა*</label>
            <input
              type="text"
              value={bedrooms}
              onChange={handleBedroomsChange}
              required
              pattern="\d+"
              className={`${
                isBedroomsValid === undefined
                  ? ""
                  : isBedroomsValid
                  ? styles.valid
                  : styles.invalid
              }`}
            />
            <p
              className={`${
                isBedroomsValid === undefined
                  ? ""
                  : isBedroomsValid
                  ? styles.validp
                  : styles.invalidp
              }`}
            >
              ✔️ მხოლოდ რიცხვები
            </p>
          </div>
        </div>
        <div className={styles.description}>
          <label className={styles.formlabels}>აღწერა *</label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            required
            minLength="5"
            className={`${
              isDescValid === undefined
                ? ""
                : isDescValid
                ? styles.valid
                : styles.invalid
            }`}
          />
          <p
            className={`${
              isDescValid === undefined
                ? ""
                : isDescValid
                ? styles.validp
                : styles.invalidp
            }`}
          >
            ✔️ მინიმუმ ხუთი სიტყვა
          </p>
        </div>
        <div className={styles.fileUpload}>
          <label className={styles.formlabels}>ატვირთეთ ფოტო *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        <div className={styles.formGroups}>
          <h2 className={styles.formHeadings2}>აგენტი</h2>
          <p className={styles.formlabels}>აირჩიე</p>
          <select value={agent} onChange={handleAgentChange} required>
            <option value="">აირჩიე აგენტი</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formButtons}>
          <button onClick={handleReset} type="reset">
            გაუქმება
          </button>
          <button type="submit">დაამატე ლისტინგი</button>
        </div>
      </form>
    </div>
  );
}

export default AddListing;
