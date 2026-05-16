// const defaultApiUrl = 'http://localhost:5001/api';
const defaultApiUrl = 'https://ems-backend-x5wa.onrender.com/api';
const institutionName = import.meta.env.VITE_INSTITUTION_NAME?.trim() || 'EMS';
function validateApiUrl(value: string): string {
  try {
    return new URL(value).toString().replace(/\/$/, '');
  } catch {
    throw new Error(`Invalid VITE_API_URL value: ${value}`);
  }
}

export const env = {
  apiUrl: validateApiUrl(import.meta.env.VITE_API_URL?.trim() || defaultApiUrl),
  institutionName,
};
