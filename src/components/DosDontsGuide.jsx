import { useState } from 'react';
import './DosDontsGuide.css';

export default function DosDontsGuide({ onClose }) {
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const steps = [
    { id: 'c1', text: 'Confirm Circle Rate / Guideline Value for the exact survey number/zone from Kaveri/IGR portal.' },
    { id: 'c2', text: 'Ensure the Stamp Paper date is within 6 months of the execution date (Sec. 54 of ISA).' },
    { id: 'c3', text: 'Validate gender concession eligibility — ensure the primary buyer/donee is sole female if claiming lower rate.' },
    { id: 'c4', text: 'Check if there are any additional municipal, metro rail, or infrastructure cesses applicable in your municipal zone.' },
    { id: 'c5', text: 'Check that two independent witnesses with valid government IDs are present and signed on each page.' },
    { id: 'c6', text: 'Verify that the signature of all executants is on each page of the deed, including all schedules and maps.' },
    { id: 'c7', text: 'Ensure there are zero handwritten corrections, strikes, or overwrites on e-stamp certificate papers.' },
  ];

  return (
    <div className="subpage-container">
      <div className="subpage-header">
        <div className="sh-title">
          <span className="sh-icon">⚖️</span>
          <div>
            <h1>Stamp Duty Legal Guide & Checklist</h1>
            <p>Critical legislative compliances, check lists, and under-stamping penalties under Indian Stamp Act 1899</p>
          </div>
        </div>
        <button className="subpage-close" onClick={onClose}>✕ Close Toolkit</button>
      </div>

      <div className="guide-grid">
        <div className="card guide-card red-warning-card">
          <div className="gcard-header">
            <span className="gcard-icon">⚠️</span>
            <h2>Deficient Duty & Section 35 Penalties</h2>
          </div>
          <div className="gcard-body">
            <p><strong>Section 35 of the Indian Stamp Act, 1899</strong> stipulates that any instrument that is not "duly stamped" is inadmissible in evidence for any purpose, including civil disputes and registration.</p>
            
            <div className="penalty-box">
              <div className="p-hdr">🔴 MAXIMUM STATUTORY PENALTY</div>
              <div className="p-amt">10x Deficit</div>
              <p className="p-sub">In addition to paying the original deficient duty amount, the court or collector will impose a penalty up to ten times the deficit to validate the document.</p>
            </div>

            <ul className="legal-notes-list">
              <li><strong>Impounding:</strong> Any public officer (including judges and sub-registrars) is legally bound to impound an under-stamped document immediately upon presentation.</li>
              <li><strong>Criminal Liability:</strong> Section 64 of the ISA makes execution of under-stamped deeds with intent to defraud the government a punishable offence with fines.</li>
            </ul>
          </div>
        </div>

        <div className="card guide-card">
          <div className="gcard-header">
            <span className="gcard-icon">✅</span>
            <h2>Interactive Deed Execution Checklist</h2>
          </div>
          <div className="gcard-body">
            <p className="checklist-intro">Before heading to the Sub-Registrar\'s office, verify each of these statutory execution checks:</p>
            <div className="checklist-container">
              {steps.map(step => (
                <div 
                  key={step.id} 
                  className={`checklist-item ${checkedItems[step.id] ? 'checked' : ''}`}
                  onClick={() => toggleCheck(step.id)}
                >
                  <div className="checkbox-tick">
                    {checkedItems[step.id] && '✓'}
                  </div>
                  <span className="checklist-text">{step.text}</span>
                </div>
              ))}
            </div>
            <div className="checklist-progress">
              Completed: {Object.values(checkedItems).filter(Boolean).length} of {steps.length} Checks
            </div>
          </div>
        </div>
      </div>

      <div className="dos-donts-section">
        <div className="card guide-card do-card">
          <div className="gcard-header">
            <span className="gcard-icon">🔵</span>
            <h2>The Dos (Legally Advised)</h2>
          </div>
          <div className="gcard-body">
            <ul className="guide-bullets">
              <li><strong>DO</strong> verify e-stamp certificate numbers online using the Kaveri, Stock Holding Corporation (SHCIL), or respective IGR portals.</li>
              <li><strong>DO</strong> execute (sign) the agreement immediately after buying stamp papers. Legally, the stamp paper must precede the execution.</li>
              <li><strong>DO</strong> declare the true market value of the property. Under-valuation leads to immediate circle-rate mismatch flags and registrar queries.</li>
              <li><strong>DO</strong> buy stamps only from authorized e-stamp vendors, SHCIL branches, or commercial banks. Never buy from third-party unregistered dealers.</li>
            </ul>
          </div>
        </div>

        <div className="card guide-card dont-card">
          <div className="gcard-header">
            <span className="gcard-icon">❌</span>
            <h2>The Don\'ts (Severe Risks)</h2>
          </div>
          <div className="gcard-body">
            <ul className="guide-bullets">
              <li><strong>DON\'T</strong> split a single transaction into multiple smaller deeds to artificially avoid higher slab stamp duties (considered tax evasion).</li>
              <li><strong>DON\'T</strong> execute agreements on outdated stamps (older than 6 months). Such stamps lose validity for refund and execution.</li>
              <li><strong>DON\'T</strong> make physical alterations, liquid corrections, or handwritten text over a printed e-stamp certificate. It immediately invalidates the certificate.</li>
              <li><strong>DON\'T</strong> execute sale agreements with possession on a simple nominal stamp paper. Full conveyance duty applies once possession passes.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
