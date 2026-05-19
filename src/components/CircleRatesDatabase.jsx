import { useState } from 'react';
import { STATES } from '../data/states';
import './CircleRatesDatabase.css';

// Average Guideline/Circle Rate bands database for 14 major states
const CITY_RATE_BANDS = {
  MH: [
    { city: 'Mumbai', range: '₹8,500 - ₹38,000 / sq.ft', zone: 'Premium / Coastal/ Suburbs' },
    { city: 'Pune', range: '₹4,500 - ₹14,000 / sq.ft', zone: 'Kothrud / Hinjewadi / Baner' },
    { city: 'Thane', range: '₹6,000 - ₹18,000 / sq.ft', zone: 'Ghodbunder / Majiwada' }
  ],
  KA: [
    { city: 'Bengaluru', range: '₹3,500 - ₹24,000 / sq.ft', zone: 'Indiranagar / Jayanagar / Whitefield' },
    { city: 'Mysuru', range: '₹2,000 - ₹6,500 / sq.ft', zone: 'Gokulam / Vijayanagar' },
    { city: 'Mangaluru', range: '₹2,500 - ₹7,000 / sq.ft', zone: 'Kadri / Bejai' }
  ],
  UP: [
    { city: 'Noida / Greater Noida', range: '₹5,500 - ₹16,500 / sq.ft', zone: 'Sector 50, 62, 150 / Expressway' },
    { city: 'Lucknow', range: '₹2,500 - ₹8,500 / sq.ft', zone: 'Hazratganj / Gomti Nagar' },
    { city: 'Ghaziabad', range: '₹3,000 - ₹9,000 / sq.ft', zone: 'Indirapuram / Raj Nagar Ext' }
  ],
  DL: [
    { city: 'Delhi Category A', range: '₹7,74,000 / sq.meter', zone: 'Golf Links / Vasant Vihar / Jor Bagh' },
    { city: 'Delhi Category B', range: '₹2,45,000 / sq.meter', zone: 'Defence Colony / Greater Kailash' },
    { city: 'Delhi Category H', range: '₹22,000 / sq.meter', zone: 'Unauthorized colonies / LIG tiers' }
  ],
  TN: [
    { city: 'Chennai', range: '₹4,500 - ₹22,000 / sq.ft', zone: 'Adyar / Mylapore / OMR Corridor' },
    { city: 'Coimbatore', range: '₹2,500 - ₹9,000 / sq.ft', zone: 'R.S. Puram / Gandhipuram' },
    { city: 'Madurai', range: '₹1,800 - ₹5,500 / sq.ft', zone: 'Anna Nagar / K.Pudur' }
  ],
  TS: [
    { city: 'Hyderabad', range: '₹3,800 - ₹20,000 / sq.ft', zone: 'Gachibowli / Jubilee Hills / Madhapur' },
    { city: 'Warangal', range: '₹1,500 - ₹4,500 / sq.ft', zone: 'Hanamkonda / Kazipet' }
  ],
  GJ: [
    { city: 'Ahmedabad', range: '₹3,200 - ₹13,500 / sq.ft', zone: 'Bodakdev / Satellite / SG Highway' },
    { city: 'Surat', range: '₹2,600 - ₹9,500 / sq.ft', zone: 'Adajan / Vesu / Piplod' },
    { city: 'Vadodara', range: '₹2,000 - ₹6,500 / sq.ft', zone: 'Alkapuri / Gotri' }
  ],
  WB: [
    { city: 'Kolkata', range: '₹3,800 - ₹16,000 / sq.ft', zone: 'Salt Lake / Alipore / Ballygunge' },
    { city: 'Howrah', range: '₹2,200 - ₹6,000 / sq.ft', zone: 'Shalimar / Liluah' }
  ],
  HR: [
    { city: 'Gurugram', range: '₹6,500 - ₹28,000 / sq.ft', zone: 'DLF Phase 1-5 / Golf Course Road' },
    { city: 'Faridabad', range: '₹3,500 - ₹9,500 / sq.ft', zone: 'Sector 15, 21 / Neharpar' }
  ],
  PB: [
    { city: 'Ludhiana', range: '₹2,200 - ₹7,500 / sq.ft', zone: 'Sarabha Nagar / Model Town' },
    { city: 'Amritsar', range: '₹1,800 - ₹6,000 / sq.ft', zone: 'Ranjit Avenue / Mall Road' }
  ],
  BR: [
    { city: 'Patna', range: '₹3,500 - ₹12,000 / sq.ft', zone: 'Bailey Road / Boring Road / Kankarbagh' },
    { city: 'Muzaffarpur', range: '₹1,500 - ₹4,500 / sq.ft', zone: 'Mithanpura / Kalambagh Road' }
  ],
  RJ: [
    { city: 'Jaipur', range: '₹2,600 - ₹10,000 / sq.ft', zone: 'C-Scheme / Malviya Nagar / Mansarovar' },
    { city: 'Jodhpur', range: '₹1,800 - ₹5,500 / sq.ft', zone: 'Shastri Nagar / Sardarpura' }
  ],
  KL: [
    { city: 'Kochi / Ernakulam', range: '₹4,000 - ₹14,000 / sq.ft', zone: 'Edappally / Kakkanad / Marine Drive' },
    { city: 'Thiruvananthapuram', range: '₹3,000 - ₹9,500 / sq.ft', zone: 'Kowdiar / Pattom' }
  ],
  MP: [
    { city: 'Indore', range: '₹3,200 - ₹11,000 / sq.ft', zone: 'Vijay Nagar / Palasia / Super Corridor' },
    { city: 'Bhopal', range: '₹2,200 - ₹7,500 / sq.ft', zone: 'Arera Colony / Kolar Road' }
  ]
};

