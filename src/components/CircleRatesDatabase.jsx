import { useState } from 'react';
import { STATES } from '../data/states';
import './CircleRatesDatabase.css';

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
          return (
            <div key={code} className="card state-portal-card">
              <div className="spc-hdr">
                <span className="spc-badge">{code}</span>
                <h3>{s.name}</h3>
              </div>
              <p className="spc-act">{s.act}</p>
              <div className="spc-links-list">
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
