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

const DISTRICT_MAP = {
  // KARNATAKA (31 districts)
  'bengaluru urban':'KA','bengaluru rural':'KA','tumakuru':'KA','tumkur':'KA','kolar':'KA',
  'chikkaballapura':'KA','ramanagara':'KA','mandya':'KA','mysuru':'KA','chamarajanagar':'KA',
  'hassan':'KA','dakshina kannada':'KA','udupi':'KA','kodagu':'KA','shivamogga':'KA',
  'chikkamagaluru':'KA','davangere':'KA','chitradurga':'KA','bellary':'KA','ballari':'KA',
  'vijayanagara':'KA','raichur':'KA','koppal':'KA','bagalkot':'KA','vijayapura':'KA',
  'bijapur':'KA','dharwad':'KA','gadag':'KA','haveri':'KA','uttara kannada':'KA',
  'belagavi':'KA','belgaum':'KA','bidar':'KA','yadgir':'KA','kalaburagi':'KA','gulbarga':'KA',
  // MAHARASHTRA (36 districts)
  'mumbai':'MH','mumbai suburban':'MH','thane':'MH','raigad':'MH','ratnagiri':'MH',
  'sindhudurg':'MH','pune':'MH','satara':'MH','sangli':'MH','solapur':'MH','kolhapur':'MH',
  'nashik':'MH','dhule':'MH','nandurbar':'MH','jalgaon':'MH','ahmednagar':'MH',
  'aurangabad':'MH','chhatrapati sambhajinagar':'MH','jalna':'MH','beed':'MH','latur':'MH',
  'osmanabad':'MH','dharashiv':'MH','nanded':'MH','hingoli':'MH','parbhani':'MH',
  'amravati':'MH','akola':'MH','washim':'MH','buldhana':'MH','yavatmal':'MH',
  'nagpur':'MH','wardha':'MH','chandrapur':'MH','gadchiroli':'MH','gondia':'MH','bhandara':'MH',
  // DELHI (11 districts)
  'central delhi':'DL','east delhi':'DL','new delhi':'DL','north delhi':'DL',
  'north east delhi':'DL','north west delhi':'DL','shahdara':'DL','south delhi':'DL',
  'south east delhi':'DL','south west delhi':'DL','west delhi':'DL',
  // UTTAR PRADESH (75 districts)
  'lucknow':'UP','kanpur nagar':'UP','kanpur dehat':'UP','agra':'UP','mathura':'UP',
  'aligarh':'UP','hathras':'UP','firozabad':'UP','mainpuri':'UP','etah':'UP',
  'kasganj':'UP','bulandshahr':'UP','gautam buddha nagar':'UP','ghaziabad':'UP',
  'hapur':'UP','meerut':'UP','baghpat':'UP','muzaffarnagar':'UP','shamli':'UP',
  'saharanpur':'UP','varanasi':'UP','chandauli':'UP','ghazipur':'UP','jaunpur':'UP',
  'mirzapur':'UP','sonbhadra':'UP','sant ravidas nagar':'UP','allahabad':'UP',
  'prayagraj':'UP','kaushambi':'UP','fatehpur':'UP','pratapgarh':'UP','gorakhpur':'UP',
  'deoria':'UP','kushinagar':'UP','maharajganj':'UP','azamgarh':'UP','mau':'UP',
  'ballia':'UP','bareilly':'UP','pilibhit':'UP','shahjahanpur':'UP','budaun':'UP',
  'rampur':'UP','moradabad':'UP','amroha':'UP','bijnor':'UP','sambhal':'UP',
  'sitapur':'UP','hardoi':'UP','lakhimpur kheri':'UP','unnao':'UP','rae bareli':'UP',
  'faizabad':'UP','ayodhya':'UP','ambedkar nagar':'UP','sultanpur':'UP','amethi':'UP',
  'bahraich':'UP','shravasti':'UP','balrampur':'UP','gonda':'UP','basti':'UP',
  'sant kabir nagar':'UP','siddharthnagar':'UP','banda':'UP','chitrakoot':'UP',
  'hamirpur':'UP','mahoba':'UP','jhansi':'UP','lalitpur':'UP','jaluan':'UP',
  // TAMIL NADU (38 districts)
  'chennai':'TN','tiruvallur':'TN','kancheepuram':'TN','chengalpattu':'TN','vellore':'TN',
  'ranipet':'TN','tirupattur':'TN','krishnagiri':'TN','dharmapuri':'TN','salem':'TN',
  'namakkal':'TN','erode':'TN','tiruppur':'TN','coimbatore':'TN','nilgiris':'TN',
  'madurai':'TN','theni':'TN','dindigul':'TN','tiruchirappalli':'TN','karur':'TN',
  'perambalur':'TN','ariyalur':'TN','thanjavur':'TN','tiruvarur':'TN','nagapattinam':'TN',
  'mayiladuthurai':'TN','cuddalore':'TN','villupuram':'TN','kallakurichi':'TN',
  'virudhunagar':'TN','ramanathapuram':'TN','sivagangai':'TN','pudukkottai':'TN',
  'tenkasi':'TN','tirunelveli':'TN','tuticorin':'TN','thoothukudi':'TN','kanyakumari':'TN',
  // TELANGANA (33 districts)
  'hyderabad':'TS','rangareddy':'TS','medchal malkajgiri':'TS','sangareddy':'TS',
  'vikarabad':'TS','nalgonda':'TS','suryapet':'TS','yadadri bhuvanagiri':'TS',
  'warangal urban':'TS','warangal rural':'TS','hanumakonda':'TS','karimnagar':'TS',
  'peddapalli':'TS','jagtiyal':'TS','rajanna sircilla':'TS','nizamabad':'TS',
  'kamareddy':'TS','medak':'TS','siddipet':'TS','jangaon':'TS','bhupalpally':'TS',
  'mulugu':'TS','khammam':'TS','bhadradri kothagudem':'TS','mahabubabad':'TS',
  'mahabubnagar':'TS','wanaparthy':'TS','narayanpet':'TS','gadwal':'TS','jogulamba':'TS',
  'nagarkurnool':'TS','nandyal':'TS','kurnool':'TS',
  // ANDHRA PRADESH
  'srikakulam':'AP','vizianagaram':'AP','visakhapatnam':'AP','alluri sitarama raju':'AP',
  'anakapalli':'AP','kakinada':'AP','konaseema':'AP','eluru':'AP','west godavari':'AP',
  'krishna':'AP','ntr district':'AP','guntur':'AP','palnadu':'AP','prakasam':'AP',
  'sri potti sriramulu nellore':'AP','nellore':'AP','annamayya':'AP','tirupati':'AP',
  'chittoor':'AP','sri balaji':'AP','kadapa':'AP','anantapur':'AP','sri sathya sai':'AP',
  'kurnool':'AP',
  // GUJARAT (33 districts)
  'ahmedabad':'GJ','gandhinagar':'GJ','anand':'GJ','kheda':'GJ','mahisagar':'GJ',
  'vadodara':'GJ','chhota udaipur':'GJ','dahod':'GJ','panchmahal':'GJ','surat':'GJ',
  'bharuch':'GJ','narmada':'GJ','tapi':'GJ','navsari':'GJ','valsad':'GJ','dang':'GJ',
  'rajkot':'GJ','jamnagar':'GJ','morbi':'GJ','devbhumi dwarka':'GJ','porbandar':'GJ',
  'junagadh':'GJ','gir somnath':'GJ','amreli':'GJ','bhavnagar':'GJ','botad':'GJ',
  'surendranagar':'GJ','patan':'GJ','mehsana':'GJ','banaskantha':'GJ','sabarkantha':'GJ',
  'aravalli':'GJ','khambhalia':'GJ',
  // RAJASTHAN (50 districts)
  'jaipur':'RJ','jaipur rural':'RJ','alwar':'RJ','bharatpur':'RJ','dholpur':'RJ',
  'karauli':'RJ','sawai madhopur':'RJ','dausa':'RJ','tonk':'RJ','ajmer':'RJ',
  'nagaur':'RJ','jodhpur':'RJ','jodhpur rural':'RJ','barmer':'RJ','jaisalmer':'RJ',
  'bikaner':'RJ','churu':'RJ','sikar':'RJ','jhunjhunu':'RJ','pali':'RJ',
  'sirohi':'RJ','jalore':'RJ','udaipur':'RJ','dungarpur':'RJ','banswara':'RJ',
  'chittorgarh':'RJ','rajsamand':'RJ','bhilwara':'RJ','bundi':'RJ','baran':'RJ',
  'kota':'RJ','jhalawar':'RJ','hanumangarh':'RJ','ganganagar':'RJ','sri ganganagar':'RJ',
  // HARYANA (22 districts)
  'gurugram':'HR','gurgaon':'HR','faridabad':'HR','sonipat':'HR','panipat':'HR',
  'karnal':'HR','kurukshetra':'HR','kaithal':'HR','ambala':'HR','yamunanagar':'HR',
  'panchkula':'HR','rewari':'HR','mahendragarh':'HR','jhajjar':'HR','rohtak':'HR',
  'bhiwani':'HR','charkhi dadri':'HR','hisar':'HR','fatehabad':'HR','sirsa':'HR',
  'jind':'HR','nuh':'HR',
  // KERALA (14 districts)
  'thiruvananthapuram':'KL','kollam':'KL','pathanamthitta':'KL','alappuzha':'KL',
  'kottayam':'KL','idukki':'KL','ernakulam':'KL','thrissur':'KL','palakkad':'KL',
  'malappuram':'KL','kozhikode':'KL','wayanad':'KL','kannur':'KL','kasaragod':'KL',
  // WEST BENGAL (23 districts)
  'kolkata':'WB','north 24 parganas':'WB','south 24 parganas':'WB','howrah':'WB',
  'hooghly':'WB','nadia':'WB','murshidabad':'WB','birbhum':'WB','burdwan':'WB',
  'purba bardhaman':'WB','paschim bardhaman':'WB','bankura':'WB','purulia':'WB',
  'jhargram':'WB','paschim medinipur':'WB','purba medinipur':'WB','north dinajpur':'WB',
  'south dinajpur':'WB','malda':'WB','jalpaiguri':'WB','darjeeling':'WB',
  'alipurduar':'WB','cooch behar':'WB','kalimpong':'WB',
  // MADHYA PRADESH (55 districts)
  'bhopal':'MP','indore':'MP','gwalior':'MP','jabalpur':'MP','ujjain':'MP',
  'sagar':'MP','rewa':'MP','satna':'MP','morena':'MP','bhind':'MP',
  'guna':'MP','shivpuri':'MP','datia':'MP','ashok nagar':'MP','vidisha':'MP',
  'raisen':'MP','sehore':'MP','dewas':'MP','shajapur':'MP','agar malwa':'MP',
  'mandsaur':'MP','neemuch':'MP','ratlam':'MP','jhabua':'MP','alirajpur':'MP',
  'dhar':'MP','barwani':'MP','khargone':'MP','khandwa':'MP','burhanpur':'MP',
  'harda':'MP','hoshangabad':'MP','narmadapuram':'MP','narsinghpur':'MP',
  'chhindwara':'MP','seoni':'MP','mandla':'MP','dindori':'MP','balaghat':'MP',
  'katni':'MP','umaria':'MP','shahdol':'MP','anuppur':'MP','sidhi':'MP',
  'singrauli':'MP','panna':'MP','chhatarpur':'MP','tikamgarh':'MP','damoh':'MP',
  'niwari':'MP','betul':'MP','rajgarh':'MP',
  // PUNJAB (23 districts)
  'ludhiana':'PB','amritsar':'PB','jalandhar':'PB','patiala':'PB','bathinda':'PB',
  'sangrur':'PB','barnala':'PB','moga':'PB','firozpur':'PB','fazilka':'PB',
  'muktsar':'PB','faridkot':'PB','mansa':'PB','hoshiarpur':'PB','nawanshahr':'PB',
  'shaheed bhagat singh nagar':'PB','ropar':'PB','rupnagar':'PB','sahibzada ajit singh nagar':'PB',
  'mohali':'PB','gurdaspur':'PB','pathankot':'PB','kapurthala':'PB','tarn taran':'PB',
  // BIHAR (38 districts)
  'patna':'BR','gaya':'BR','nalanda':'BR','nawada':'BR','arwal':'BR','jehanabad':'BR',
  'aurangabad':'BR','rohtas':'BR','buxar':'BR','bhojpur':'BR','ara':'BR','saran':'BR',
  'siwan':'BR','gopalganj':'BR','muzaffarpur':'BR','sitamarhi':'BR','sheohar':'BR',
  'madhubani':'BR','darbhanga':'BR','samastipur':'BR','vaishali':'BR','begusarai':'BR',
  'khagaria':'BR','munger':'BR','lakhisarai':'BR','jamui':'BR','sheikhpura':'BR',
  'bhagalpur':'BR','banka':'BR','saharsa':'BR','supaul':'BR','madhepura':'BR',
  'purnia':'BR','araria':'BR','kishanganj':'BR','katihar':'BR','east champaran':'BR',
  'west champaran':'BR',
  // JHARKHAND (24 districts)
  'ranchi':'JH','dhanbad':'JH','bokaro':'JH','giridih':'JH','hazaribagh':'JH',
  'ramgarh':'JH','koderma':'JH','jamshedpur':'JH','east singhbhum':'JH',
  'west singhbhum':'JH','seraikela kharsawan':'JH','deoghar':'JH','dumka':'JH',
  'jamtara':'JH','sahibganj':'JH','pakur':'JH','godda':'JH','palamu':'JH',
  'latehar':'JH','chatra':'JH','garhwa':'JH','gumla':'JH','simdega':'JH',
  'lohardaga':'JH',
  // ODISHA (30 districts)
  'khordha':'OD','bhubaneswar':'OD','cuttack':'OD','puri':'OD','jagatsinghpur':'OD',
  'kendrapara':'OD','jajpur':'OD','bhadrak':'OD','balasore':'OD','mayurbhanj':'OD',
  'keonjhar':'OD','sundargarh':'OD','deogarh':'OD','ambelpur':'OD','jharsuguda':'OD',
  'bargarh':'OD','bolangir':'OD','nuapada':'OD','kalahandi':'OD','rayagada':'OD',
  'koraput':'OD','nabarangpur':'OD','malkangiri':'OD','gajapati':'OD','ganjam':'OD',
  'kandhamal':'OD','angul':'OD','dhenkanal':'OD','boudh':'OD','sonepur':'OD',
  // ASSAM (35 districts)
  'kamrup metropolitan':'AS','kamrup':'AS','nagaon':'AS','morigaon':'AS','sonitpur':'AS',
  'biswanath':'AS','darrang':'AS','udalguri':'AS','lakhimpur':'AS','dhemaji':'AS',
  'majuli':'AS','jorhat':'AS','golaghat':'AS','sibsagar':'AS','sivasagar':'AS',
  'charaideo':'AS','dibrugarh':'AS','tinsukia':'AS','bongaigaon':'AS','chirang':'AS',
  'barpeta':'AS','nalbari':'AS','baksa':'AS','tamulpur':'AS','dhubri':'AS',
  'south salmara mankachar':'AS','kokrajhar':'AS','cachar':'AS','hailakandi':'AS',
  'karimganj':'AS','dima hasao':'AS','karbi anglong':'AS','west karbi anglong':'AS',
  'hojai':'AS','goalpara':'AS',
  // HIMACHAL PRADESH (12 districts)
  'shimla':'HP','solan':'HP','sirmaur':'HP','mandi':'HP','kullu':'HP','hamirpur':'HP',
  'una':'HP','kangra':'HP','chamba':'HP','bilaspur':'HP','kinnaur':'HP','lahaul and spiti':'HP',
  // UTTARAKHAND (13 districts)
  'dehradun':'UK','haridwar':'UK','pauri garhwal':'UK','tehri garhwal':'UK',
  'uttarkashi':'UK','rudraprayag':'UK','chamoli':'UK','pithoragarh':'UK',
  'bageshwar':'UK','almora':'UK','champawat':'UK','nainital':'UK','udham singh nagar':'UK',
  // GOA (2 districts)
  'north goa':'GA','south goa':'GA',
  // CHANDIGARH
  'chandigarh district':'CH',
};

Object.assign(STATE_MAP, DISTRICT_MAP);

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
