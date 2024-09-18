import axios from 'axios';

const token = '9d08cf6f-bbfd-49d8-85a5-f7a618a36d72';

const API = {
    fetchListings : async () => {
       const response = await axios.get(
            "https://api.real-estate-manager.redberryinternship.ge/api/real-estates",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    accept: "application/json",
                },
            }
        );
        return response.data 
    },
    fetchListing : async ( id ) => {
        const response = await axios.get(
             `https://api.real-estate-manager.redberryinternship.ge/api/real-estates/${id}`,
             {
                 headers: {
                     Authorization: `Bearer ${token}`,
                     accept: "application/json",
                 },
             }
         );
         return response.data 
     },
     deleteListing : async ( id ) => {
        const response = await axios.delete(
             `https://api.real-estate-manager.redberryinternship.ge/api/real-estates/${id}`,
             {
                 headers: {
                     Authorization: `Bearer ${token}`,
                     accept: "application/json",
                 },
             }
         );
         return response.data 
     },
    fetchAgents : async () => {
        const response = await axios.get(
             "https://api.real-estate-manager.redberryinternship.ge/api/agents",
             {
                 headers: {
                     Authorization: `Bearer ${token}`,
                     accept: "application/json",
                 },
             }
         );
         return response.data 
     },
    fetchRegions : async () => {
        const response = await axios.get(
             "https://api.real-estate-manager.redberryinternship.ge/api/regions",
             {
                 headers: {
                    accept: "application/json",
                 },
             }
         );
         return response.data 
    }, 
    fetchCities : async () => {
        const response = await axios.get(
             "https://api.real-estate-manager.redberryinternship.ge/api/cities",
             {
                 headers: {
                    accept: "application/json",
                 },
             }
         );
         return response.data 
    },   
    
};
export default API;
