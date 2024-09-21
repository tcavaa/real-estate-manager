import React, { useState, useEffect } from "react";
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

  // Save filters to localStorage whenever they change
  useEffect(() => {
    if (isDataFetched) {
      const filters = { priceRange, areaRange, selectedRegions, bedrooms };
      localStorage.setItem("filters", JSON.stringify(filters));
      applyFilters();
    }
  }, [priceRange, areaRange, selectedRegions, bedrooms, isDataFetched]);

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
      setValidationMessage("Please enter valid numbers for price range.");
      return false;
    }
    if (
      areaRange.min &&
      areaRange.max &&
      parseInt(areaRange.min) > parseInt(areaRange.max)
    ) {
      setValidationMessage("Please enter valid numbers for area range.");
      return false;
    }
    setValidationMessage("");
    return true;
  };

  // Apply filters to listings
  const applyFilters = () => {
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
  };

  useEffect(() => {
    applyFilters();
  }, [listings, priceRange, areaRange, selectedRegions, bedrooms]);

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
  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {validationMessage && <p style={{ color: "red" }}>{validationMessage}</p>}

      {/* Price Range */}
      <div>
        <label>Price Range:</label>
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
      </div>

      {/* Area Range */}
      <div>
        <label>Area Range:</label>
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
      </div>

      {/* Region */}
      <div>
        <label>Region:</label>
        {regions.map((region) => (
          <div key={region.id}>
            <input
              type="checkbox"
              value={region.id}
              checked={selectedRegions.includes(region.id)}
              onChange={handleRegionChange}
            />
            <label>{region.name}</label>
          </div>
        ))}
      </div>

      {/* Number of Bedrooms */}
      <div>
        <label>Bedrooms:</label>
        <input
          type="number"
          placeholder="Number of bedrooms"
          value={bedrooms}
          onChange={handleBedroomsChange}
        />
      </div>
      <button onClick={() => validateFilters() && applyFilters()}>
        Apply Filters
      </button>

      <div>
        <Link to="/new-listing" className={styles.noTextDecoration}><button className={styles.listingAdd}>+ Add New Listing</button></Link>
        
        <button onClick={handleAddClick} className={styles.agentAdd}>+ Add Agent</button>
        <AgentModal
          isOpen={isModalOpen}
          onRequestClose={handleModalClose}
          onConfirm={handleAddConfirm}
        />
      </div>
      <div className={styles.content}>
        {filteredListings.map((property) => (
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
        ))}
      </div>
    </div>
  );
}

export default ListingsPage;
