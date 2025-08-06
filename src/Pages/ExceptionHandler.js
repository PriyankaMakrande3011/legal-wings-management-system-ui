export const handleApiRequest = async (url, method = "GET", data = null, token = null) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      accept: "*/*",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    const result = isJson ? await response.json() : null;

    if (!response.ok) {
      // ✅ This line matches your logic exactly
      const errorMessage = result?.error || result?.message || response.statusText || `HTTP Error ${response.status}`;
      throw new Error(errorMessage);
    }

    return result;
  } catch (err) {
    throw err;
  }
};
