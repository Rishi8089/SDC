import { useState } from 'react';
import './DosDontsGuide.css';

export default function DosDontsGuide({ selectedState, selectedCat, inputs, result, onClose }) {
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const steps = [
    { id: 'c1', text: 'Confirm Circle Rate / Guideline Value for the exact survey number/zone from official state portals.' },
    { id: 'c2', text: 'Ensure the Stamp Paper purchase date is within 6 months of the execution date (Sec. 54 of ISA).' },
    { id: 'c3', text: 'Validate gender concession eligibility — ensure the primary buyer/donee is sole female if claiming lower rate.' },
    { id: 'c4', text: 'Check if there are any additional municipal, metro rail, or infrastructure cesses applicable in your zone.' },
    { id: 'c5', text: 'Check that two independent witnesses with valid government IDs are present and signed on each page.' },
    { id: 'c6', text: 'Verify that the signature of all executants is on each page of the deed, including all schedules.' },
    { id: 'c7', text: 'Ensure there are zero handwritten corrections, strikes, or overwrites on e-stamp certificate papers.' },
  ];

  const formatCurrency = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return '₹0';
    return '₹' + Math.round(num).toLocaleString('en-IN');
  };

  // 1. Dynamic Section 35 10x Penalty Calculation
  const hasCalculatedDuty = result && result.total > 0;
  const originalDuty = hasCalculatedDuty ? result.total : 1000;
  const maxPenalty = originalDuty * 10;

  // 2. Dynamic Under-Valuation Warning (Circle vs declared Market Value)
  const showValuationWarning = inputs && inputs.circle && inputs.pval && parseFloat(inputs.pval) < parseFloat(inputs.circle);

  // 3. Dynamic Lease Duration Warnings
  const isLease = selectedCat === 'lease';
  const leasePeriod = inputs ? parseInt(inputs.leaseMonths) || 0 : 0;
  const isLeaseShortTerm = isLease && inputs.leasePeriodType === 'months' && leasePeriod <= 11;
  const isLeaseLongTerm = isLease && ((inputs.leasePeriodType === 'months' && leasePeriod > 11) || inputs.leasePeriodType === 'years');

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

      {/* DYNAMIC CONTEXTUAL WARNINGS SECTION */}
      <div className="dos-donts-section" style={{ gridTemplateColumns: '1fr', marginBottom: '24px' }}>
        <div className="card guide-card" style={{ border: '1px solid rgba(255, 153, 51, 0.25)', background: 'rgba(255, 153, 51, 0.04)' }}>
          <div className="gcard-header">
            <span className="gcard-icon">⚡</span>
            <h2>Contextual Statutory Alerts (Active State Rules)</h2>
          </div>
          <div className="gcard-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* Warning A: Under-Valuation Circle Rate Trigger */}
            {showValuationWarning ? (
              <div style={{ display: 'flex', gap: '10px', background: 'rgba(192, 57, 43, 0.1)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid var(--rd)' }}>
                <span style={{ fontSize: '18px' }}>⚠️</span>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>Under-Valuation Flag Triggered (Section 47-A)</h4>
                  <p style={{ fontSize: '12px', color: 'var(--tx3)', marginTop: '2px', lineHeight: '1.5' }}>
                    Your declared transaction value ({formatCurrency(inputs.pval)}) is lower than the official Government Circle guideline rate ({formatCurrency(inputs.circle)}). 
                    Under Section 47-A, the Sub-Registrar will refuse standard registration, refer the case to the District Collector for market valuation assessment, and ad-valorem stamp duty will still be assessed at the higher circle rate value of <strong>{formatCurrency(inputs.circle)}</strong>.
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px', background: 'rgba(19, 136, 8, 0.08)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid var(--gi)' }}>
                <span style={{ fontSize: '18px' }}>✅</span>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>Assessment Valuation Rules (FY 2026-27 Compliant)</h4>
                  <p style={{ fontSize: '12px', color: 'var(--tx3)', marginTop: '2px', lineHeight: '1.5' }}>
                    Declaring purchase value equal to or higher than the circle guideline rate ensures seamless sub-registrar registration checks and prevents Section 47-A valuation disputes.
                  </p>
                </div>
              </div>
            )}

            {/* Warning B: Lease Duration/Registration */}
            {isLeaseShortTerm && (
              <div style={{ display: 'flex', gap: '10px', background: 'rgba(19, 136, 8, 0.08)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid var(--gi)' }}>
                <span style={{ fontSize: '18px' }}>💡</span>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>Registration Exemption (11 Months Lease)</h4>
                  <p style={{ fontSize: '12px', color: 'var(--tx3)', marginTop: '2px', lineHeight: '1.5' }}>
                    Since the active period is <strong>{leasePeriod} months</strong> (≤ 11 months), this Leave and Licence Agreement is NOT compulsorily registrable under Section 17 of the Registration Act 1908. A flat stamp duty of ₹500 is typical in Bihar, and concession caps apply in Karnataka.
                  </p>
                </div>
              </div>
            )}
            {isLeaseLongTerm && (
              <div style={{ display: 'flex', gap: '10px', background: 'rgba(192, 57, 43, 0.1)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid var(--rd)' }}>
                <span style={{ fontSize: '18px' }}>⚠️</span>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>Compulsory Registration Alert (Lease &gt; 11 Months)</h4>
                  <p style={{ fontSize: '12px', color: 'var(--tx3)', marginTop: '2px', lineHeight: '1.5' }}>
                    Since the active period is <strong>{leasePeriod} {inputs.leasePeriodType}</strong> (exceeding 11 months), this Lease Deed MUST be compulsorily registered under Section 17 of the Registration Act 1908 at the local Sub-Registrar office. An unregistered long-term lease deed is legally invalid and inadmissible as evidence in court!
                  </p>
                </div>
              </div>
            )}

            {/* Warning C: State Specific concession check */}
            {selectedState === 'KA' && (
              <div style={{ display: 'flex', gap: '10px', background: 'rgba(105, 48, 195, 0.08)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid var(--pu)' }}>
                <span style={{ fontSize: '18px' }}>💡</span>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>Karnataka (KA) Legislative Notes</h4>
                  <p style={{ fontSize: '12px', color: 'var(--tx3)', marginTop: '2px', lineHeight: '1.5' }}>
                    Under Article 33, women buying properties in rural panchayats or urban municipal zones below ₹20L or ₹30L are eligible for concessional rates (3% instead of 5%). Ensure the buyer is a sole female executant to leverage this concession.
                  </p>
                </div>
              </div>
            )}
            {selectedState === 'BR' && (
              <div style={{ display: 'flex', gap: '10px', background: 'rgba(105, 48, 195, 0.08)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid var(--pu)' }}>
                <span style={{ fontSize: '18px' }}>💡</span>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>Bihar (BR) Industrial & Lease Caps</h4>
                  <p style={{ fontSize: '12px', color: 'var(--tx3)', marginTop: '2px', lineHeight: '1.5' }}>
                    Bihar lease agreements ≤11 months are capped at a flat ₹500 ad-valorem stamp duty with flat ₹1,000 registration fees. Industrial land lease transfers also qualify for specific state cesses waivers.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <div className="guide-grid">
        <div className="card guide-card red-warning-card">
          <div className="gcard-header">
            <span className="gcard-icon">⚠️</span>
            <h2>Deficient Duty & Section 35 Penalties</h2>
          </div>
          <div className="gcard-body">
            <p style={{ lineHeight: '1.5' }}><strong>Section 35 of the Indian Stamp Act, 1899</strong> stipulates that any instrument that is not "duly stamped" is inadmissible in evidence for any purpose, including civil disputes and registration.</p>
            
            <div className="penalty-box" style={{ padding: '24px 20px', borderRadius: '12px', textAlign: 'center', background: 'rgba(192, 57, 43, 0.1)', border: '1px solid rgba(192, 57, 43, 0.25)', margin: '16px 0' }}>
              <div className="p-hdr" style={{ fontSize: '11px', color: 'var(--rd)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>🔴 MAXIMUM STATUTORY COURT PENALTY</div>
              <div className="p-amt" style={{ fontSize: '32px', color: '#fff', fontWeight: '800', margin: '6px 0' }}>{formatCurrency(maxPenalty)}</div>
              <p className="p-sub" style={{ fontSize: '11.5px', color: 'var(--tx3)', lineHeight: '1.4' }}>
                In addition to paying the original deficient duty amount, the court or collector will impose a penalty of <strong>up to ten times the deficit ({formatCurrency(maxPenalty)})</strong> to validate the document as admissible evidence.
              </p>
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
            <p className="checklist-intro">Before heading to the Sub-Registrar's office, verify each of these statutory execution checks:</p>
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

      <div className="dos-donts-section" style={{ marginTop: '24px' }}>
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
            <h2>The Don'ts (Severe Risks)</h2>
          </div>
          <div className="gcard-body">
            <ul className="guide-bullets">
              <li><strong>DON'T</strong> split a single transaction into multiple smaller deeds to artificially avoid higher slab stamp duties (considered tax evasion).</li>
              <li><strong>DON'T</strong> execute agreements on outdated stamps (older than 6 months). Such stamps lose validity for refund and execution.</li>
              <li><strong>DON'T</strong> make physical alterations, liquid corrections, or handwritten text over a printed e-stamp certificate. It immediately invalidates the certificate.</li>
              <li><strong>DON'T</strong> execute sale agreements with possession on a simple nominal stamp paper. Full conveyance duty applies once possession passes.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