export default function CircleRatesDatabase({ onClose }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStates = Object.entries(STATES).filter(([code, s]) => {
    return s.name.toLowerCase().includes(searchQuery.toLowerCase()) || code.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="subpage-container">
      <div className="subpage-header">
        <div className="sh-title">
          <span className="sh-icon">🗺️</span>
          <div>
            <h1>Circle Rates & Official IGR Portals</h1>
            <p>Direct state-wise government portals, Kaveri/NGDRS links, and guideline value calculators</p>
          </div>
        </div>
        <button className="subpage-close" onClick={onClose}>✕ Close Toolkit</button>
      </div>

      <div className="card valuation-card">
        <div className="gcard-header">
          <span className="gcard-icon">📖</span>
          <h2>Valuation Guide — Circle Rate vs. Market Value</h2>
        </div>
        <div className="valuation-rules-grid">
          <div className="vr-item">
            <span className="vr-num">01</span>
            <h3>The Higher Value Rule</h3>
            <p>Under Section 47-A of the Indian Stamp Act, stamp duty is always calculated on the <strong>higher</strong> of the declared consideration (market value) in the agreement or the government circle rate (guideline value).</p>
          </div>
          <div className="vr-item">
            <span className="vr-num">02</span>
            <h3>How to Find Rates</h3>
            <p>Circle rates depend on property factors: Zone/Ward, Road Width, Structure Type (RCC, load-bearing), Floor Level, and Amenities. You can check the official portal for your local municipal corporation or Sub-Registrar ward.</p>
          </div>
          <div className="vr-item">
            <span className="vr-num">03</span>
            <h3>Kaveri & NGDRS</h3>
            <p>States like Karnataka (Kaveri 2.0) and Punjab/Goa/HP/Jharkhand (NGDRS - National Generic Document Registration System) offer automated valuation calculators where you input survey numbers to get instant guideline values.</p>
          </div>
        </div>
      </div>

      <div className="search-bar-wrap">
        <input 
          type="text" 
          placeholder="🔍 Search state or UT..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="state-search-input"
        />
      </div>

      <div className="states-grid">
        {filteredStates.map(([code, s]) => {
          const bands = CITY_RATE_BANDS[code];
          return (
            <div key={code} className="card state-portal-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="spc-hdr">
                  <span className="spc-badge">{code}</span>
                  <h3>{s.name}</h3>
                </div>
                <p className="spc-act">{s.act}</p>

                {/* City Rate Bands Table if available */}
                {bands && (
                  <div className="rate-bands-section" style={{ marginTop: '14px', marginBottom: '14px' }}>
                    <h4 style={{ fontSize: '11px', color: 'var(--sf)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>Average Guideline Value Bands</h4>
                    <table style={{ width: '100%', fontSize: '11.5px', borderCollapse: 'collapse', background: 'rgba(0,0,0,0.15)', borderRadius: '4px', overflow: 'hidden' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                          <th style={{ padding: '6px 8px', color: 'var(--tx3)' }}>City</th>
                          <th style={{ padding: '6px 8px', color: 'var(--tx3)' }}>Avg Rate Band</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bands.map((b, idx) => (
                          <tr key={idx} style={{ borderBottom: idx === bands.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: '6px 8px', fontWeight: '600' }}>
                              {b.city}<br />
                              <span style={{ fontSize: '9.5px', color: 'var(--tx3)', fontWeight: 'normal' }}>{b.zone}</span>
                            </td>
                            <td style={{ padding: '6px 8px', color: '#fff', fontWeight: 'bold' }}>{b.range}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="spc-links-list" style={{ marginTop: 'auto' }}>
                {s.acts && s.acts.map((act, i) => (
                  <a 
                    key={i} 
                    href={act.u} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="spc-link-btn"
                  >
                    <span>🔗 {act.l}</span>
                    <span className="spc-arrow">→</span>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
        {filteredStates.length === 0 && (
          <div className="empty-search-state">
            No matching States or UTs found.
          </div>
        )}
      </div>
    </div>
  );
}
