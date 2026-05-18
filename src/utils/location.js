// State name → state code mapping (all 36 states + UTs + aliases)
export const STATE_MAP = {
  // States
  'andhra pradesh': 'AP', 'arunachal pradesh': 'AR', 'assam': 'AS', 'bihar': 'BR',
  'chhattisgarh': 'CG', 'goa': 'GA', 'gujarat': 'GJ', 'haryana': 'HR',
  'himachal pradesh': 'HP', 'jharkhand': 'JH', 'karnataka': 'KA', 'kerala': 'KL',
  'madhya pradesh': 'MP', 'maharashtra': 'MH', 'manipur': 'MN', 'meghalaya': 'ML',
  'mizoram': 'MZ', 'nagaland': 'NL', 'odisha': 'OD', 'punjab': 'PB',
  'rajasthan': 'RJ', 'sikkim': 'SK', 'tamil nadu': 'TN', 'telangana': 'TS',
  'tripura': 'TR', 'uttar pradesh': 'UP', 'uttarakhand': 'UK', 'west bengal': 'WB',
  // Union Territories
  'andaman and nicobar islands': 'AN', 'andaman & nicobar islands': 'AN',
  'chandigarh': 'CH',
  'dadra and nagar haveli and daman and diu': 'DD',
  'dadra and nagar haveli': 'DD', 'dadra & nagar haveli': 'DD', 'daman and diu': 'DD',
  'delhi': 'DL', 'national capital territory of delhi': 'DL',
  'new delhi': 'DL', 'nct of delhi': 'DL', 'nct delhi': 'DL',
  'lakshadweep': 'LD', 'puducherry': 'PY', 'pondicherry': 'PY',
  'jammu and kashmir': 'JK', 'jammu & kashmir': 'JK', 'ladakh': 'JK',
  // State aliases
  'orissa': 'OD', 'uttaranchal': 'UK', 'tamilnadu': 'TN', 'bengal': 'WB',
  // Major cities → state (used when IP API returns city instead of state)
  'bengaluru': 'KA', 'bangalore': 'KA', 'mysuru': 'KA', 'mysore': 'KA', 'hubli': 'KA', 'mangalore': 'KA', 'belgaum': 'KA',
  'mumbai': 'MH', 'pune': 'MH', 'nagpur': 'MH', 'nashik': 'MH', 'aurangabad': 'MH', 'thane': 'MH', 'navi mumbai': 'MH',
  'hyderabad': 'TS', 'warangal': 'TS', 'nizamabad': 'TS', 'karimnagar': 'TS', 'khammam': 'TS',
  'chennai': 'TN', 'coimbatore': 'TN', 'madurai': 'TN', 'tiruchirappalli': 'TN', 'salem': 'TN', 'trichy': 'TN', 'tiruppur': 'TN',
  'kolkata': 'WB', 'howrah': 'WB', 'durgapur': 'WB', 'siliguri': 'WB', 'asansol': 'WB',
  'noida': 'UP', 'gurgaon': 'HR', 'gurugram': 'HR', 'faridabad': 'HR',
  'lucknow': 'UP', 'kanpur': 'UP', 'agra': 'UP', 'varanasi': 'UP', 'allahabad': 'UP', 'prayagraj': 'UP', 'meerut': 'UP',
  'jaipur': 'RJ', 'jodhpur': 'RJ', 'udaipur': 'RJ', 'kota': 'RJ', 'ajmer': 'RJ', 'bikaner': 'RJ',
  'ahmedabad': 'GJ', 'surat': 'GJ', 'vadodara': 'GJ', 'rajkot': 'GJ', 'gandhinagar': 'GJ',
  'bhopal': 'MP', 'indore': 'MP', 'gwalior': 'MP', 'jabalpur': 'MP',
  'patna': 'BR', 'gaya': 'BR', 'muzaffarpur': 'BR', 'bhagalpur': 'BR',
  'ranchi': 'JH', 'jamshedpur': 'JH', 'dhanbad': 'JH',
  'bhubaneswar': 'OD', 'cuttack': 'OD', 'rourkela': 'OD',
  'guwahati': 'AS', 'dibrugarh': 'AS', 'silchar': 'AS',
  'thiruvananthapuram': 'KL', 'kochi': 'KL', 'kozhikode': 'KL', 'thrissur': 'KL',
  'visakhapatnam': 'AP', 'vijayawada': 'AP', 'guntur': 'AP', 'tirupati': 'AP',
  'chandigarh city': 'CH', 'mohali': 'PB', 'amritsar': 'PB', 'ludhiana': 'PB',
  'dehradun': 'UK', 'haridwar': 'UK',
  'shimla': 'HP', 'dharamsala': 'HP',
  'imphal': 'MN', 'shillong': 'ML', 'aizawl': 'MZ', 'kohima': 'NL', 'agartala': 'TR',
  'itanagar': 'AR', 'gangtok': 'SK', 'panaji': 'GA',
};

