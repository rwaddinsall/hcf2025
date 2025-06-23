// Test script to debug Strapi API call
console.log('Testing Strapi API...');

const STRAPI_URL = 'https://healing-dance-c1ea66b091.strapiapp.com';

async function testFetchArtists() {
  const url = new URL(`${STRAPI_URL}/api/artists`);
  
  // Add the same query parameters as in the component
  url.searchParams.append('filters[publishedAt][$notNull]', 'true');
  url.searchParams.append('populate', '*');
  url.searchParams.append('sort', 'displayOrder:asc');
  
  console.log('Fetching from:', url.toString());
  
  try {
    const res = await fetch(url.toString());
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`API Error: ${res.status} ${res.statusText}`, errorText);
      return;
    }
    
    const data = await res.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    // Check if data has the expected structure
    if (data.data) {
      console.log(`Found ${data.data.length} artists`);
      console.log('First artist:', data.data[0]);
    } else {
      console.log('No data property found');
    }
    
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testFetchArtists();
