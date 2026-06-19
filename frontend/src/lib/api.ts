const localApiUrl = 'http://localhost:5000/api';

export function getApiUrl() {
  // Use relative proxy path on the client to avoid CORS and connectivity issues
  if (typeof window !== 'undefined') {
    return '/api/backend';
  }
  return process.env.NEXT_PUBLIC_API_URL || localApiUrl;
}

export function getRequiredApiUrl(context: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl && process.env.NODE_ENV === 'production') {
    throw new Error(`NEXT_PUBLIC_API_URL is required for ${context}`);
  }

  return apiUrl || localApiUrl;
}

export function shouldLogApiFetchError() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || localApiUrl;
  return !apiUrl.includes('localhost') && !apiUrl.includes('127.0.0.1');
}
