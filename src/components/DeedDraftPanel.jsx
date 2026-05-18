import { useState } from 'react';
import './DeedDraftPanel.css';

export default function DeedDraftPanel({ selectedCat, inputs, onClose }) {
  const [selectedTemplate, setSelectedTemplate] = useState(
    selectedCat === 'lease' ? 'lease' : selectedCat === 'partnership' ? 'partnership' : 'sale'
  );

  const getTemplateContent = () => {
    const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const pval = inputs.pval || '10,00,000';
    const rent = inputs.rent || '15,000';
    const advance = inputs.advance || '50,000';
    const partcap = inputs.partcap || '1,00,000';

    if (selectedTemplate === 'partnership') {
      return {
        title: 'Partnership Deed',
        text: `THIS DEED OF PARTNERSHIP is made and executed on this ${date} at Bengaluru, Karnataka.

BY AND BETWEEN:

1. Partner A, aged about 32 years, residing at No. 45, 1st Cross, Indiranagar, Bengaluru - 560038 (hereinafter referred to as the FIRST PARTNER).
AND
2. Partner B, aged about 35 years, residing at No. 120, 5th Main, Jayanagar, Bengaluru - 560041 (hereinafter referred to as the SECOND PARTNER).

WHEREAS the partners hereto have resolved to carry on the business of providing Software Consultancy and digital services in partnership under the name and style of "APEX DIGITAL CONSULTANTS".

NOW THIS DEED WITNESSETH AND IT IS MUTUALLY AGREED BY AND BETWEEN THE PARTNERS AS FOLLOWS:

1. BUSINESS NAME & OFFICE: The partnership business shall be carried on under the name "APEX DIGITAL CONSULTANTS" and its principal office shall be at Bengaluru.
2. DURATION OF FIRM: The partnership shall commence from the date of execution of this deed and shall carry on at WILL.
3. CAPITAL CONTRIBUTION: The total capital of the firm shall be Rs. ${partcap}/- (Rupees One Lakh Only) contributed equally by both partners.
4. PROFIT & LOSS SHARING: The net profits and losses of the business shall be shared equally (50% each) between the Partners.
5. BANK ACCOUNTS: The partnership bank account shall be opened in any commercial bank and shall be operated jointly by both Partners.

IN WITNESS WHEREOF the partners hereto have signed and executed this partnership deed on the day, month and year first above written.

First Partner: ______________________      Second Partner: ______________________

Witness 1: ______________________         Witness 2: ______________________`
      };
    } else if (selectedTemplate === 'lease') {
      return {
        title: 'Residential Lease Agreement',
        text: `THIS LEASE AGREEMENT is made and entered into on this ${date} at Bengaluru, Karnataka.

BY AND BETWEEN:

Landlord Name, residing at No. 80, 10th Cross, Koramangala, Bengaluru (hereinafter called the LESSOR / LANDLORD).
AND
Tenant Name, residing at No. 15, Block B, Malleshwaram, Bengaluru (hereinafter called the LESSEE / TENANT).

WHEREAS the Lessor is the absolute owner of the residential flat located at Flat No. 202, Pinecrest Apartments, J.P. Nagar, Bengaluru (hereinafter referred to as the LEASED PREMISES).

NOW THIS LEASE AGREEMENT WITNESSETH AS FOLLOWS:

1. LEASE PERIOD: This lease is granted for a fixed period of 11 Months commencing from the date of execution.
2. MONTHLY RENT: The Lessee shall pay to the Lessor a monthly rent of Rs. ${rent}/- (Rupees Fifteen Thousand Only) on or before the 5th day of every calendar month.
3. SECURITY DEPOSIT: The Lessee has paid an interest-free refundable security deposit of Rs. ${advance}/- (Rupees Fifty Thousand Only) to the Lessor, receipt of which is hereby acknowledged.
4. UTILITIES & TAXES: The Lessee shall pay all monthly electricity and water consumption charges. The Lessor shall pay municipal property taxes.
5. MAINTENANCE: The Lessee shall keep the interior of the premises in clean and tenantable condition.

IN WITNESS WHEREOF both the parties have set their signatures on the day, month and year mentioned above.

Lessor (Landlord): ______________________  Lessee (Tenant): ______________________

Witness 1: ______________________         Witness 2: ______________________`
      };
    } else {
      return {
        title: 'Agreement for Sale of Immovable Property',
        text: `THIS AGREEMENT FOR SALE is made and entered into on this ${date} at Bengaluru, Karnataka.

BY AND BETWEEN:

Seller Name, residing at No. 14, Rose Gardens, Whitefield, Bengaluru (hereinafter called the VENDOR / SELLER).
AND
Buyer Name, residing at No. 72, Orchid Avenue, HSR Layout, Bengaluru (hereinafter called the VENDEE / BUYER).

WHEREAS the Vendor is the absolute owner of the residential land and building bearing Site No. 404, Jayanagar 4th Block, Bengaluru (hereinafter referred to as the SCHEDULE PROPERTY).

NOW THIS AGREEMENT FOR SALE WITNESSETH AS FOLLOWS:

1. AGREEMENT TO SELL: The Vendor hereby agrees to sell and the Vendee hereby agrees to purchase the Schedule Property free from all encumbrances.
2. CONSIDERATION: The total sale consideration is fixed at Rs. ${pval}/- (Rupees Ten Lakhs Only).
3. ADVANCE PAYMENT: The Vendee has paid an advance amount of Rs. 1,00,000/- (Rupees One Lakh Only) as earnest money, receipt of which is acknowledged by the Vendor.
4. TIME FOR COMPLETION: The transaction shall be completed and the absolute Sale Deed shall be registered within 3 Months from the date of this agreement.
5. VACANT POSSESSION: The Vendor shall deliver vacant and peaceful possession of the property to the Vendee at the time of final registration.

IN WITNESS WHEREOF the parties have set their hands and signatures to this Agreement for Sale on the day first mentioned above.

Vendor (Seller): ______________________     Vendee (Buyer): ______________________

Witness 1: ______________________          Witness 2: ______________________`
      };
    }
  };

  const template = getTemplateContent();

  const downloadRtf = () => {
    // Generate standard MS Word compatible RTF structure
    const escapedText = template.text
      .replace(/\\/g, '\\\\')
      .replace(/{/g, '\\{')
      .replace(/}/g, '\\}')
      .replace(/\n/g, '\\par\n');

    const rtfContent = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\froman\\fcharset0 Times New Roman;}}
