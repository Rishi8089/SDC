import React, { useState, useEffect } from 'react';
import './DeedDraftPanel.css';

// Indian numbering to words converter
function numToWords(n) {
  if (!n || isNaN(n)) return 'Zero';
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  function convert(num) {
    if (num === 0) return '';
    if (num < 20) return ones[num] + ' ';
    if (num < 100) return tens[Math.floor(num / 10)] + ' ' + (num % 10 ? ones[num % 10] + ' ' : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred ' + (num % 100 ? convert(num % 100) : '');
    if (num < 100000) return convert(Math.floor(num / 1000)) + ' Thousand ' + (num % 1000 ? convert(num % 1000) : '');
    if (num < 10000000) return convert(Math.floor(num / 100000)) + ' Lakh ' + (num % 100000 ? convert(num % 100000) : '');
    return convert(Math.floor(num / 10000000)) + ' Crore ' + (num % 10000000 ? convert(num % 10000000) : '');
  }
  return convert(Math.round(n)).trim();
}

export default function DeedDraftPanel({ selectedCat, inputs, onClose }) {
  const [deedType, setDeedType] = useState(
    selectedCat === 'lease' ? 'rental' :
    selectedCat === 'partnership' ? 'partnership' :
    selectedCat === 'will' ? 'will' :
    selectedCat === 'mortgage' ? 'mortgage' :
    selectedCat === 'gift_prop' ? 'gift' :
    selectedCat === 'poa_sale' || selectedCat === 'poa_gen' ? 'poa' : 'sale'
  );

  const [formData, setFormData] = useState({
    // General
    date: new Date().toISOString().split('T')[0],
    place: 'Bengaluru',
    p1: 'Rajesh Kumar',
    p1father: 's/o Late Shri Anand Kumar',
    p1age: '45',
    p1id: 'AADHAAR XXXX-XXXX-1234',
    p1addr: 'No. 80, 10th Cross, Koramangala, Bengaluru, Karnataka',
    p2: 'Suresh Mehta',
    p2father: 's/o Shri Ramesh Mehta',
    p2age: '35',
    p2id: 'PAN ABCDM1234E',
    p2addr: 'No. 15, Block B, Malleshwaram, Bengaluru, Karnataka',
    paidby: 'second',
    totalDuty: '₹1,000',
    w1: 'Amit Sharma',
    w2: 'Vikram Singh',

    // Rental / Lease specific
    rent: inputs.rent || '15000',
    deposit: inputs.advance || '50000',
    depDate: new Date().toISOString().split('T')[0],
    rentdue: '5th',
    paymode: 'Bank Transfer / NEFT / RTGS',
    escalation: '5',
    latepen: '2% per month',
    grace: '5',
    lockin: '6 months',
    notice: '1 month',
    elec: 'paid by Tenant as per actual meter consumption',
    water: 'paid by Tenant',
    society: 'paid by Landlord',
    minrep: 'Rs. 1,000',
    depRefund: '30 days',
    depDeduct: 'damages, unpaid dues, and professional cleaning charges',
    depCondition: 'Good, clean and tenantable condition',
    
    // Property specific
    prop: 'Flat No. 202, 2nd Floor, Pinecrest Apartments',
    propAddr: 'Site No. 24, Outer Ring Road, J.P. Nagar, Bengaluru - 560078',
    area: '1,200 sq.ft.',
    proptype: 'residential_flat',
    beds: '2 BHK',
    furnish: 'semi',
    parking: '1 Reserved Covered Car Parking Space',
    survey: 'Survey No. 45/2B, CTS No. 1024',

    // Sale specific
    saleAmt: inputs.pval || '1000000',
    saleMV: inputs.circle || '1000000',
    saleToken: '100000',
    salePoss: 'on execution and registration',
    saleEnc: 'free from all encumbrances, charges, liens and claims',

    // Mortgage specific
    mortAmt: inputs.loan || '500000',
    mortRate: '9.5',
    mortTenure: '120 months',
    mortEMI: '6500',
    mortPurpose: 'Purchase of Residential Property',
    mortType: 'Equitable Mortgage by deposit of title deeds',

    // Gift specific
    giftVal: inputs.pval || '1000000',
    giftRel: 'Son (Family Member)',
    giftReason: 'natural love and affection',

    // Partnership specific
    firmName: 'APEX DIGITAL CONSULTANTS',
    bizNature: 'Software Consultancy, Web Development and Digital Services',
    bizAddr: 'No. 45, 1st Cross, Indiranagar, Bengaluru - 560038',
    firmCap: inputs.partcap || '100000',
    p1Cap: '50000',
    p2Cap: '50000',
    profitRatio: 'Equal (50:50)',
    firmBank: 'HDFC Bank Ltd, Indiranagar Branch',
    firmInterest: '12% per annum',

    // Will specific
    willAssets: '1. Flat No. 202, Pinecrest Apartments, J.P. Nagar, Bengaluru.\n2. Savings Bank A/c No. 50100012345 at HDFC Bank, Bengaluru.\n3. Fixed Deposit Receipt No. FD987654 at ICICI Bank.',
    willExecutor: 'Shri Vinay Kumar (brother of the Testator)',
    willBeneficiary: '1. 60% share to my spouse Smt. Sunita Kumar.\n2. 40% share to my son Rajesh Kumar.',

    // POA specific
    poaPowers: '1. To manage, lease out, collect rents, and pay taxes for the Scheduled Property.\n2. To represent the Principal before BBMP, BESCOM, BWSSB, and Sub-Registrar.\n3. To execute, sign, and submit lease agreements and utility connections.',
    poaProp: 'Site No. 404, Jayanagar 4th Block, Bengaluru, measuring 2400 sq.ft.',
    poaValidity: 'Until revoked in writing by the Principal',
    poaConsid: 'Nil (gratuitous service)',
  });

  // Keep formData updated with global inputs if they change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      rent: inputs.rent || prev.rent,
      deposit: inputs.advance || prev.deposit,
      saleAmt: inputs.pval || prev.saleAmt,
      saleMV: inputs.circle || prev.saleMV,
      mortAmt: inputs.loan || prev.mortAmt,
      firmCap: inputs.partcap || prev.firmCap,
    }));
  }, [inputs]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getPartyLabels = () => {
    switch (deedType) {
      case 'rental':
        return {
          p1: 'Landlord / Licensor Name',
          p1f: 'Landlord Father\'s/Husband\'s Name',
          p1a: 'Landlord Residential Address',
          p2: 'Tenant / Licensee Name',
          p2f: 'Tenant Father\'s/Husband\'s Name',
          p2a: 'Tenant Permanent Address',
          p1role: 'LICENSOR',
          p2role: 'LICENSEE'
        };
      case 'sale':
        return {
          p1: 'Vendor / Seller Name',
          p1f: 'Seller Father\'s/Husband\'s Name',
          p1a: 'Seller Permanent Address',
          p2: 'Purchaser / Buyer Name',
          p2f: 'Buyer Father\'s/Husband\'s Name',
          p2a: 'Buyer Permanent Address',
          p1role: 'VENDOR',
          p2role: 'PURCHASER'
        };
      case 'mortgage':
        return {
          p1: 'Mortgagor (Borrower) Name',
          p1f: 'Mortgagor Father\'s/Husband\'s Name',
          p1a: 'Mortgagor Address',
          p2: 'Mortgagee (Lender / Bank) Name',
          p2f: 'Lender Authorized Officer / Rep',
          p2a: 'Mortgagee/Bank Address',
          p1role: 'MORTGAGOR',
          p2role: 'MORTGAGEE'
        };
      case 'gift':
        return {
          p1: 'Donor (Giver) Name',
          p1f: 'Donor Father\'s/Husband\'s Name',
          p1a: 'Donor Address',
          p2: 'Donee (Receiver) Name',
          p2f: 'Donee Father\'s/Husband\'s Name',
          p2a: 'Donee Address',
          p1role: 'DONOR',
          p2role: 'DONEE'
        };
      case 'partnership':
        return {
          p1: 'Partner 1 Name',
          p1f: 'Partner 1 Father\'s Name',
          p1a: 'Partner 1 Address',
          p2: 'Partner 2 Name',
          p2f: 'Partner 2 Father\'s Name',
          p2a: 'Partner 2 Address',
          p1role: 'FIRST PARTNER',
          p2role: 'SECOND PARTNER'
        };
      case 'will':
        return {
          p1: 'Testator (Will Maker) Name',
          p1f: 'Testator Father\'s/Husband\'s Name',
          p1a: 'Testator Residential Address',
          p2: 'Primary Beneficiary Name',
          p2f: 'Beneficiary Father\'s Name',
          p2a: 'Beneficiary Address',
          p1role: 'TESTATOR',
          p2role: 'BENEFICIARY'
        };
      case 'poa':
        return {
          p1: 'Principal (Executant) Name',
          p1f: 'Principal Father\'s/Husband\'s Name',
          p1a: 'Principal Address',
          p2: 'Attorney (Agent) Name',
          p2f: 'Attorney Father\'s/Husband\'s Name',
          p2a: 'Attorney Address',
          p1role: 'PRINCIPAL',
          p2role: 'ATTORNEY'
        };
      default:
        return {
          p1: 'First Party Name',
          p1f: 'First Party Father\'s Name',
          p1a: 'First Party Address',
          p2: 'Second Party Name',
          p2f: 'Second Party Father\'s Name',
          p2a: 'Second Party Address',
          p1role: 'FIRST PARTY',
          p2role: 'SECOND PARTY'
        };
    }
  };

  const labels = getPartyLabels();

  const getGeneratedDraft = () => {
    const dtObj = formData.date ? new Date(formData.date) : new Date();
    const dateStr = dtObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const p1Detail = `${formData.p1} ${formData.p1father ? formData.p1father + ',' : ''} aged ${formData.p1age || '__'} years, bearing ID: ${formData.p1id || '__'}`;
    const p2Detail = `${formData.p2} ${formData.p2father ? formData.p2father + ',' : ''} aged ${formData.p2age || '__'} years, bearing ID: ${formData.p2id || '__'}`;

    if (deedType === 'rental') {
      const isResidential = formData.proptype === 'residential_flat' || formData.proptype === 'residential_house';
      const furnishText = { 'fully': 'Fully Furnished', 'semi': 'Semi-Furnished', 'unfurnished': 'Unfurnished' }[formData.furnish] || 'Semi-Furnished';
      const rentVal = parseInt(formData.rent) || 0;
      const depositVal = parseInt(formData.deposit) || 0;
      const rentFmt = `Rs. ${rentVal.toLocaleString('en-IN')}/- (Rupees ${numToWords(rentVal)} Only)`;
      const depositFmt = `Rs. ${depositVal.toLocaleString('en-IN')}/- (Rupees ${numToWords(depositVal)} Only)`;
      const paidByText = formData.paidby === 'first' ? formData.p1 : formData.paidby === 'second' ? formData.p2 : 'Both parties equally';

      return `RESIDENTIAL / COMMERCIAL LEAVE AND LICENCE AGREEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This Leave and Licence Agreement ("Agreement") is executed on this ${dateStr} at ${formData.place || 'Bengaluru'}.

BY AND BETWEEN:
THE LICENSOR: ${p1Detail},
Residing at: ${formData.p1addr},
(hereinafter referred to as the "Licensor/Landlord", which expression shall include their heirs and executors) — OF THE FIRST PART;

AND

THE LICENSEE: ${p2Detail},
Permanent Address: ${formData.p2addr},
(hereinafter referred to as the "Licensee/Tenant", which expression shall include their heirs and executors) — OF THE SECOND PART.

WHEREAS the Licensor is the absolute owner of the ${furnishText} ${formData.proptype.replace(/_/g, ' ')} described below:
Property Address: ${formData.propAddr}
Description     : ${formData.prop}
Area            : ${formData.area}
Parking         : ${formData.parking}
Survey/CTS No.  : ${formData.survey || 'N/A'}
(hereinafter referred to as the "Scheduled Premises").

AND WHEREAS the Licensee has approached the Licensor to occupy the Scheduled Premises on a Leave and Licence basis for ${isResidential ? 'residential' : 'commercial/business'} purposes only, and the Licensor has agreed on the following mutual terms:

NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:

1. GRANT OF LICENCE & TENURE
The Licensor hereby grants to the Licensee a licence to occupy the Scheduled Premises for a fixed period of 11 Months commencing from the execution date. Lock-in Period: ${formData.lockin}.

2. MONTHLY LICENCE FEE & PAYMENT
a) The Licensee shall pay a monthly Rent/Licence Fee of ${rentFmt}, payable on or before the ${formData.rentdue} of each calendar month.
b) Mode of payment: ${formData.paymode}.
c) Grace Period: ${formData.grace} days. Late payment penalty: ${formData.latepen}.

3. SECURITY DEPOSIT
a) The Licensee has paid an interest-free refundable Security Deposit of ${depositFmt} on ${formData.depDate || dateStr}.
b) The deposit shall be refunded within ${formData.depRefund} of vacation, after deducting amounts towards ${formData.depDeduct}.
c) The premises shall be returned in ${formData.depCondition}.

4. RENT ESCALATION
The Rent shall be increased by ${formData.escalation}% per annum upon renewal or on each anniversary, with at least 30 days prior written notice.

5. MAINTENANCE, UTILITIES & REPAIRS
a) Minor repairs up to ${formData.minrep} shall be borne by the Licensee. Structural repairs shall be the Licensor's responsibility.
b) Electricity charges: ${formData.elec}.
c) Water charges: ${formData.water}.
d) Society maintenance charges: ${formData.society}.

6. STAMP DUTY & REGISTRATION
The Stamp Duty of ${formData.totalDuty} on this Agreement has been paid by ${paidByText} as per applicable State Stamp rules.

IN WITNESS WHEREOF, the parties sign this deed on the day, month and year first above written.

LICENSOR: _______________________      LICENSEE: _______________________
(Signature with date)                  (Signature with date)

WITNESS 1: ${formData.w1 || '_______________________'}    WITNESS 2: ${formData.w2 || '_______________________'}`;
    }

    if (deedType === 'sale') {
      const saleAmtVal = parseInt(formData.saleAmt) || 0;
      const saleTokenVal = parseInt(formData.saleToken) || 0;
      const saleAmtFmt = `Rs. ${saleAmtVal.toLocaleString('en-IN')}/- (Rupees ${numToWords(saleAmtVal)} Only)`;
      const saleTokenFmt = `Rs. ${saleTokenVal.toLocaleString('en-IN')}/- (Rupees ${numToWords(saleTokenVal)} Only)`;
      const paidByText = formData.paidby === 'first' ? formData.p1 : formData.paidby === 'second' ? formData.p2 : 'Both parties equally';

      return `DEED OF SALE OF IMMOVABLE PROPERTY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This DEED OF SALE is executed on this ${dateStr} at ${formData.place || 'Bengaluru'}.

BY AND BETWEEN:
THE VENDOR (SELLER): ${p1Detail},
Address: ${formData.p1addr},
(hereinafter referred to as the "Vendor/Seller") — OF THE FIRST PART;

AND

THE PURCHASER (BUYER): ${p2Detail},
Address: ${formData.p2addr},
(hereinafter referred to as the "Purchaser/Buyer") — OF THE SECOND PART.

SCHEDULE OF THE PROPERTY:
Property Type : ${formData.proptype.replace(/_/g, ' ').toUpperCase()}
Full Address  : ${formData.propAddr}
Description   : ${formData.prop}
Measurements  : ${formData.area}
Survey/CTS No.: ${formData.survey || 'As per documents'}
Encumbrances  : ${formData.saleEnc}

WHEREAS the Vendor is the absolute owner of the Schedule Property and has agreed to sell the same to the Purchaser for the consideration stated herein.

NOW THIS SALE DEED WITNESSETH AS FOLLOWS:

1. CONSIDERATION & EARNEST MONEY
The total sale consideration is fixed at ${saleAmtFmt}. Out of this, an advance earnest money of ${saleTokenFmt} has been paid prior, receipt of which is acknowledged.

2. PAYMENT OF BALANCE & CONVEYANCE
The Purchaser has paid the balance consideration to the Vendor before execution, and the Vendor hereby conveys, transfers, and assigns the property to the Purchaser absolutely and forever.

3. PHYSICAL POSSESSION
The absolute physical possession of the Schedule Property is handed over to the Purchaser ${formData.salePoss}.

4. TITLE GUARANTEE & COVENANTS
The Vendor warrants that the property is ${formData.saleEnc}. The Vendor covenants to indemnify the Purchaser against all prior claims, disputes, or revenue demands.

5. STAMP DUTY
The Stamp Duty of ${formData.totalDuty} has been paid by ${paidByText} as per ISA 1899 and the applicable State Stamp Act.

IN WITNESS WHEREOF, the parties sign this deed on the day first mentioned above.

VENDOR (SELLER): _________________      PURCHASER (BUYER): ________________
(Signature with date)                  (Signature with date)

WITNESS 1: ${formData.w1 || '_______________________'}    WITNESS 2: ${formData.w2 || '_______________________'}`;
    }

    if (deedType === 'mortgage') {
      const mortAmtVal = parseInt(formData.mortAmt) || 0;
      const mortAmtFmt = `Rs. ${mortAmtVal.toLocaleString('en-IN')}/- (Rupees ${numToWords(mortAmtVal)} Only)`;
      const mortEMIVal = parseInt(formData.mortEMI) || 0;
      const mortEMIFmt = `Rs. ${mortEMIVal.toLocaleString('en-IN')}/- (Rupees ${numToWords(mortEMIVal)} Only)`;

      return `DEED OF SIMPLE MORTGAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This DEED OF MORTGAGE is made on this ${dateStr} at ${formData.place || 'Bengaluru'}.

BY AND BETWEEN:
THE MORTGAGOR (BORROWER): ${p1Detail},
Address: ${formData.p1addr},
(hereinafter referred to as the "Mortgagor") — OF THE FIRST PART;

AND

THE MORTGAGEE (LENDER/BANK): ${formData.p2},
Address: ${formData.p2addr},
(hereinafter referred to as the "Mortgagee") — OF THE SECOND PART.

LOAN & FINANCIAL DETAILS:
Principal Loan Amount: ${mortAmtFmt}
Applicable Interest  : ${formData.mortRate}% per annum
Repayment Period     : ${formData.mortTenure}
Monthly Instalment   : ${mortEMIFmt}
Mortgage Category    : ${formData.mortType}
Purpose of Loan      : ${formData.mortPurpose}

MORTGAGED PROPERTY:
Address: ${formData.propAddr}
Description: ${formData.prop}

NOW THIS DEED WITNESSETH AS FOLLOWS:

1. LOAN & SECURITY
In consideration of the sum of ${mortAmtFmt} advanced by the Mortgagee, the Mortgagor hereby mortgages the Scheduled Property as security for the timely repayment of the principal, interest, and charges.

2. COVENANTS FOR REPAYMENT
The Mortgagor agrees to repay the loan in monthly instalments of ${mortEMIFmt} for a tenure of ${formData.mortTenure}. Interest shall be compounded monthly.

3. RIGHT OF SALE & ENFORCEMENT
In case of default in payment of 3 consecutive EMIs, the Mortgagee shall be entitled to enforce this mortgage under the provisions of the Transfer of Property Act 1882 and SARFAESI Act 2002.

4. RECONVEYANCE & DISCHARGE
Upon full discharge of the debt, the Mortgagee shall execute a Deed of Reconveyance and return all original title documents.

IN WITNESS WHEREOF, the parties sign this deed on the day first mentioned above.

MORTGAGOR (BORROWER): _____________      MORTGAGEE (LENDER): ________________
(Signature with date)                  (Signature with date)

WITNESS 1: ${formData.w1 || '_______________________'}    WITNESS 2: ${formData.w2 || '_______________________'}`;
    }

    if (deedType === 'gift') {
      const giftValVal = parseInt(formData.giftVal) || 0;
      const giftValFmt = `Rs. ${giftValVal.toLocaleString('en-IN')}/- (Rupees ${numToWords(giftValVal)} Only)`;

      return `DEED OF GIFT OF IMMOVABLE PROPERTY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This DEED OF GIFT is made on this ${dateStr} at ${formData.place || 'Bengaluru'}.

BY AND BETWEEN:
THE DONOR (GIVER): ${p1Detail},
Address: ${formData.p1addr},
(hereinafter referred to as the "Donor") — OF THE FIRST PART;

AND

THE DONEE (RECEIVER): ${p2Detail},
Address: ${formData.p2addr},
(hereinafter referred to as the "Donee") — OF THE SECOND PART.

RELATIONSHIP: The Donee is the ${formData.giftRel} of the Donor.

GIFTED PROPERTY:
Full Address  : ${formData.propAddr}
Description   : ${formData.prop}
Market Value  : ${giftValFmt}

WHEREAS the Donor is the absolute owner of the property and desires to transfer the same out of ${formData.giftReason} to the Donee without any monetary consideration.

NOW THIS GIFT DEED WITNESSETH AS FOLLOWS:

1. GIFT AND CONVEYANCE
The Donor, out of natural love, affection, and goodwill, hereby absolutely gifts, transfers, and conveys the property described above to the Donee.

2. POSSESSION AND TITLE
The Donor has delivered physical possession of the property to the Donee on this day, along with all original title deeds. The Donee accepts the gift and takes possession.

3. WARRANTY & EXEMPTION
Donor warrants clear and marketable title. This transfer is exempt from Income Tax under Sec 56(2)(x) of the IT Act 1961 as it is made to a close family relative.

IN WITNESS WHEREOF, the parties sign this deed on the day first mentioned above.

DONOR (GIVER): ____________________      DONEE (RECEIVER): __________________
(Signature with date)                  (Signature with date)

WITNESS 1: ${formData.w1 || '_______________________'}    WITNESS 2: ${formData.w2 || '_______________________'}`;
    }

    if (deedType === 'partnership') {
      const capVal = parseInt(formData.firmCap) || 0;
      const capFmt = `Rs. ${capVal.toLocaleString('en-IN')}/- (Rupees ${numToWords(capVal)} Only)`;

      return `DEED OF PARTNERSHIP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This DEED OF PARTNERSHIP is made and executed on this ${dateStr} at ${formData.place || 'Bengaluru'}.

BY AND BETWEEN:
1. FIRST PARTNER: ${p1Detail},
   Address: ${formData.p1addr};
AND
2. SECOND PARTNER: ${p2Detail},
   Address: ${formData.p2addr}.

WHEREAS the partners hereto have resolved to carry on partnership business under the name "${formData.firmName}".

NOW THIS DEED WITNESSETH AND IT IS MUTUALLY AGREED AS FOLLOWS:

1. NAME & BUSINESS
The business shall be carried on under the name "${formData.firmName}". The principal business activity is: ${formData.bizNature}. Address: ${formData.bizAddr}.

2. COMMENCEMENT & DURATION
The partnership commences on ${dateStr} and shall carry on at WILL.

3. CAPITAL CONTRIBUTION
The total capital of the firm is ${capFmt}, contributed equally as under:
Partner 1 (${formData.p1}): Rs. ${parseInt(formData.p1Cap).toLocaleString('en-IN')}/-
Partner 2 (${formData.p2}): Rs. ${parseInt(formData.p2Cap).toLocaleString('en-IN')}/-

4. PROFIT & LOSS SHARING
The net profits and losses shall be shared in the ratio of ${formData.profitRatio}. Interest on partner capital shall be paid at ${formData.firmInterest}.

5. BANK ACCOUNTS & OPERATION
The partnership bank account shall be opened in ${formData.firmBank} and operated jointly by both Partners.

IN WITNESS WHEREOF, the partners hereto have signed this partnership deed.

PARTNER 1: ________________________      PARTNER 2: ________________________

WITNESS 1: ${formData.w1 || '_______________________'}    WITNESS 2: ${formData.w2 || '_______________________'}`;
    }

    if (deedType === 'will') {
      return `LAST WILL AND TESTAMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
I, ${p1Detail}, residing at ${formData.p1addr}, being of sound mind, active health and disposing memory, hereby declare this to be my LAST WILL AND TESTAMENT.

1. APPOINTMENT OF EXECUTOR
I hereby appoint ${formData.willExecutor} as the sole Executor of this my Last Will.

2. DESCRIPTION OF ASSETS
My entire estate, both movable and immovable, consists of:
${formData.willAssets}

3. BEQUESTS & DISTRIBUTION
I hereby bequeath, give and devise my assets in the following manner:
${formData.willBeneficiary}

4. RESIDUARY CLAUSE
Any assets not specifically bequeathed in this Will shall devolve upon my surviving spouse, and in their absence, equally to my legal heirs.

5. SIGNATURE & WITNESSES
This Will is signed on this ${dateStr} at ${formData.place} in the simultaneous presence of both witnesses.

TESTATOR: _______________________      Date: ___________
(Signature of Testator)

SIGNED by the Testator in our presence, who in their presence and in the presence of each other have signed as witnesses:

WITNESS 1: ${formData.w1 || '_______________________'}
Signature: _______________________ Address: _______________________

WITNESS 2: ${formData.w2 || '_______________________'}
Signature: _______________________ Address: _______________________`;
    }

    if (deedType === 'poa') {
      return `GENERAL POWER OF ATTORNEY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KNOW ALL MEN BY THESE PRESENTS that I, ${p1Detail}, residing at ${formData.p1addr} (hereinafter called "the Principal"), do hereby constitute and appoint:

THE ATTORNEY: ${p2Detail},
Residing at: ${formData.p2addr},
(hereinafter called "the Attorney") as my true and lawful attorney.

SUBJECT PROPERTY / MATTER:
${formData.poaProp}

POWERS GRANTED:
I hereby authorize my Attorney to do the following acts in my name and on my behalf:
${formData.poaPowers}

TERMS:
1. VALIDITY: This Power of Attorney shall remain valid ${formData.poaValidity}.
2. CONSIDERATION: ${formData.poaConsid}.
3. REVOCATION: This POA may be revoked by me at any time in writing and registered.

I hereby ratify and confirm all acts done by the Attorney in exercise of powers granted.

EXECUTED at ${formData.place || 'Bengaluru'} on this ${dateStr}.

PRINCIPAL (EXECUTANT): _____________      ATTORNEY (AGENT): _________________
(Signature of Principal)                 (Signature of Agent)

WITNESS 1: ${formData.w1 || '_______________________'}    WITNESS 2: ${formData.w2 || '_______________________'}`;
    }

    // Default
    return `GENERAL AGREEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This AGREEMENT is executed on this ${dateStr} at ${formData.place}.

BY AND BETWEEN:
THE FIRST PARTY: ${p1Detail},
Address: ${formData.p1addr};

AND

THE SECOND PARTY: ${p2Detail},
Address: ${formData.p2addr}.

WITNESSETH:
1. The parties agree to collaborate on the subject matter of: ${formData.prop}.
2. Full terms and details shall be appended in subsequent schedules.

STAMP DUTY:
Stamp duty has been paid as calculated under applicable rules.

IN WITNESS WHEREOF, the parties sign this instrument on the date above written.

FIRST PARTY: _____________________      SECOND PARTY: ____________________

WITNESS 1: ${formData.w1 || '_______________________'}    WITNESS 2: ${formData.w2 || '_______________________'}`;
  };

  const draftText = getGeneratedDraft();

  const downloadRtf = () => {
    // Escaping function for Rich Text Format (RTF)
    function rtfEsc(s) {
      return s
        .replace(/\\/g, '\\\\')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/━+/g, '------------------------------------------------')
        .replace(/[┌┐└┘├┤┬┴┼│─]/g, '|')
        .split('\n')
        .join('\\par\n');
    }

    const escaped = rtfEsc(draftText);
    const titleFmt = deedType.toUpperCase() + ' AGREEMENT DRAFT';

    const rtfContent = 
      '{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang1033\n' +
      '{\\fonttbl{\\f0\\froman\\fcharset0 Times New Roman;}{\\f1\\fswiss\\fcharset0 Arial;}}\n' +
      '{\\colortbl;\\red24\\green48\\blue120;\\red255\\green153\\blue51;\\red19\\green136\\blue8;\\red192\\green57\\blue43;}\n' +
      `{\\info{\\title ${titleFmt}}{\\author EveryStampDuty.com}{\\company EveryStampDuty.com}}\n` +
      '\\paperw12240\\paperh15840\\margl1440\\margr1440\\margt1440\\margb1440\n' +
      '\\widowctrl\\hyphauto\n' +
      '{\\header\\pard\\qc\\f1\\fs18\\cf1 EveryStampDuty.com | Premium Draft Legal Document | Not a legal execution\\par}\n' +
      `\\pard\\qc\\f0\\fs32\\b\\cf1 ${titleFmt}\\b0\\fs24\\par\n` +
      '\\pard\\qc\\f1\\fs16\\i Generated via EveryStampDuty.com | Interactive Legal Drafting Suite\\i0\\par\n' +
      '\\pard\\qc\\f1\\fs16\\cf4 DRAFT FOR ADVOCATE REVIEW ONLY\\cf0\\par\n' +
      '\\pard\\par\n' +
      '{\\pard\\f0\\fs22\\sa120\\sl360\\slmult1\n' +
      escaped +
      '\\par}\n' +
      '\\pard\\par\n' +
      '{\\pard\\qc\\f1\\fs16\\cf4\\b IMPORTANT LEGAL DISCLAIMER:\\b0\\cf0 This draft has been generated for guidance and reference purposes only. It is strongly recommended to get this document finalized by a qualified advocate/solicitor before executing it on stamp paper.\\par}\n' +
      '}';

    const blob = new Blob([rtfContent], { type: 'application/rtf;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `esd_draft_${deedType}_${new Date().toISOString().split('T')[0]}.rtf`;
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
            <h1>Premium Interactive Legal Drafting Suite</h1>
            <p>Draft professional Indian deeds dynamically, verify legally precise annexures and download editable Microsoft Word RTF files</p>
          </div>
        </div>
        <button className="subpage-close" onClick={onClose}>✕ Close Toolkit</button>
      </div>

      <div className="draft-grid">
        <div className="card control-card">
          <div className="gcard-header">
            <span className="gcard-icon">⚙️</span>
            <h2>Configure Deed Fields</h2>
          </div>

          {/* Deed Category Tabs */}
          <div className="deed-tabs-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {[
              { id: 'rental', label: '🏠 Rent/Lease' },
              { id: 'sale', label: '📋 Sale Deed' },
              { id: 'mortgage', label: '🏦 Mortgage' },
              { id: 'gift', label: '🎁 Gift Deed' },
              { id: 'partnership', label: '🤝 Partnership' },
              { id: 'will', label: '📜 Will/Testament' },
              { id: 'poa', label: '📋 Power of Atty' }
            ].map(t => (
              <button
                key={t.id}
                className={`abtn ${deedType === t.id ? 'primary' : ''}`}
                style={{
                  flex: '1 1 auto',
                  padding: '8px 12px',
                  fontSize: '12px',
                  borderRadius: '6px',
                  border: '1px solid var(--bdr)',
                  cursor: 'pointer',
                  background: deedType === t.id ? 'var(--nv)' : 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  transition: 'all 0.2s'
                }}
                onClick={() => setDeedType(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Configuration Form */}
          <div className="deed-form-scroll" style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '6px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* SECTION 1: EXECUTION DETAILS */}
            <div className="form-section">
              <h3 style={{ fontSize: '12px', color: 'var(--sf)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>1. Execution Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="fg">
                  <label>Date of Execution</label>
                  <input type="date" value={formData.date} onChange={e => handleInputChange('date', e.target.value)} />
                </div>
                <div className="fg">
                  <label>Place of Execution</label>
                  <input type="text" value={formData.place} onChange={e => handleInputChange('place', e.target.value)} />
                </div>
              </div>
            </div>

            {/* SECTION 2: FIRST PARTY */}
            <div className="form-section">
              <h3 style={{ fontSize: '12px', color: 'var(--sf)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>2. {labels.p1}</h3>
              <div className="fg" style={{ marginBottom: '8px' }}>
                <label>Full Name</label>
                <input type="text" value={formData.p1} onChange={e => handleInputChange('p1', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div className="fg">
                  <label>Father's / Husband's Name</label>
                  <input type="text" value={formData.p1father} placeholder="s/o or w/o..." onChange={e => handleInputChange('p1father', e.target.value)} />
                </div>
                <div className="fg">
                  <label>Age (Years)</label>
                  <input type="number" value={formData.p1age} onChange={e => handleInputChange('p1age', e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div className="fg">
                  <label>ID proof / Aadhaar / PAN</label>
                  <input type="text" value={formData.p1id} placeholder="e.g. Aadhaar/PAN..." onChange={e => handleInputChange('p1id', e.target.value)} />
                </div>
                <div className="fg">
                  <label>Who Pays Stamp Duty?</label>
                  <select value={formData.paidby} onChange={e => handleInputChange('paidby', e.target.value)}>
                    <option value="first">First Party ({labels.p1role})</option>
                    <option value="second">Second Party ({labels.p2role})</option>
                    <option value="both">Both Equally</option>
                  </select>
                </div>
              </div>
              <div className="fg">
                <label>Permanent Residential Address</label>
                <textarea rows="2" value={formData.p1addr} onChange={e => handleInputChange('p1addr', e.target.value)} />
              </div>
            </div>

            {/* SECTION 3: SECOND PARTY */}
            <div className="form-section">
              <h3 style={{ fontSize: '12px', color: 'var(--sf)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>3. {labels.p2}</h3>
              <div className="fg" style={{ marginBottom: '8px' }}>
                <label>Full Name</label>
                <input type="text" value={formData.p2} onChange={e => handleInputChange('p2', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div className="fg">
                  <label>Father's / Husband's Name</label>
                  <input type="text" value={formData.p2father} placeholder="s/o or w/o..." onChange={e => handleInputChange('p2father', e.target.value)} />
                </div>
                <div className="fg">
                  <label>Age (Years)</label>
                  <input type="number" value={formData.p2age} onChange={e => handleInputChange('p2age', e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div className="fg">
                  <label>ID proof / Aadhaar / PAN</label>
                  <input type="text" value={formData.p2id} placeholder="e.g. Aadhaar/PAN..." onChange={e => handleInputChange('p2id', e.target.value)} />
                </div>
                <div className="fg">
                  <label>Estimated Stamp Duty Paid</label>
                  <input type="text" value={formData.totalDuty} onChange={e => handleInputChange('totalDuty', e.target.value)} />
                </div>
              </div>
              <div className="fg">
                <label>Permanent Residential Address</label>
                <textarea rows="2" value={formData.p2addr} onChange={e => handleInputChange('p2addr', e.target.value)} />
              </div>
            </div>

            {/* SECTION 4: PROPERTY DETAILS */}
            <div className="form-section">
              <h3 style={{ fontSize: '12px', color: 'var(--sf)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>4. Property Description</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div className="fg">
                  <label>Property Description / Unit No.</label>
                  <input type="text" value={formData.prop} placeholder="e.g. Flat No. 202..." onChange={e => handleInputChange('prop', e.target.value)} />
                </div>
                <div className="fg">
                  <label>Super Builtup Area</label>
                  <input type="text" value={formData.area} placeholder="e.g. 1,200 sq.ft." onChange={e => handleInputChange('area', e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div className="fg">
                  <label>Survey / CTS / Site No.</label>
                  <input type="text" value={formData.survey} placeholder="e.g. Survey No. 45/2B" onChange={e => handleInputChange('survey', e.target.value)} />
                </div>
                <div className="fg">
                  <label>Parking Spaces</label>
                  <input type="text" value={formData.parking} placeholder="e.g. 1 Car Parking..." onChange={e => handleInputChange('parking', e.target.value)} />
                </div>
              </div>
              <div className="fg">
                <label>Full Property Address</label>
                <textarea rows="2" value={formData.propAddr} placeholder="Exact physical address of property..." onChange={e => handleInputChange('propAddr', e.target.value)} />
              </div>
            </div>

            {/* SECTION 5: CATEGORY SPECIFIC FIELDS */}
            {deedType === 'rental' && (
              <div className="form-section">
                <h3 style={{ fontSize: '12px', color: 'var(--sf)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>5. Lease & Financial Terms</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div className="fg">
                    <label>Monthly Rent (Rs.)</label>
                    <input type="number" value={formData.rent} onChange={e => handleInputChange('rent', e.target.value)} />
                  </div>
                  <div className="fg">
                    <label>Security Deposit (Rs.)</label>
                    <input type="number" value={formData.deposit} onChange={e => handleInputChange('deposit', e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div className="fg">
                    <label>Escalation Per Annum (%)</label>
                    <input type="number" value={formData.escalation} onChange={e => handleInputChange('escalation', e.target.value)} />
                  </div>
                  <div className="fg">
                    <label>Rent Due Day</label>
                    <input type="text" value={formData.rentdue} placeholder="e.g. 5th day" onChange={e => handleInputChange('rentdue', e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div className="fg">
                    <label>Lock-in Period</label>
                    <input type="text" value={formData.lockin} onChange={e => handleInputChange('lockin', e.target.value)} />
                  </div>
                  <div className="fg">
                    <label>Notice Period</label>
                    <input type="text" value={formData.notice} onChange={e => handleInputChange('notice', e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div className="fg">
                    <label>Electricity Bill Responsibility</label>
                    <input type="text" value={formData.elec} onChange={e => handleInputChange('elec', e.target.value)} />
                  </div>
                  <div className="fg">
                    <label>Water Charge Responsibility</label>
                    <input type="text" value={formData.water} onChange={e => handleInputChange('water', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {deedType === 'sale' && (
              <div className="form-section">
                <h3 style={{ fontSize: '12px', color: 'var(--sf)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>5. Sale Agreement Terms</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div className="fg">
                    <label>Total Price / Consideration (Rs.)</label>
                    <input type="number" value={formData.saleAmt} onChange={e => handleInputChange('saleAmt', e.target.value)} />
                  </div>
                  <div className="fg">
                    <label>Guideline Market Value (Rs.)</label>
                    <input type="number" value={formData.saleMV} onChange={e => handleInputChange('saleMV', e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div className="fg">
                    <label>Advance Token Amount (Rs.)</label>
                    <input type="number" value={formData.saleToken} onChange={e => handleInputChange('saleToken', e.target.value)} />
                  </div>
                  <div className="fg">
                    <label>Possession Handover Condition</label>
                    <input type="text" value={formData.salePoss} onChange={e => handleInputChange('salePoss', e.target.value)} />
                  </div>
                </div>
                <div className="fg">
                  <label>Title Warranty Condition</label>
                  <input type="text" value={formData.saleEnc} onChange={e => handleInputChange('saleEnc', e.target.value)} />
                </div>
              </div>
            )}

            {deedType === 'mortgage' && (
              <div className="form-section">
                <h3 style={{ fontSize: '12px', color: 'var(--sf)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>5. Mortgage Loan Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div className="fg">
                    <label>Loan Amount (Rs.)</label>
                    <input type="number" value={formData.mortAmt} onChange={e => handleInputChange('mortAmt', e.target.value)} />
                  </div>
                  <div className="fg">
                    <label>Interest Rate (% p.a.)</label>
                    <input type="number" step="0.1" value={formData.mortRate} onChange={e => handleInputChange('mortRate', e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div className="fg">
                    <label>Tenure / Duration</label>
                    <input type="text" value={formData.mortTenure} placeholder="e.g. 120 months" onChange={e => handleInputChange('mortTenure', e.target.value)} />
                  </div>
                  <div className="fg">
                    <label>Approx Monthly EMI (Rs.)</label>
                    <input type="number" value={formData.mortEMI} onChange={e => handleInputChange('mortEMI', e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div className="fg">
                    <label>Mortgage Purpose</label>
                    <input type="text" value={formData.mortPurpose} onChange={e => handleInputChange('mortPurpose', e.target.value)} />
                  </div>
                  <div className="fg">
                    <label>Mortgage Category / Type</label>
                    <input type="text" value={formData.mortType} onChange={e => handleInputChange('mortType', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {deedType === 'gift' && (
              <div className="form-section">
                <h3 style={{ fontSize: '12px', color: 'var(--sf)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>5. Gift Relationship & Exemption</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div className="fg">
                    <label>Estimated Market Value (Rs.)</label>
                    <input type="number" value={formData.giftVal} onChange={e => handleInputChange('giftVal', e.target.value)} />
                  </div>
                  <div className="fg">
                    <label>Donor-Donee Relationship</label>
                    <input type="text" value={formData.giftRel} placeholder="e.g. Son, Daughter, Spouse..." onChange={e => handleInputChange('giftRel', e.target.value)} />
                  </div>
                </div>
                <div className="fg">
                  <label>Reason for Gift Transfer</label>
                  <input type="text" value={formData.giftReason} onChange={e => handleInputChange('giftReason', e.target.value)} />
                </div>
              </div>
            )}

            {deedType === 'partnership' && (
              <div className="form-section">
                <h3 style={{ fontSize: '12px', color: 'var(--sf)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>5. Partnership Agreement Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div className="fg">
                    <label>Firm Name</label>
                    <input type="text" value={formData.firmName} onChange={e => handleInputChange('firmName', e.target.value)} />
                  </div>
                  <div className="fg">
                    <label>Total Capital (Rs.)</label>
                    <input type="number" value={formData.firmCap} onChange={e => handleInputChange('firmCap', e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div className="fg">
                    <label>Partner 1 Contribution (Rs.)</label>
                    <input type="number" value={formData.p1Cap} onChange={e => handleInputChange('p1Cap', e.target.value)} />
                  </div>
                  <div className="fg">
                    <label>Partner 2 Contribution (Rs.)</label>
                    <input type="number" value={formData.p2Cap} onChange={e => handleInputChange('p2Cap', e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div className="fg">
                    <label>Profit/Loss Ratio</label>
                    <input type="text" value={formData.profitRatio} onChange={e => handleInputChange('profitRatio', e.target.value)} />
                  </div>
                  <div className="fg">
                    <label>Principal Banker</label>
                    <input type="text" value={formData.firmBank} onChange={e => handleInputChange('firmBank', e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div className="fg">
                    <label>Interest on Capital (%)</label>
                    <input type="text" value={formData.firmInterest} onChange={e => handleInputChange('firmInterest', e.target.value)} />
                  </div>
                  <div className="fg">
                    <label>Principal Nature of Business</label>
                    <input type="text" value={formData.bizNature} onChange={e => handleInputChange('bizNature', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {deedType === 'will' && (
              <div className="form-section">
                <h3 style={{ fontSize: '12px', color: 'var(--sf)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>5. Will Executions & Beneficiaries</h3>
                <div className="fg" style={{ marginBottom: '8px' }}>
                  <label>Sole Executor of Will</label>
                  <input type="text" value={formData.willExecutor} placeholder="Name of Executor..." onChange={e => handleInputChange('willExecutor', e.target.value)} />
                </div>
                <div className="fg" style={{ marginBottom: '8px' }}>
                  <label>List of Assets Bequeathed</label>
                  <textarea rows="3" value={formData.willAssets} placeholder="List all real estate, bank savings, deposits..." onChange={e => handleInputChange('willAssets', e.target.value)} />
                </div>
                <div className="fg">
                  <label>Beneficiary Shares Description</label>
                  <textarea rows="3" value={formData.willBeneficiary} placeholder="List beneficiaries and their corresponding shares..." onChange={e => handleInputChange('willBeneficiary', e.target.value)} />
                </div>
              </div>
            )}

            {deedType === 'poa' && (
              <div className="form-section">
                <h3 style={{ fontSize: '12px', color: 'var(--sf)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>5. Power of Attorney Mandates</h3>
                <div className="fg" style={{ marginBottom: '8px' }}>
                  <label>Subject Property / Land Matter</label>
                  <input type="text" value={formData.poaProp} placeholder="Define property or matter..." onChange={e => handleInputChange('poaProp', e.target.value)} />
                </div>
                <div className="fg" style={{ marginBottom: '8px' }}>
                  <label>Validity of Mandate</label>
                  <input type="text" value={formData.poaValidity} onChange={e => handleInputChange('poaValidity', e.target.value)} />
                </div>
                <div className="fg" style={{ marginBottom: '8px' }}>
                  <label>Powers & Covenants Granted</label>
                  <textarea rows="3" value={formData.poaPowers} placeholder="List specific tasks agent is empowered to perform..." onChange={e => handleInputChange('poaPowers', e.target.value)} />
                </div>
              </div>
            )}

            {/* SECTION 6: WITNESS DETAILS */}
            <div className="form-section">
              <h3 style={{ fontSize: '12px', color: 'var(--sf)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>6. Witness Attestation</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="fg">
                  <label>Witness 1 Full Name</label>
                  <input type="text" value={formData.w1} onChange={e => handleInputChange('w1', e.target.value)} />
                </div>
                <div className="fg">
                  <label>Witness 2 Full Name</label>
                  <input type="text" value={formData.w2} onChange={e => handleInputChange('w2', e.target.value)} />
                </div>
              </div>
            </div>

          </div>

          <div className="draft-actions-wrap">
            <button className="download-rtf-btn" onClick={downloadRtf}>
              📥 Download Word-Compatible Document (.rtf)
            </button>
            <p className="download-hint">⚠️ Downloaded file opens natively in Microsoft Word, Google Docs, or LibreOffice, preserving original layouts and legal margins.</p>
          </div>
        </div>

        {/* Legal Paper Live Preview */}
        <div className="card preview-card" style={{ display: 'flex', flexDirection: 'column' }}>
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
              <pre className="legal-pre">{draftText}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
