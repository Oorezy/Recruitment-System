// const API_BASE_URL = "http://127.0.0.1:8000";//DEV 
const API_BASE_URL = "https://oore-hello.norwayeast.cloudapp.azure.com/api";//PROD

async function apiRequest(endpoint, method = "GET", data = null) {

    const options = {
    method,
    headers: 
      data instanceof FormData ? {} : { "Content-Type": "application/json" }    
  };

  if (data) {
    options.body = data instanceof FormData ? data : JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  let result = null;

  if (!response.ok) {
    result = await response.json();
    console.error("API Error:", result);
    throw new Error(result.message || result.detail || "Something went wrong" );
  }

  if (endpoint.includes("resume")) {
    return response;
  }  else { 
    result = await response.json();
  return result;
  }
}