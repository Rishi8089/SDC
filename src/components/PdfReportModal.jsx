import { useState } from 'react';
import { jsPDF } from 'jspdf';
import './PdfReportModal.css';

export default function PdfReportModal({ result, selectedState, selectedCat, inputs, onClose }) {
  const [reportType, setReportType] = useState('typeB'); // 'typeA' (Standard), 'typeB' (Audit Certificate)
  const [refId] = useState(() => 'SC-' + Math.floor(100000 + Math.random() * 900000));
  const [auditRef] = useState(() => 'AUDIT-' + Math.floor(10000000 + Math.random() * 90000000));

  if (!result) return null;

  const fmt = (num) => '₹' + Math.round(num).toLocaleString('en-IN');
  const date = new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' });

  const generatePdf = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ══ COLOR PALETTE ══
    const cNavy = [24, 48, 120];
    const cSaffron = [255, 153, 51];
    const cGreen = [19, 136, 8];
    const cRed = [192, 57, 43];
    const cText = [26, 35, 64];

    // Helper functions for margins & pagination
    let y = 15;
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    const drawHeaderFooter = () => {
      // 1. Tricolor Banner at top of page
      doc.setFillColor(cSaffron[0], cSaffron[1], cSaffron[2]);
      doc.rect(0, 0, pageWidth, 4, 'F');
      
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 4, pageWidth, 2, 'F');

      doc.setFillColor(cGreen[0], cGreen[1], cGreen[2]);
      doc.rect(0, 6, pageWidth, 4, 'F');

      // 2. Footer Page Numbers
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(120, 138, 168);
      const pageCount = doc.getNumberOfPages();
      doc.text(`EveryStampDuty.com — India's Complete Stamp Calculator  |  Page ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      doc.text('PREMIUM STATUTORY COMPLIANCE REPORT', margin, pageHeight - 10);
    };

    const checkPageBreak = (neededHeight) => {
      if (y + neededHeight > pageHeight - 20) {
        doc.addPage();
        drawHeaderFooter();
        y = 30; // reset y after new page header
      }
    };

    // First Page Initial Draw
    drawHeaderFooter();
    y = 20;

    if (reportType === 'typeA') {
      // ══ TYPE A: STANDARD BREAKDOWN REPORT ══
      
      // Header Title
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
      doc.text('STAMP DUTY COMPUTATION REPORT', margin, y);
      y += 6;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 110, 140);
      doc.text('ESTIMATE OF PREVAILING STATE REVENUE & REGISTRATION CHARGES', margin, y);
      y += 10;

      // Divider line
      doc.setDrawColor(230, 235, 245);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      // Meta Data Grid (Double Columns)
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
      doc.text('AUDIT PARAMETERS', margin, y);
      y += 6;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(cText[0], cText[1], cText[2]);

      const meta = [
        ['Jurisdiction State:', result.state?.name || selectedState],
        ['Primary Instrument:', selectedCat.replace(/_/g, ' ').toUpperCase()],
        ['Assessed Base Value:', fmt(result.baseValue)],
        ['Calculation Date:', date],
        ['Reference ID:', refId],
        ['Audit Certificate Ref:', auditRef]
      ];

      meta.forEach(([key, val], idx) => {
        const isLeft = idx % 2 === 0;
        const colX = isLeft ? margin : pageWidth / 2 + 5;
        doc.setFont('Helvetica', 'bold');
        doc.text(key, colX, y);
        doc.setFont('Helvetica', 'normal');
        doc.text(val, colX + 42, y);
        if (!isLeft || idx === meta.length - 1) {
          y += 6;
        }
      });
      y += 6;

      // Valuation parameters
      checkPageBreak(40);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
      doc.text('ASSESSMENT BASE DETAILS', margin, y);
      y += 6;

      // Box design
      doc.setFillColor(242, 245, 252);
      doc.rect(margin, y, contentWidth, 24, 'F');
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(cText[0], cText[1], cText[2]);
      doc.text('Government Circle Guideline Rate:', margin + 6, y + 8);
      doc.text(inputs.circle ? fmt(parseFloat(inputs.circle)) : 'Not Specified', margin + 70, y + 8);

      doc.text('Declared Transaction Value:', margin + 6, y + 16);
      doc.text(inputs.pval ? fmt(parseFloat(inputs.pval)) : 'Not Specified', margin + 70, y + 16);
      y += 30;

      // Itemized calculations table
      checkPageBreak(50);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
      doc.text('DETAILED STAMP DUTY & REGISTRY BREAKDOWN', margin, y);
      y += 6;

      // Table Header
      doc.setFillColor(cNavy[0], cNavy[1], cNavy[2]);
      doc.rect(margin, y, contentWidth, 8, 'F');
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text('Charge Particulars', margin + 4, y + 5.5);
      doc.text('Rate', margin + 110, y + 5.5);
      doc.text('Amount (INR)', pageWidth - margin - 4, y + 5.5, { align: 'right' });
      y += 8;

      result.lines.forEach((l, idx) => {
        checkPageBreak(12);
        
        doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 254);
        doc.rect(margin, y, contentWidth, 10, 'F');

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(cText[0], cText[1], cText[2]);
        doc.text(l.n, margin + 4, y + 6.5);
        
        // Add note if any
        if (l.note) {
          doc.setFont('Helvetica', 'oblique');
          doc.setFontSize(7.5);
          doc.setTextColor(110, 120, 150);
          doc.text(`— ${l.note}`, margin + 45, y + 6.5);
        }

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(cText[0], cText[1], cText[2]);
        doc.text(l.r, margin + 110, y + 6.5);
        doc.text(fmt(l.v), pageWidth - margin - 4, y + 6.5, { align: 'right' });
        y += 10;
      });

      // Total row
      checkPageBreak(12);
      doc.setFillColor(cSaffron[0], cSaffron[1], cSaffron[2]);
      doc.rect(margin, y, contentWidth, 10, 'F');
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text('TOTAL NET STATUTORY PAYABLE DUE', margin + 4, y + 6.5);
      doc.text(fmt(result.total), pageWidth - margin - 4, y + 6.5, { align: 'right' });
      y += 18;

      // Disclaimer
      checkPageBreak(30);
      doc.setDrawColor(cRed[0], cRed[1], cRed[2]);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(cRed[0], cRed[1], cRed[2]);
      doc.text('IMPORTANT DISCLAIMER:', margin, y);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(120, 130, 160);
      
      const disclaimerTxt = "This estimate is based on prevailing state stamp acts, circle rates, and municipality categories for fiscal year 2026-27. Deficient stamp duty attracts severe interest penalties under Section 35. Please consult an advocate to verify individual sub-registrar area ward codes before purchase of e-Stamps.";
      const splitText = doc.splitTextToSize(disclaimerTxt, contentWidth);
      doc.text(splitText, margin, y + 4);

    } else {
      // ══ TYPE B: STAMP AUDIT CERTIFICATE ══
      
      // Header Border Title
      doc.setDrawColor(cNavy[0], cNavy[1], cNavy[2]);
      doc.setLineWidth(0.8);
      doc.rect(margin, y, contentWidth, 22);

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
      doc.text('CERTIFICATE OF STATUTORY STAMP AUDIT', pageWidth / 2, y + 8, { align: 'center' });

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(110, 120, 150);
      doc.text('ISSUED BY STAMPCALC INDIA AUTOMATED AUDIT ENGINE UNDER REVENUE AND STAMP ACTS', pageWidth / 2, y + 13, { align: 'center' });

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(cRed[0], cRed[1], cRed[2]);
      doc.text(`AUDIT REF NO: ${auditRef}   |   DATE: ${date.toUpperCase()}`, pageWidth / 2, y + 18, { align: 'center' });
      y += 28;

      // Cert Intro text
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(cText[0], cText[1], cText[2]);
      const intro = `This is to certify and formally declare that a digital stamp audit has been conducted on the proposed transaction parameters details here below, in accordance with the Indian Stamp Act, 1899, the Registration Act, 1908, and the respective state regulations.`;
      const splitIntro = doc.splitTextToSize(intro, contentWidth);
      doc.text(splitIntro, margin, y);
      y += 14;

      // Meta grid
      doc.setDrawColor(220, 225, 235);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;

      const meta = [
        ['Jurisdiction State:', result.state?.name || selectedState],
        ['Primary Instrument:', selectedCat.replace(/_/g, ' ').toUpperCase()],
        ['State Stamp Act:', result.state?.act || 'Indian Stamp Act 1899'],
        ['Property / Asset Type:', inputs.ptype ? inputs.ptype.toUpperCase() : 'RESIDENTIAL'],
        ['Assessed Base Value:', fmt(result.baseValue)],
        ['Claimed Gender / Exemption:', inputs.gender ? inputs.gender.toUpperCase() : 'MALE']
      ];

      meta.forEach(([key, val], idx) => {
        const isLeft = idx % 2 === 0;
        const colX = isLeft ? margin : pageWidth / 2 + 5;
        doc.setFont('Helvetica', 'bold');
        doc.text(key, colX, y);
        doc.setFont('Helvetica', 'normal');
        doc.text(val, colX + 42, y);
        if (!isLeft || idx === meta.length - 1) {
          y += 6;
        }
      });
      y += 6;

      // Calculations table header
      checkPageBreak(40);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
      doc.text('AUDIT STAMP & FEE CHARGE CALCULATIONS', margin, y);
      y += 6;

      doc.setFillColor(cNavy[0], cNavy[1], cNavy[2]);
      doc.rect(margin, y, contentWidth, 8, 'F');
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);
      doc.text('Charge Clause / Particulars', margin + 4, y + 5.5);
      doc.text('Applied Rate', margin + 110, y + 5.5);
      doc.text('Duty / Fees (INR)', pageWidth - margin - 4, y + 5.5, { align: 'right' });
      y += 8;

      result.lines.forEach((l, idx) => {
        checkPageBreak(12);
        
        doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 254);
        doc.rect(margin, y, contentWidth, 10, 'F');

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(cText[0], cText[1], cText[2]);
        doc.text(l.n, margin + 4, y + 6.5);
        
        if (l.note) {
          doc.setFont('Helvetica', 'oblique');
          doc.setFontSize(7.5);
          doc.setTextColor(110, 120, 150);
          doc.text(`— ${l.note}`, margin + 45, y + 6.5);
        }

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.text(l.r, margin + 110, y + 6.5);
        doc.text(fmt(l.v), pageWidth - margin - 4, y + 6.5, { align: 'right' });
        y += 10;
      });

      // Total
      checkPageBreak(12);
      doc.setFillColor(cGreen[0], cGreen[1], cGreen[2]);
      doc.rect(margin, y, contentWidth, 10, 'F');
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(255, 255, 255);
      doc.text('TOTAL LIQUID STATUTORY DEPOSIT DUE', margin + 4, y + 6.5);
      doc.text(fmt(result.total), pageWidth - margin - 4, y + 6.5, { align: 'right' });
      y += 18;

      // Warnings box
      checkPageBreak(40);
      doc.setFillColor(253, 245, 245);
      doc.rect(margin, y, contentWidth, 26, 'F');
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(cRed[0], cRed[1], cRed[2]);
      doc.text('CRITICAL STATUTORY COMPLIANCE & UNDER-STAMPING ADVISORIES', margin + 4, y + 6);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(cText[0], cText[1], cText[2]);
      doc.text('1. SECTION 35 ADVISORY: Deficiency in stamp duty renders the document inadmissible in court with up to 10x penalty.', margin + 4, y + 12);
      doc.text('2. 6-MONTH DURATION CLAUSE: Stamp papers must be purchased within 6 months prior to execution date (Sec 54, ISA).', margin + 4, y + 18);
      doc.text('3. MUNICIPAL SURCHARGES: Surcharges (up to 12% in urban corp wards) are integrated in total net statutory payable.', margin + 4, y + 24);
      y += 34;

      // Signatures
      checkPageBreak(30);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
      doc.text('PREPARED & AUDITED BY', margin + 10, y);
      doc.text('EXECUTANT / ADVOCATE SIGNATURE', pageWidth - margin - 60, y);

      doc.setDrawColor(180, 190, 210);
      doc.setLineWidth(0.4);
      doc.line(margin + 10, y + 14, margin + 60, y + 14);
      doc.line(pageWidth - margin - 60, y + 14, pageWidth - margin - 10, y + 14);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(110, 120, 150);
      doc.text('StampCalc Automated Audit Engine', margin + 10, y + 18);
      doc.text('Authorized Signatory / Legal Rep', pageWidth - margin - 60, y + 18);
    }

    doc.save(`esd_stamp_report_${refId.toLowerCase()}.pdf`);
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
          
          <button className="print-trigger-btn" onClick={generatePdf}>
            📥 Generate & Download PDF Report
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
