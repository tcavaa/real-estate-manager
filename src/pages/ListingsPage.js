import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import PropertyCard from "../components/PropertyCard";
import AgentModal from "../components/AgentModal";
import styles from "./ListingsPage.module.css";

function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [error, setError] = useState(null);

  // Filters
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [areaRange, setAreaRange] = useState({ min: "", max: "" });
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [bedrooms, setBedrooms] = useState("");

  const [validationMessage, setValidationMessage] = useState("");
  const [isDataFetched, setIsDataFetched] = useState(false); // Track data fetching

  const [regions, setRegions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await API.fetchListings();

        setListings(response);
        setIsDataFetched(true); // Mark data as fetched
      } catch (error) {
        console.error("Error fetching listings:", error);
        setError("Failed to fetch listings.");
      }
    };
    fetchListings();
  }, []);

  // Load filters from localStorage when the component mounts
  useEffect(() => {
    const storedFilters = JSON.parse(localStorage.getItem("filters"));
    if (storedFilters) {
      setPriceRange(storedFilters.priceRange || { min: "", max: "" });
      setAreaRange(storedFilters.areaRange || { min: "", max: "" });
      setSelectedRegions(storedFilters.selectedRegions || []);
      setBedrooms(storedFilters.bedrooms || "");
    }
  }, []);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await API.fetchRegions();

        setRegions(response);
        setIsDataFetched(true); // Mark data as fetched
      } catch (error) {
        console.error("Error fetching listings:", error);
        setError("Failed to fetch listings.");
      }
    };
    fetchRegions();
  }, []);

  // Handle filter changes
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({ ...prev, [name]: value }));
  };

  const handleAreaChange = (e) => {
    const { name, value } = e.target;
    setAreaRange((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegionChange = (e) => {
    const { value, checked } = e.target;
    const regionId = parseInt(value, 10); // Convert to number

    if (checked) {
      setSelectedRegions((prev) => [...prev, regionId]); // Add region if checked
    } else {
      setSelectedRegions((prev) => prev.filter((id) => id !== regionId)); // Remove region if unchecked
    }
  };

  const handleBedroomsChange = (e) => {
    setBedrooms(e.target.value);
  };

  // Validate filters
  const validateFilters = () => {
    if (
      priceRange.min &&
      priceRange.max &&
      parseInt(priceRange.min) > parseInt(priceRange.max)
    ) {
      setValidationMessage("რეინჯი შეიყვანეთ სწორად.");
      return false;
    }
    if (
      areaRange.min &&
      areaRange.max &&
      parseInt(areaRange.min) > parseInt(areaRange.max)
    ) {
      setValidationMessage("რეინჯი შეიყვანეთ სწორად");
      return false;
    }
    setValidationMessage("");
    return true;
  };

  // Apply filters to listings
  const applyFilters = useCallback(() => {
    const filtered = listings.filter((listing) => {
      // Filter by price range
      if (
        priceRange.min &&
        parseInt(listing.price) < parseInt(priceRange.min)
      ) {
        return false;
      }
      if (
        priceRange.max &&
        parseInt(listing.price) > parseInt(priceRange.max)
      ) {
        return false;
      }

      // Filter by area range
      if (areaRange.min && parseInt(listing.area) < parseInt(areaRange.min)) {
        return false;
      }
      if (areaRange.max && parseInt(listing.area) > parseInt(areaRange.max)) {
        return false;
      }

      // Filter by region
      if (
        selectedRegions.length > 0 &&
        !selectedRegions.includes(listing.city.region.id)
      ) {
        return false;
      }

      // Filter by bedrooms
      if (bedrooms && parseInt(listing.bedrooms) !== parseInt(bedrooms)) {
        return false;
      }

      return true;
    });
    setFilteredListings(filtered);
  }, [listings, priceRange, areaRange, selectedRegions, bedrooms]);
  // Save filters to localStorage whenever they change
  useEffect(() => {
    if (isDataFetched) {
      const filters = { priceRange, areaRange, selectedRegions, bedrooms };
      localStorage.setItem("filters", JSON.stringify(filters));
      applyFilters();
    }
  }, [
    priceRange,
    areaRange,
    selectedRegions,
    bedrooms,
    isDataFetched,
    applyFilters,
  ]);

  useEffect(() => {
    applyFilters();
  }, [listings, priceRange, areaRange, selectedRegions, bedrooms, applyFilters]);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleAddConfirm = () => {
    setIsModalOpen(false);
    // Already handled in the DeleteModal component
  };
  const handleRemoveRegion = (id) => {
    setSelectedRegions((prevSelectedRegions) =>
      prevSelectedRegions.filter((regionId) => regionId !== id)
    );
  };
  const handleRemovePriceRange = () => {
    setPriceRange({ min: "", max: "" });
  };

  // Handler to remove the area range filter
  const handleRemoveAreaRange = () => {
    setAreaRange({ min: "", max: "" });
  };

  // Handler to remove the bedrooms filter
  const handleRemoveBedrooms = () => {
    setBedrooms("");
  };

  const handleClearAllFilters = () => {
    setBedrooms("");
    setAreaRange({ min: "", max: "" });
    setPriceRange({ min: "", max: "" });
    setSelectedRegions([]);
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className={styles.topContainer}>
        <div className={styles.filterContainer}>
          {/* Region */}
          <div className={styles.filterDropdown}>
            <label className={styles.topLabels}>რეგიონი</label>
            <div className={styles.filterDropdownContent}>
              {regions.map((region) => (
                <div className={styles.checkBoxRegions} key={region.id}>
                  <input
                    type="checkbox"
                    value={region.id}
                    checked={selectedRegions.includes(region.id)}
                    onChange={handleRegionChange}
                  />
                  <label>{region.name}</label>
                </div>
              ))}
              <button
                className={styles.applyFilt}
                onClick={() => validateFilters() && applyFilters()}
              >
                არჩევა
              </button>
            </div>
          </div>
          {/* Price Range */}
          <div className={styles.filterDropdown}>
            <label>საფასო კატეგორია</label>
            <div className={styles.filterDropdownContent3}>
              <input
                type="number"
                name="min"
                placeholder="Min"
                value={priceRange.min}
                onChange={handlePriceChange}
              />
              <input
                type="number"
                name="max"
                placeholder="Max"
                value={priceRange.max}
                onChange={handlePriceChange}
              />
              {validationMessage && (
                <p style={{ color: "red" }}>{validationMessage}</p>
              )}
              <button
                className={styles.applyFilt3}
                onClick={() => validateFilters() && applyFilters()}
              >
                არჩევა
              </button>
            </div>
          </div>

          {/* Area Range */}
          <div className={styles.filterDropdown}>
            <label>ფართობი</label>
            <div className={styles.filterDropdownContent3}>
              <input
                type="number"
                name="min"
                placeholder="Min"
                value={areaRange.min}
                onChange={handleAreaChange}
              />
              <input
                type="number"
                name="max"
                placeholder="Max"
                value={areaRange.max}
                onChange={handleAreaChange}
              />
              {validationMessage && (
                <p style={{ color: "red" }}>{validationMessage}</p>
              )}
              <button
                className={styles.applyFilt3}
                onClick={() => validateFilters() && applyFilters()}
              >
                არჩევა
              </button>
            </div>
          </div>

          {/* Number of Bedrooms */}
          <div className={styles.filterDropdown}>
            <label>საძინებლების რაოდენობა</label>
            <div className={styles.filterDropdownContent2}>
              <input
                type="number"
                placeholder="1"
                value={bedrooms}
                onChange={handleBedroomsChange}
                min="1"
                step="1"
                onKeyDown={(e) => {
                  if (e.key === "." || e.key === "-" || e.key === "e") {
                    e.preventDefault(); // Prevents typing decimals, negative numbers, and scientific notation
                  }
                }}
                pattern="\d*"
              />
              <button
                className={styles.applyFilt2}
                onClick={() => validateFilters() && applyFilters()}
              >
                არჩევა
              </button>
            </div>
          </div>
        </div>

        <div className={styles.topContainerButtons}>
          <Link to="/new-listing" className={styles.noTextDecoration}>
            <button className={styles.listingAdd}>+ Add New Listing</button>
          </Link>

          <button onClick={handleAddClick} className={styles.agentAdd}>
            + Add Agent
          </button>
          <AgentModal
            isOpen={isModalOpen}
            onRequestClose={handleModalClose}
            onConfirm={handleAddConfirm}
          />
        </div>
      </div>
      <div className={styles.chosenFilters}>
        {regions
          .filter((region) => selectedRegions.includes(region.id)) // Filter regions based on selected IDs
          .map((filteredRegion) => (
            <div>
              <span key={filteredRegion.id}>
                {filteredRegion.name} {/* Display the region name */}
              </span>
              <button onClick={() => handleRemoveRegion(filteredRegion.id)}>
                X
              </button>
            </div>
          ))}
        {priceRange.min || priceRange.max ? (
          <div>
            {priceRange.min} ₾ - {priceRange.max} ₾{" "}
            <button onClick={handleRemovePriceRange}>X</button>
          </div>
        ) : null}
        {areaRange.min || areaRange.max ? (
          <div>
            {areaRange.min} მ<sup>2</sup> - {areaRange.max} მ<sup>2</sup>{" "}
            <button onClick={handleRemoveAreaRange}>X</button>
          </div>
        ) : null}
        {bedrooms ? (
          <div>
            {bedrooms} <button onClick={handleRemoveBedrooms}>X</button>
          </div>
        ) : null}
        {(priceRange.min ||
          priceRange.max ||
          areaRange.min ||
          areaRange.max ||
          bedrooms) && (
          <button
            className={styles.clearAllbutton}
            onClick={handleClearAllFilters}
          >
            გასუფთავება
          </button>
        )}
      </div>
      <div className={styles.content}>
        {filteredListings.length !== 0 ? (
          filteredListings.map((property) => (
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
          <p className={styles.noPropertiesFound}>
            აღნიშნული მონაცემებით განცხადება არ იძებნება
          </p>
        )}
      </div>
    </div>
  );
}

export default ListingsPage;
