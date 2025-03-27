import axios from "axios";

const BASE_URL = "http://13.50.102.11:8080";

// Function to fetch dropdown data
export const fetchDropdownData = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/api/geographic-nexus/allDropDowns`, {
      cityIdsUi: [],
      stateIdsUi: [],
      zoneIdsUi: [], // You don't want zone, but some APIs require an empty array
      areaIdsUi: [],
      clientIdsUi: []
    });

    console.log("🔹 Raw API Response:", response.data); // Log full API response
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching dropdown data:", error);
    return null;
  }
};


// Function to fetch all clients (WITHOUT date filters)
export const fetchAllClients = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/legal-wings-management/clients/all`,
      {
        sortField: "id",
        sortOrder: "",
        searchText: null,
        pageNumber: 0,
        pageSize: 100,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.clientPage?.content || [];
  } catch (error) {
    console.error("Error fetching all clients:", error);
    return { cityIdsUi: [], areaIdsUi: [], clientIdsUi: [] };
  }
};
