const API_BASE_URL = "http://127.0.0.1:8000";

async function apiRequest(endpoint, method = "GET", data = null) {

    const options = {
    method
    // headers: {
    //   "Content-Type": data instanceof FormData ? "multipart/form-data" : "application/json"
    // }
  };

  if (data) {
    options.body = data instanceof FormData ? data : JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const result = await response.json();

  if (!response.ok) {
    console.error("API Error:", result);
    throw new Error(result.message || result.detail || "Something went wrong" );
  }

  return result;
}