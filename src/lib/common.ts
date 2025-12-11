import { cookies } from "next/headers";
const environment = process.env.NODE_ENV
const url = environment === "development" ? "http://localhost:9999" : "https://readme-generator.xyz/"


export const fetchRecentReadmes = async () => {
  try {
    // Get all cookies to pass along with the request
    const cookieStore = cookies();
    
    const response = await fetch(`${url}/api/generate-docs`, {
      headers: {
        // Pass the cookie header to maintain the session
        Cookie: cookieStore.getAll()
          .map(cookie => `${cookie.name}=${cookie.value}`)
          .join('; '),
      },
      // Ensure Next.js doesn't cache this request
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error('API response not OK:', response.status, response.statusText);
      throw new Error(`Failed to fetch recent READMEs: ${response.status}`);
    }
    
    const data = await response.json();
    // console.log("Successfully fetched data:", data);
    return data;
  } catch (error) {
    console.error('Error fetching recent READMEs:', error);
    return []; // Return an empty array instead of undefined
  }
};


export const fetchReadme = async (readmeId : string) => {
    try {
      
      const response = await fetch(`/api/saved/${readmeId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('README not found');
        }
        throw new Error('Failed to fetch README');
      }
      
      const data = await response.json();
      return data 
    } catch (error: any) {
      console.error('Error fetching README:', error);
    } 
  };
