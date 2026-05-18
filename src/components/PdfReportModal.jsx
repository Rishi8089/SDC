import { useState } from 'react';
import './PdfReportModal.css';

export default function PdfReportModal({ result, selectedState, selectedCat, inputs, onClose }) {
  const [reportType, setReportType] = useState('typeB'); // 'typeA' (Standard), 'typeB' (Audit Certificate)
  const [refId] = useState(() => 'SC-' + Math.floor(100000 + Math.random() * 900000));
  const [auditRef] = useState(() => 'AUDIT-' + Math.floor(10000000 + Math.random() * 90000000));

  if (!result) return null;

  const fmt = (num) => '₹' + Math.round(num).toLocaleString('en-IN');
  const date = new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pdf-modal-overlay">
      <div className="pdf-modal-container no-print">
        <div className="pdf-modal-header">
          <h2>📄 Generate Official Calculation Report</h2>
          <button className="pdf-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="pdf-modal-controls">
          <div className="report-selector-grid">
            <div 
              className={`report-opt ${reportType === 'typeA' ? 'active' : ''}`}
              onClick={() => setReportType('typeA')}
            >
              <h3>Type A — Standard Breakdown</h3>
              <p>Basic itemized tax breakdown of stamp duty and registration fees for quick reference.</p>
            </div>
            <div 
              className={`report-opt ${reportType === 'typeB' ? 'active' : ''}`}
              onClick={() => setReportType('typeB')}
            >
              <h3>Type B — Certificate of Stamp Audit</h3>
              <p>High-authority formal audit layout containing governing legal sections, statutory warnings, and signature blocks.</p>
            </div>
          </div>
          
          <button className="print-trigger-btn" onClick={handlePrint}>
            🖨️ Print or Save as PDF
          </button>
        </div>
      </div>

      {/* The Printable Area */}
      <div className="printable-report-card">
        {reportType === 'typeA' ? (
          <div className="report-content typeA-layout">
            <div className="rep-watermark">ESTIMATE ONLY</div>
            <div className="rep-header">
              <h1>STAMP DUTY COMPUTATION REPORT</h1>
              <p className="rep-subtitle">STAMPCALC INDIA • TAXATION & REGISTRATION AUDIT</p>
            </div>

            <div className="rep-meta-section">
              <div className="rep-meta-grid">
                <div><strong>State / UT:</strong> {result.state?.name || selectedState}</div>
                <div><strong>Instrument Category:</strong> {selectedCat.replace(/_/g, ' ').toUpperCase()}</div>
                <div><strong>Calculation Date:</strong> {date}</div>
                <div><strong>Reference ID:</strong> {refId}</div>
              </div>
            </div>

            <div className="rep-valuation-box">
              <div className="vbox-title">ASSESSMENT VALUATION PARAMETERS</div>
              <table className="vbox-table">
                <tbody>
                  <tr><td>Assessment Base Value:</td><td className="right bold">{fmt(result.baseValue)}</td></tr>
                  {inputs.circle && <tr><td>Government Circle Guideline Rate:</td><td className="right">{fmt(inputs.circle)}</td></tr>}
                  {inputs.pval && <tr><td>Declared Transaction Value:</td><td className="right">{fmt(inputs.pval)}</td></tr>}
                </tbody>
              </table>
            </div>

            <div className="rep-breakdown-box">
              <div className="bbox-title">DETAILED STAMP DUTY & REGISTRY BREAKDOWN</div>
              <table className="bbox-table">
                <thead>
                  <tr><th>Charge Particulars</th><th>Assessed Calculation Rate</th><th className="right">Amount (INR)</th></tr>
                </thead>
                <tbody>
                  {result.lines.map((l, i) => (
                    <tr key={i}>
                      <td>
                        <strong>{l.n}</strong>
                        {l.note && <span className="l-note-span"> — {l.note}</span>}
                      </td>
                      <td>{l.r}</td>
                      <td className="right bold">{fmt(l.v)}</td>
                    </tr>
                  ))}
                  <tr className="grand-total-row">
                    <td colSpan="2">TOTAL NET STATUTORY PAYABLE</td>
                    <td className="right grand-total-val">{fmt(result.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rep-footer-disclaimer">
              <p><strong>Disclaimer:</strong> This is a dynamic estimate based on prevailing state stamp acts as of April 2026. The accuracy depends wholly on correct verification of property circle rates and sub-ward codes. This is not a legal receipt or stamp certificate.</p>
            </div>
          </div>
        ) : (
          <div className="report-content typeB-layout font-times">
            <div className="rep-header-border">
              <div className="rep-header-center">
                <h2>CERTIFICATE OF STAMP AUDIT</h2>
                <p className="cert-subtitle">ISSUED UNDER PREVAILING REVENUE AND STATUTORY STAMP LAWS OF INDIA</p>
                <div className="cert-ref-bar">
                  <span>REF NO: {auditRef}</span>
                  <span>DATE: {date.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="cert-body-intro">
              <p>This is to certify and declare that a high-precision computer audit has been conducted on the proposed transaction parameters details here below, in accordance with the <strong>Indian Stamp Act, 1899</strong>, the <strong>Registration Act, 1908</strong>, and the respective State Stamp Duties legislation.</p>
            </div>

            <table className="cert-meta-table">
              <tbody>
                <tr>
                  <td><strong>Governing Jurisdiction:</strong></td><td>{result.state?.name || selectedState}</td>
                  <td><strong>Primary Instrument:</strong></td><td>{selectedCat.replace(/_/g, ' ').toUpperCase()}</td>
                </tr>
                <tr>
                  <td><strong>State Regulation:</strong></td><td>{result.state?.act || 'Indian Stamp Act 1899'}</td>
                  <td><strong>Property / Asset Type:</strong></td><td>{inputs.ptype ? inputs.ptype.toUpperCase() : 'RESIDENTIAL'}</td>
                </tr>
                <tr>
                  <td><strong>Assessed Base Value:</strong></td><td className="bold text-gold">{fmt(result.baseValue)}</td>
                  <td><strong>Gender Code Claimed:</strong></td><td>{inputs.gender ? inputs.gender.toUpperCase() : 'MALE'}</td>
                </tr>
              </tbody>
            </table>

            <div className="cert-audit-breakdown">
              <h3>AUDIT STAMP & FEE CHARGE CALCULATIONS</h3>
              <table className="cert-breakdown-table">
                <thead>
                  <tr>
                    <th>Charge Clause Reference</th>
                    <th>Rate Applied</th>
                    <th className="right">Assessed Duty (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {result.lines.map((l, i) => (
                    <tr key={i}>
                      <td>
                        <strong>{l.n}</strong>
                        {l.note && <p className="cert-line-desc">{l.note}</p>}
                      </td>
                      <td>{l.r}</td>
                      <td className="right bold">{fmt(l.v)}</td>
                    </tr>
                  ))}
                  <tr className="cert-total-row">
                    <td colSpan="2">TOTAL LIQUID STATUTORY DEPOSIT DUE</td>
                    <td className="right cert-total-val">{fmt(result.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="cert-statutory-warnings">
              <h4>CRITICAL STATUTORY COMPLIANCE & UNDER-STAMPING ADVISORIES</h4>
              <ol className="cert-warnings-list">
                <li><strong>SECTION 35 ADVISORY (ISA 1899):</strong> Under Section 35, failure to pay correct ad-valorem stamp duty renders the document inadmissible as evidence before any Court of Law or Arbitral Tribunal in India. A statutory penalty of up to 10 times the deficient stamp duty will be levied.</li>
                <li><strong>6-MONTH DURATION CLAUSE:</strong> Stamp paper/e-Stamp certificate must be purchased within 6 months prior to the date of execution of the deed (Section 54, ISA 1899).</li>
                <li><strong>SURCHARGE DECLARATION:</strong> BBMP Municipal Surcharges (12%) have been integrated within this audit in accordance with Karnataka Stamp (Amendment) Rules.</li>
              </ol>
            </div>

            <div className="cert-sign-grid">
              <div className="cert-sign-col">
                <div className="sig-line"></div>
                <p><strong>PREPARED & VERIFIED BY</strong></p>
                <span>StampCalc Automated Audit Engine</span>
              </div>
              <div className="cert-sign-col">
                <div className="sig-line"></div>
                <p><strong>EXECUTANT / ADVOCATE SIGNATURE</strong></p>
                <span>Authorized Signatory</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
