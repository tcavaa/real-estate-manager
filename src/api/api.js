import axios from "axios";

const token = "9d08cf6f-bbfd-49d8-85a5-f7a618a36d72";

const API = {
  fetchListings: async () => {
    const response = await axios.get(
      "https://api.real-estate-manager.redberryinternship.ge/api/real-estates",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      }
    );
    return response.data;
  },
  fetchListing: async (id) => {
    const response = await axios.get(
      `https://api.real-estate-manager.redberryinternship.ge/api/real-estates/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      }
    );
    return response.data;
  },
  addListing: async ({
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
  }) => {
    const formData = new FormData();
    formData.append("address", address);
    formData.append("image", image);
    formData.append("region_id", selectedRegion);
    formData.append("description", description);
    formData.append("city_id", selectedCity);
    formData.append("zip_code", postalCode);
    formData.append("price", price);
    formData.append("area", area);
    formData.append("bedrooms", bedrooms);
    formData.append("is_rental", forSale);
    formData.append("agent_id", agent);

    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
    try {
      const response = await axios.post(
        "https://api.real-estate-manager.redberryinternship.ge/api/real-estates",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding agent:", error);
      throw error;
    }
  },
  deleteListing: async (id) => {
    const response = await axios.delete(
      `https://api.real-estate-manager.redberryinternship.ge/api/real-estates/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      }
    );
    return response.data;
  },
  fetchAgents: async () => {
    const response = await axios.get(
      "https://api.real-estate-manager.redberryinternship.ge/api/agents",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      }
    );
    return response.data;
  },
  addAgents: async ({ name, surname, email, phone, avatar }) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("surname", surname);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("avatar", avatar);

    try {
      const response = await axios.post(
        "https://api.real-estate-manager.redberryinternship.ge/api/agents",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding agent:", error);
      throw error;
    }
  },
  fetchRegions: async () => {
    const response = await axios.get(
      "https://api.real-estate-manager.redberryinternship.ge/api/regions",
      {
        headers: {
          accept: "application/json",
        },
      }
    );
    return response.data;
  },
  fetchCities: async () => {
    const response = await axios.get(
      "https://api.real-estate-manager.redberryinternship.ge/api/cities",
      {
        headers: {
          accept: "application/json",
        },
      }
    );
    return response.data;
  },
};
export default API;
