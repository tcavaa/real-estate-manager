import React, { useState, useEffect } from "react";
import API from "../api/api"; // Adjust the path as needed

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
      setForSale(savedData.forSale || "");
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
      console.log("Saving Data:", formData); // Debugging line
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
    isLoaded
  ]);

  const handleAddressChange = (e) => setAddress(e.target.value);
  const handleImageChange = (e) => setImage(e.target.files[0]);
  const handleRegionChange = (e) => setSelectedRegion(e.target.value);
  const handleCityChange = (e) => setSelectedCity(e.target.value);
  const handlePostalCodeChange = (e) => setPostalCode(e.target.value);
  const handlePriceChange = (e) => setPrice(e.target.value);
  const handleAreaChange = (e) => setArea(e.target.value);
  const handleBedroomsChange = (e) => setBedrooms(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleForSaleChange = (e) => {
    setForSale(Number(e.target.value));
  };
  const handleAgentChange = (e) => setAgent(e.target.value);

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

      alert("Listing added successfully!");
      localStorage.removeItem("addListingForm"); // Clear saved form data
      // Optionally redirect or clear form
    } catch (error) {
      console.error("Error adding listing:", error);
      alert("Failed to add listing.");
    }
  };

  return (
    <div>
      <h1>Add New Listing</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={handleAddressChange}
            required
            minLength="2"
          />
        </div>

        <div>
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        <div>
          <label>Region:</label>
          <select value={selectedRegion} onChange={handleRegionChange} required>
            <option value="">Select a region</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        {selectedRegion && (
          <div>
            <label>City:</label>
            <select value={selectedCity} onChange={handleCityChange} required>
              <option value="">Select a city</option>
              {filteredCities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label>Postal Code:</label>
          <input
            type="text"
            value={postalCode}
            onChange={handlePostalCodeChange}
            required
            pattern="\d+"
          />
        </div>

        <div>
          <label>Price:</label>
          <input
            type="text"
            value={price}
            onChange={handlePriceChange}
            required
            pattern="\d+"
          />
        </div>

        <div>
          <label>Area:</label>
          <input
            type="text"
            value={area}
            onChange={handleAreaChange}
            required
            pattern="\d+"
          />
        </div>

        <div>
          <label>Number of Bedrooms:</label>
          <input
            type="text"
            value={bedrooms}
            onChange={handleBedroomsChange}
            required
            pattern="\d+"
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            required
            minLength="5"
          />
        </div>

        <div>
          <label>For Sale/Rent:</label>
          <label>
            <input
              type="radio"
              value="0"
              checked={forSale == 0}
              onChange={handleForSaleChange}
            />
            For Sale
          </label>
          <label>
            <input
              type="radio"
              value="1"
              checked={forSale == 1}
              onChange={handleForSaleChange}
            />
            For Rent
          </label>
        </div>

        <div>
          <label>Agent:</label>
          <select value={agent} onChange={handleAgentChange} required>
            <option value="">Select an agent</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Add Listing</button>
      </form>
    </div>
  );
}

export default AddListing;
