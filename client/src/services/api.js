const API_BASE = '/api/v1';

export const apiFetch = async (endpoint, options = {}) => {
  const headers = options.headers || {};
  
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Include credentials for cookies
  options.credentials = 'include';
  options.headers = headers;

  const response = await fetch(`${API_BASE}${endpoint}`, options);
  
  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = { success: false, message: 'Server returned an invalid JSON response.' };
  }

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};
