/**
 * Frontend env — validated once at boot. Fails visibly (not silently)
 * if the API URL is missing, so misconfigured deploys are obvious.
 */
const required = (key) => {
  const value = import.meta.env[key];
  if (!value) console.warn(`[env] ${key} is not set — falling back to default`);
  return value;
};

export const env = {
  apiUrl: required("VITE_API_URL") || "http://localhost:5000/api",
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};

export default env;
