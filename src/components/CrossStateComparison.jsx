import { useState } from 'react';
import { STATES } from '../data/states';
import { runCalculation } from '../utils/calcEngine';
import './CrossStateComparison.css';

export default function CrossStateComparison({ selectedCat, inputs, onClose }) {
  const [sortBy, setSortBy] = useState('total'); // 'state', 'stamp', 'reg', 'total'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

  const results = Object.entries(STATES).map(([code, state]) => {
    let calc = null;
    try {
      calc = runCalculation(code, selectedCat, inputs);
    } catch {
      // Ignore calculation errors for specific states if inputs are missing/incompatible
    }
    return {
      code,
      name: state.name,
      calc,
    };
  }).filter(item => item.calc !== null);

  const sortedResults = [...results].sort((a, b) => {
    let valA, valB;
    if (sortBy === 'state') {
      valA = a.name;
      valB = b.name;
    } else if (sortBy === 'stamp') {
      // Find stamp duty in lines
      const lineA = a.calc.lines.find(l => l.n.toLowerCase().includes('stamp duty') || l.n.toLowerCase().includes('conveyance'));
      const lineB = b.calc.lines.find(l => l.n.toLowerCase().includes('stamp duty') || l.n.toLowerCase().includes('conveyance'));
      valA = lineA ? lineA.v : 0;
      valB = lineB ? lineB.v : 0;
    } else if (sortBy === 'reg') {
      const lineA = a.calc.lines.find(l => l.n.toLowerCase().includes('registration fee') || l.n.toLowerCase().includes('reg.'));
      const lineB = b.calc.lines.find(l => l.n.toLowerCase().includes('registration fee') || l.n.toLowerCase().includes('reg.'));
      valA = lineA ? lineA.v : 0;
      valB = lineB ? lineB.v : 0;
    } else {
      valA = a.calc.total;
      valB = b.calc.total;
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const fmt = (num) => '₹' + Math.round(num).toLocaleString('en-IN');

  const minTotal = Math.min(...results.map(r => r.calc.total));
  const maxTotal = Math.max(...results.map(r => r.calc.total));

  return (
    <div className="subpage-container">
      <div className="subpage-header">
        <div className="sh-title">
          <span className="sh-icon">📊</span>
          <div>
            <h1>Cross-State Comparison Matrix</h1>
            <p>Real-time stamp duty comparison across all Indian States & UTs for <strong>{selectedCat.replace(/_/g, ' ').toUpperCase()}</strong></p>
          </div>
        </div>
        <button className="subpage-close" onClick={onClose}>✕ Close Toolkit</button>
      </div>

      <div className="card matrix-card">
        <div className="matrix-meta-grid">
          <div className="mm-item green-glow">
            <span className="mm-lbl">Lowest Payable State</span>
            <div className="mm-val">
              {results.find(r => r.calc.total === minTotal)?.name || '—'}
              <span className="mm-sub">{fmt(minTotal)}</span>
            </div>
          </div>
          <div className="mm-item red-glow">
            <span className="mm-lbl">Highest Payable State</span>
            <div className="mm-val">
              {results.find(r => r.calc.total === maxTotal)?.name || '—'}
              <span className="mm-sub">{fmt(maxTotal)}</span>
            </div>
          </div>
          <div className="mm-item purple-glow">
            <span className="mm-lbl">Average Duty Across India</span>
            <div className="mm-val">
              {fmt(results.reduce((acc, r) => acc + r.calc.total, 0) / results.length)}
              <span className="mm-sub">Based on {results.length} states</span>
            </div>
          </div>
        </div>

        <div className="table-wrap comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('state')} className="sortable">
                  State / UT {sortBy === 'state' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th>Base Value</th>
                <th onClick={() => handleSort('stamp')} className="sortable">
                  Stamp Duty {sortBy === 'stamp' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('reg')} className="sortable">
                  Reg. Fee {sortBy === 'reg' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('total')} className="sortable">
                  Total Payable {sortBy === 'total' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th>Special Concessions & Legal Notes</th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((item) => {
                const isMin = item.calc.total === minTotal;
                const isMax = item.calc.total === maxTotal;
                const stampLine = item.calc.lines.find(l => l.n.toLowerCase().includes('stamp duty') || l.n.toLowerCase().includes('conveyance'));
                const regLine = item.calc.lines.find(l => l.n.toLowerCase().includes('registration fee') || l.n.toLowerCase().includes('reg.'));
                const stampVal = stampLine ? stampLine.v : 0;
                const regVal = regLine ? regLine.v : 0;

                return (
                  <tr key={item.code} className={`${isMin ? 'min-row' : ''} ${isMax ? 'max-row' : ''}`}>
                    <td className="st-name-td">
                      {item.name}
                      {isMin && <span className="badge-pill badge-green">Lowest</span>}
                      {isMax && <span className="badge-pill badge-red">Highest</span>}
                    </td>
                    <td>{fmt(item.calc.baseValue)}</td>
                    <td className="bold">{fmt(stampVal)}</td>
                    <td>{fmt(regVal)}</td>
                    <td className="bold total-td">{fmt(item.calc.total)}</td>
                    <td className="notes-td">
                      <span className="state-act-meta">{STATES[item.code].act}</span>
                      <p>{STATES[item.code].notes}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