\\viewkind4\\uc1\\pard\\f0\\fs24\\sl360\\slmult1
{\\qc\\b\\fs36 ${template.title.toUpperCase()}\\par\\par}
${escapedText}
}`;

    const blob = new Blob([rtfContent], { type: 'application/rtf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.title.toLowerCase().replace(/ /g, '_')}.rtf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="subpage-container">
      <div className="subpage-header">
        <div className="sh-title">
          <span className="sh-icon">📝</span>
          <div>
            <h1>Deed Draft & RTF Generator</h1>
            <p>Generate draft legal deeds with live Times New Roman preview and download Word-compatible documents</p>
          </div>
        </div>
        <button className="subpage-close" onClick={onClose}>✕ Close Toolkit</button>
      </div>

      <div className="draft-grid">
        <div className="card control-card">
          <div className="gcard-header">
            <span className="gcard-icon">⚙️</span>
            <h2>Select Deed Template</h2>
          </div>
          <div className="template-selector-list">
            <button 
              className={`template-selector-btn ${selectedTemplate === 'sale' ? 'active' : ''}`}
              onClick={() => setSelectedTemplate('sale')}
            >
              <strong>📄 Agreement for Sale</strong>
              <span>Standard immovable property sale</span>
            </button>
            <button 
              className={`template-selector-btn ${selectedTemplate === 'lease' ? 'active' : ''}`}
              onClick={() => setSelectedTemplate('lease')}
            >
              <strong>📄 Residential Lease Agreement</strong>
              <span>11-Month rent/licence contract</span>
            </button>
            <button 
              className={`template-selector-btn ${selectedTemplate === 'partnership' ? 'active' : ''}`}
              onClick={() => setSelectedTemplate('partnership')}
            >
              <strong>📄 Partnership Deed</strong>
              <span>Deed for new firm creation</span>
            </button>
          </div>

          <div className="draft-actions-wrap">
            <button className="download-rtf-btn" onClick={downloadRtf}>
              📥 Download Word-Compatible Document (.rtf)
            </button>
            <p className="download-hint">⚠️ Downloaded file opens natively in Microsoft Word, Google Docs, or LibreOffice, preserving original layouts and legal margins.</p>
          </div>
        </div>

        <div className="card preview-card">
          <div className="gcard-header">
            <span className="gcard-icon">👁️</span>
            <h2>Legal Paper Live Preview</h2>
          </div>
          <div className="legal-paper-canvas">
            <div className="stamp-paper-placeholder">
              <div className="spp-border">
                <div className="spp-hdr">GOVERNMENT OF INDIA e-STAMP CERTIFICATE</div>
                <div className="spp-body">
                  --- e-STAMP PAPER AREA ---<br />
                  <span>[Purchase stamp paper of required value calculated in the dashboard and paste here]</span>
                </div>
              </div>
            </div>
            <div className="legal-paper-body font-times">
              <div className="legal-header-title">{template.title.toUpperCase()}</div>
              <pre className="legal-pre">{template.text}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