export function matchState(nameRaw) {
  if (!nameRaw) return null;
  const n = nameRaw.toLowerCase().trim().replace(/\s+/g, ' ');
  // Exact match first
  if (STATE_MAP[n]) return STATE_MAP[n];
  // Check if input contains a known state/city key
  for (const [k, v] of Object.entries(STATE_MAP)) {
    if (n === k) return v;
    if (n.includes(k) && k.length > 4) return v; // input contains key (min 5 chars to avoid false matches)
    if (k.includes(n) && n.length > 4) return v; // key contains input
  }
  return null;
}

export function autoDetectState(callbacks) {
  const { onDetecting, onFound, onError } = callbacks;

  if (onDetecting) onDetecting();

  const tryIPGeolocation = () => {
    // API 1: ip-api.com — very reliable, returns city consistently
    fetch('https://ip-api.com/json/?fields=status,country,countryCode,regionName,city,query')
      .then((r) => r.json())
      .then((d) => {
        if (d.status === 'success') {
          const city = d.city || '';
          const region = d.regionName || '';
          const isIndia = (d.countryCode === 'IN' || d.country === 'India');
          if (isIndia) {
            const code = matchState(region) || matchState(city);
            if (onFound) onFound(city, region, code);
          } else {
            if (onFound) onFound(city, region || d.country || '', null);
          }
        } else {
          tryAPI2();
        }
      })
      .catch(() => { tryAPI2(); });
  };

  const tryAPI2 = () => {
    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) {
          const city = d.city || d.region || '';
          const region = d.region || '';
          const isIndia = (d.country_code === 'IN');
          if (isIndia) {
            const code = matchState(region) || matchState(city);
            if (onFound) onFound(city, region, code);
          } else {
            if (onFound) onFound(city, region || d.country_name || '', null);
          }
        } else {
          tryAPI3();
        }
      })
      .catch(() => { tryAPI3(); });
  };

  const tryAPI3 = () => {
    fetch('https://ipinfo.io/json')
      .then((r) => r.json())
      .then((d) => {
        if (d && d.country === 'IN') {
          const city = d.city || '';
          const region = d.region || '';
          const code = matchState(region) || matchState(city);
          if (onFound) onFound(city, region, code);
        } else if (d && d.city) {
          if (onFound) onFound(d.city, d.region || d.country || '', null);
        } else {
          if (onError) onError();
        }
      })
      .catch(() => {
        if (onError) onError();
      });
  };

  const reverseGeocodeGPS = (lat, lng) => {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=10&accept-language=en`,
      { headers: { 'User-Agent': 'EveryStampDuty.com/1.0' } }
    )
      .then((r) => r.json())
      .then((data) => {
        const addr = data.address || {};
        const city = addr.city || addr.town || addr.city_district ||
                     addr.municipality || addr.suburb || addr.village ||
                     addr.county || addr.state_district || '';
        const state = addr.state || '';
        const code = matchState(state) || matchState(city);
        if (city || state) {
          if (onFound) onFound(city, state, code);
        } else {
          tryIPGeolocation();
        }
      })
      .catch(() => { tryIPGeolocation(); });
  };

  // Try GPS first, then fall back to IP-based detection
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        reverseGeocodeGPS(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        // GPS blocked or denied — go straight to IP detection
        tryIPGeolocation();
      },
      { timeout: 6000, maximumAge: 600000, enableHighAccuracy: false }
    );
  } else {
    tryIPGeolocation();
  }
}
