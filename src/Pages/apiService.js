import axios from "axios";

const BASE_URL = "http://localhost:8081";

export const fetchDropdownData = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/api/geographic-nexus/allDropDowns`, {
      cityIdsUi: [],
      areaIdsUi: [],
      clientIdsUi: []
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dropdown data:", error);
    return null;
  }
};

export const fetchAreasByCity = async (cityId) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/geographic-nexus/allDropDowns`, {
      cityIdsUi: [cityId],
      areaIdsUi: [],
      clientIdsUi: []
    });
    return response.data.areas || [];
  } catch (error) {
    console.error("Error fetching areas:", error);
    return [];
  }
};

export const fetchClientsByFilters = async (filters) => {
  try {
    const response = await axios.post(`${BASE_URL}/legal-wings-management/clients/all`, filters);
    return response.data.clientPage?.content || [];
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
};
