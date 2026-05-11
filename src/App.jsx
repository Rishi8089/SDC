import React, { useState, useEffect } from 'react';
import './App.css';
import { STATES } from './data/states';
import { INSTRUMENTS } from './data/instruments';
import { EXPERT_OPINIONS } from './data/expert';
import { INSTRUMENT_REFERENCE } from './data/reference';

const PROVIDERS = {
  claude: {
    name: 'Claude (Anthropic)',
    desc: 'Best for legal document analysis and structured reasoning.',
    link: 'https://console.anthropic.com/',
    linkText: 'Anthropic Console',
    steps: [
      'Sign up or log in with your email / Google account',
      'Go to Settings → API Keys → click Create Key',
      'Copy the key (starts with sk-ant-) and paste below'
    ],
    note: 'Free tier: $5 credits on sign-up. Paid plans available. Supports PDF + image upload.'
  },
  gemini: {
    name: 'Gemini (Google)',
    desc: 'Native integration with Google Cloud and high processing speed.',
    link: 'https://aistudio.google.com/',
    linkText: 'Google AI Studio',
    steps: [
      'Log in with your Google Workspace / Gmail account',
      'Click on "Get API Key" in the sidebar',
      'Create key in new project and copy (starts with AIza...)'
    ],
    note: 'Generous free tier (up to 15 requests/min). High context window for long deeds.'
  },
  chatgpt: {
    name: 'ChatGPT (OpenAI)',
    desc: 'Highly reliable with GPT-4o capabilities for clause extraction.',
    link: 'https://platform.openai.com/',
    linkText: 'OpenAI Platform',
    steps: [
      'Log in to your OpenAI dashboard',
      'Navigate to API Keys → Create new secret key',
      'Copy the key (starts with sk-) and paste below'
    ],
    note: 'Requires credit balance for API usage. Best for specific clause analysis.'
  },
  copilot: {
    name: 'Copilot (Microsoft)',
    desc: 'Azure-powered enterprise grade security for sensitive legal data.',
    link: 'https://portal.azure.com/',
    linkText: 'Azure OpenAI Portal',
    steps: [
      'Log in to Azure Portal',
      'Search for Azure OpenAI Service and create resource',
      'Copy Key 1 from "Keys and Endpoint" section'
    ],
    note: 'Enterprise focused. Requires Azure subscription and model deployment.'
  }
};

function App() {
  const [mode, setMode] = useState('calc'); // 'calc' or 'ai'
  const [selectedState, setSelectedState] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [gender, setGender] = useState('male');
  const [ptype, setPtype] = useState('residential');
  const [pval, setPval] = useState('');
  const [circle, setCircle] = useState('');
  const [loan, setLoan] = useState('');
  const [mortprop, setMortprop] = useState('');
  const [advance, setAdvance] = useState('');
  const [leasePeriodType, setLeasePeriodType] = useState('months');
  const [leaseMonths, setLeaseMonths] = useState('');
  const [rent, setRent] = useState('');
  const [partval, setPartval] = useState('');
  const [nshares, setNshares] = useState('2');
  const [poaval, setPoaval] = useState('');
  const [partcap, setPartcap] = useState('');
  const [partnew, setPartnew] = useState('new');
  const [shareval, setShareval] = useState('');
  const [sharefv, setSharefv] = useState('');
  const [debval, setDebval] = useState('');
  const [pronote, setPronote] = useState('');
  const [usance, setUsance] = useState('');
  const [loanamt, setLoanamt] = useState('');
  const [autcap, setAutcap] = useState('');
  const [area, setArea] = useState('');

  const [result, setResult] = useState(null);
  const [showRates, setShowRates] = useState(false);
  const [showInstrRef, setShowInstrRef] = useState(false);

  // AI State
  const [aiState, setAiState] = useState('');
  const [aiNotes, setAiNotes] = useState('');
  const [aiApiKey, setAiApiKey] = useState('');
  const [selectedAI, setSelectedAI] = useState('claude');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [file, setFile] = useState(null);

  const inst = INSTRUMENTS[selectedCat] || {};

  const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
  const pct = (r) => {
    if (r == null) return '—';
    let s = parseFloat(r).toFixed(4);
    while (s.endsWith('0')) s = s.slice(0, -1);
    if (s.endsWith('.')) s = s.slice(0, -1);
    return s + '%';
  };

  const slabCalc = (val, slabs, genderKey) => {
    let stamp = 0, prev = 0;
    const isFem = genderKey === 'female' || genderKey === 'joint_f';
    for (const s of slabs) {
      const band = Math.min(val, s.upto) - prev;
      if (band > 0) stamp += band * ((isFem ? s.female : s.male) / 100);
      prev = s.upto;
      if (val <= s.upto) break;
    }
    return stamp;
  };

  const calculate = () => {
    if (!selectedState) { alert('Please select a state / UT.'); return; }
    if (!selectedCat) { alert('Please select an instrument category.'); return; }
    
    const r = STATES[selectedState];
    const gkey = gender;
    let lines = [];
    let total = 0;
    const val = (v) => parseFloat(v) || 0;

    // Fixed Duty Check
    const FIXED = {
      affidavit: { duty: 50, reg: 0, art: 'Art.4 ISA 1899', note: 'Fixed nominal duty. No mandatory registration.' },
      notarial_act: { duty: 20, reg: 0, art: 'Art.43 ISA 1899', note: '₹20 per notarial act. Notaries Act 1952.' },
      loa_shares: { duty: 1, reg: 0, art: 'Art.37 ISA 1899', note: 'Letter of Allotment — ₹1 fixed.' },
      receipt: { duty: 1, reg: 0, art: 'Art.53 ISA 1899', note: 'Not on cheques or e-payments.' },
      adoption: { duty: 100, reg: 200, art: 'Art.3 ISA 1899', note: 'Registration mandatory under Hindu Adoptions Act.' },
      aoa: { duty: 200, reg: 0, art: 'AoA — fixed', note: 'Filed with MoA at ROC.' },
      will: { duty: 200, reg: 200, art: 'Art.62 ISA 1899', note: 'Codicil: ₹500. Registration optional but highly advised.' },
      divorce_deed: { duty: 100, reg: 100, art: 'Nominal', note: 'Court decree fees are separate.' },
    };

    if (FIXED[selectedCat]) {
      const fd = FIXED[selectedCat];
      lines.push({ n: 'Stamp duty (' + selectedCat.replace(/_/g, ' ') + ')', r: 'Fixed (' + fd.art + ')', v: fd.duty, note: fd.note });
      if (fd.reg > 0) lines.push({ n: 'Registration fee', r: 'Fixed', v: fd.reg });
      total = fd.duty + (fd.reg || 0);
      setResult({ total, lines, baseValue: total, br: 0 });
      return;
    }

    // Partnership / LLP
    if (selectedCat === 'partnership' || selectedCat === 'llp') {
      const cap = val(partcap);
      let duty = 500, note = '';
      if (partnew === 'dissolution') { duty = 500; note = 'Dissolution deed — ₹500'; }
      else if (partnew === 'amendment') { duty = 200; note = 'Amendment deed — ₹200'; }
      else {
        if (!cap) { duty = 500; note = 'Min ₹500 (enter capital for accurate rate)'; }
        else if (cap <= 100000) { duty = 500; note = 'Capital ≤₹1L → ₹500 (Art.46 ISA)'; }
        else if (cap <= 500000) { duty = 1000; note = 'Capital ₹1–5L → ₹1,000'; }
        else if (cap <= 1000000) { duty = 2000; note = 'Capital ₹5–10L → ₹2,000'; }
        else if (cap <= 5000000) { duty = 3000; note = 'Capital ₹10–50L → ₹3,000'; }
        else { duty = 5000; note = 'Capital >₹50L → ₹5,000'; }
        if (selectedState === 'MH') { duty = 1000; note = 'Maharashtra: ₹1,000 (new deed)'; }
        if (selectedState === 'DL') { duty = 500; note = 'Delhi: ₹500 fixed'; }
        if (selectedState === 'KA') { duty = 500 + Math.min(Math.floor((cap - 100000) / 100000) * 200, 4500); note = 'Karnataka: ₹500 + ₹200/₹1L additional capital'; }
      }
      lines.push({ n: (selectedCat === 'llp' ? 'LLP Agreement' : 'Partnership Deed') + ' — stamp duty', r: 'Fixed/Slab', v: duty, note: note });
      lines.push({ n: 'Registration fee (Registrar of Firms)', r: 'Fixed', v: 200 });
      total = duty + 200;
      setResult({ total, lines, baseValue: cap || 0, br: 0 });
      return;
    }

    // MOA
    if (selectedCat === 'moa') {
      const ac = val(autcap);
      let duty = 200;
      if (ac > 0) duty = 200 + Math.floor(ac / 500000) * 1000;
      duty = Math.min(duty, 50000000);
      lines.push({ n: 'MoA stamp duty', r: 'Slab', v: duty, note: '₹200 + ₹1,000/₹5L authorised capital' });
      lines.push({ n: 'ROC filing fees (approx)', r: '—', v: 1000, note: 'Actual fees per Companies (Registration Offices) Rules' });
      total = duty + 1000;
      setResult({ total, lines, baseValue: ac, br: 0 });
      return;
    }

    // Commercial Agreements
    if (['sha', 'jv', 'franchise', 'service_agmt'].includes(selectedCat)) {
      const deal = val(pval);
      if (!deal) { alert('Please enter the contract / deal value.'); return; }
      const rate = 0.1, duty = Math.max(200, deal * (rate / 100));
      lines.push({ n: 'Stamp duty (commercial agreement)', r: '0.1% or ₹200 min', v: duty });
      lines.push({ n: 'Registration fee (if registered)', r: '₹200 fixed', v: 200 });
      total = duty + 200;
      setResult({ total, lines, baseValue: deal, br: rate });
      return;
    }

    // Securities
    const SEC_RATES = {
      share_transfer_unlisted: 0.015, share_transfer_listed: 0.015,
      debenture_issue: 0.005, debenture_transfer: 0.0001,
      repo: 0.00001, futures: 0.002, options_exchange: 0.003, options_otc: 0.003,
      other_derivatives: 0.0001, mf_units: 0.005, aif_units: 0.015, warrant_shares: 0.015,
    };
    if (SEC_RATES[selectedCat] !== undefined) {
      const base = (selectedCat === 'debenture_issue' || selectedCat === 'debenture_transfer') ? val(debval) : (val(shareval) || val(pval));
      if (!base) { alert('Please enter the transaction / value amount.'); return; }
      const rate = SEC_RATES[selectedCat];
      const faceV = val(sharefv);
      const taxBase = (faceV > base && selectedCat.startsWith('share_')) ? faceV : base;
      const taxDuty = taxBase * (rate / 100);
      if (faceV > base && selectedCat.startsWith('share_')) lines.push({ n: 'Face value applied (higher than consideration)', r: '—', v: faceV, note: 'FMV rule under Finance Act 2019' });
      lines.push({ n: 'Stamp duty — ' + selectedCat.replace(/_/g, ' '), r: pct(rate) + ' (Finance Act 2019)', v: taxDuty, note: 'Collected by: ' + (selectedCat.includes('listed') || selectedCat === 'futures' || selectedCat === 'options_exchange' ? 'Stock Exchange' : 'Depository / Clearing Corp / State') });
      total = taxDuty;
      setResult({ total, lines, baseValue: taxBase, br: rate });
      return;
    }

    // Negotiable Instruments
    if (['promissory', 'promissory_usance', 'bill_exchange', 'bill_usance'].includes(selectedCat)) {
      const amt = val(pronote);
      if (!amt) { alert('Please enter the note / bill amount.'); return; }
      const usanceMo = val(usance);
      let rate = 0.5, note = 'On demand — Art.49/13 ISA';
      if (selectedCat.includes('usance')) {
        rate = usanceMo <= 3 ? 0.25 : 0.5;
        note = 'Usance ' + usanceMo + ' months — ' + (usanceMo <= 3 ? '0.25%' : '0.5%');
      }
      const duty = amt * (rate / 100);
      lines.push({ n: (selectedCat.includes('bill') ? 'Bill of Exchange' : 'Promissory Note') + ' — stamp duty', r: pct(rate), v: duty, note: note });
      total = duty;
      setResult({ total, lines, baseValue: amt, br: rate });
      return;
    }

    // Lease logic
    if (selectedCat === 'lease') {
      const adv = val(advance);
      const rentIn = val(rent);
      const periodVal = Math.max(1, parseInt(leaseMonths) || 1);
      if (!rentIn && !adv) { alert('Please enter rent amount or advance/deposit.'); return; }

      let totalMonths, annualRent;
      if (leasePeriodType === 'years') {
        totalMonths = periodVal * 12;
        annualRent = rentIn;
      } else {
        totalMonths = periodVal;
        annualRent = rentIn * 12;
      }
      const totalYears = totalMonths / 12;
      const monthlyRent = annualRent / 12;

      let duty = 0, lrNote = '', regMandatory = false, regFee = 0;
      const pctOf = (rate, b) => b * (rate / 100);

      const sk = selectedState;
      if (sk === 'MH') {
        const totalRentVal = monthlyRent * totalMonths;
        const notionalInt = adv * 0.10 * totalYears;
        const taxBase = totalRentVal + notionalInt;
        const rate = totalMonths <= 60 ? 0.25 : 0.5;
        duty = Math.max(100, pctOf(rate, taxBase));
        lrNote = `MSA Art.36A: ${rate}% of (total rent + 10% notional interest).`;
        regMandatory = true;
        regFee = Math.max(1000, taxBase * 0.01);
        lines.push({ n: 'Total rent', r: '—', v: totalRentVal });
        if (adv > 0) lines.push({ n: 'Notional interest on deposit (10% p.a.)', r: '10%', v: notionalInt });
      } else if (sk === 'DL') {
        if (totalMonths <= 11) { duty = 50; lrNote = 'Delhi ≤11 months: ₹50'; }
        else if (totalYears <= 5) { duty = pctOf(2, annualRent + adv); lrNote = 'Delhi 1–5 yrs: 2%'; regMandatory = true; }
        else { duty = pctOf(3, annualRent + adv); lrNote = 'Delhi >5 yrs: 3%'; regMandatory = true; }
        regFee = totalMonths > 11 ? 1100 : 0;
      } else if (sk === 'KA') {
        if (totalMonths <= 11) { duty = 20; lrNote = 'Karnataka ≤11 months: ₹20'; }
        else if (totalYears <= 5) { duty = Math.max(500, pctOf(1, annualRent + adv)); lrNote = 'Karnataka 1–5 yrs: 1%'; regMandatory = true; }
        else { duty = pctOf(2, annualRent + adv); lrNote = 'Karnataka >5 yrs: 2%'; regMandatory = true; }
        regFee = totalMonths > 11 ? Math.min(5000, (annualRent + adv) * 0.01) : 0;
      } else if (sk === 'TN') {
        const base = (monthlyRent * totalMonths) + adv;
        duty = pctOf(1, base);
        lrNote = 'Tamil Nadu: 1% of total rent + deposit.';
        regMandatory = totalMonths > 11;
        regFee = regMandatory ? Math.min(20000, base * 0.04) : 0;
      } else if (sk === 'KL') {
        if (totalMonths <= 11) { duty = 500; lrNote = 'Kerala ≤11 months: ₹500'; regMandatory = true; }
        else { duty = pctOf(8, annualRent + adv); lrNote = 'Kerala >11 months: 8%'; regMandatory = true; }
        regFee = totalMonths <= 11 ? 1000 : Math.min(15000, (annualRent + adv) * 0.02);
      } else if (sk === 'UP') {
        if (totalMonths <= 11) { duty = 200; lrNote = 'UP ≤11 months: ₹200'; }
        else {
          if (annualRent <= 200000) duty = totalYears <= 1 ? 500 : totalYears <= 5 ? 1500 : 2000;
          else if (annualRent <= 600000) duty = totalYears <= 1 ? 1500 : totalYears <= 5 ? 4500 : 7500;
          else duty = totalYears <= 1 ? 2500 : totalYears <= 5 ? 6000 : 10000;
          regMandatory = true;
        }
        regFee = regMandatory ? duty : 0;
      } else {
        const base = annualRent + adv;
        if (totalMonths <= 11) { duty = 200; lrNote = 'Standard: ₹200 fixed'; }
        else if (totalYears <= 5) { duty = pctOf(2, base); lrNote = '1–5 yrs: 2%'; regMandatory = true; }
        else { duty = pctOf(3, base); lrNote = '5+ yrs: 3%'; regMandatory = true; }
        regFee = regMandatory ? Math.min((r.regCap || Infinity), base * (r.reg / 100)) : 0;
      }

      lines.push({ n: 'Stamp duty (Lease)', r: 'Calculated', v: duty, note: lrNote });
      if (regFee > 0) lines.push({ n: 'Registration fee', r: '—', v: regFee });
      total = duty + regFee;
      setResult({ total, lines, baseValue: annualRent + adv, br: 0 });
      return;
    }

    // Conveyance Family
    const pvalVal = val(pval), circleVal = val(circle);
    if (!pvalVal && !['mortgage', 'partition'].includes(selectedCat)) { alert('Please enter the property / asset value.'); return; }
    const propertyVal = Math.max(pvalVal, circleVal);
    if (circleVal > pvalVal) lines.push({ n: 'Circle rate applied (higher)', r: '—', v: circleVal });

    let sd = 0, br = 0;
    if (selectedCat === 'mortgage') {
      const ln = val(loan);
      const mr = r.mortgage || 0.5;
      sd = ln * (mr / 100);
      const instTitle = document.querySelector(`option[value="${selectedCat}"]`)?.textContent || selectedCat.replace(/_/g, ' ');
      lines.push({ n: 'Stamp duty — ' + instTitle + ' (Art.' + (r.art || '40') + ' ISA)', r: pct(mr), v: sd });
      let rf = ln * (r.reg / 100); if (r.regCap && rf > r.regCap) rf = r.regCap;
      lines.push({ n: 'Registration fee (Reg. Act 1908)', r: pct(r.reg), v: rf });
      total = sd + rf;
      setResult({ total, lines, baseValue: ln, br: mr, reg: r.reg, state: r });
    } else if (selectedCat === 'partition') {
      const pv = val(partval), ns = Math.max(2, parseInt(nshares) || 2);
      const sv1 = pv / ns;
      const pr = r.partition || 2;
      sd = sv1 * (pr / 100);
      const instTitle = document.querySelector(`option[value="${selectedCat}"]`)?.textContent || selectedCat.replace(/_/g, ' ');
      lines.push({ n: 'Stamp duty — ' + instTitle + ' (Art.' + (r.art || '45') + ' ISA)', r: pct(pr), v: sd });
      const rf = sv1 * (r.reg / 100);
      lines.push({ n: 'Registration fee (Reg. Act 1908)', r: pct(r.reg), v: rf });
      total = sd + rf;
      setResult({ total, lines, baseValue: sv1, br: pr, reg: r.reg, state: r });
    } else {
      if (r.useSlab) { sd = slabCalc(propertyVal, r.slabs, gkey); br = (sd / propertyVal) * 100; }
      else { br = r.base[gkey] || r.base.male; sd = propertyVal * (br / 100); }
      const instTitle = document.querySelector(`option[value="${selectedCat}"]`)?.textContent || selectedCat.replace(/_/g, ' ');
      lines.push({ n: 'Stamp duty — ' + instTitle + ' (Art.' + (r.art || '23') + ' ISA)', r: pct(br), v: sd });
      if (r.surcharge) { const sc = sd * (r.surcharge / 100); lines.push({ n: 'Stamp duty surcharge (' + r.surcharge + '%)', r: r.surcharge + '%', v: sc }); sd += sc; }
      let rf = propertyVal * (r.reg / 100); if (r.regCap && rf > r.regCap) rf = r.regCap;
      lines.push({ n: 'Registration fee (Reg. Act 1908)', r: pct(r.reg), v: rf });
      total = sd + rf;
      setResult({ total, lines, baseValue: propertyVal, br: br, reg: r.reg, state: r });
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      if (f.size > 5 * 1024 * 1024) { alert('File too large. Max 5MB.'); return; }
      setFile(f);
    }
  };

  const analyzeDoc = async () => {
    if (!file && !aiNotes) { alert('Please upload a document or describe it.'); return; }
    if (!aiApiKey) { alert('Please enter your API key.'); return; }
    setIsAnalyzing(true);
    setAiResult('');
    // Mocking AI response for now as per HTML behavior
    setTimeout(() => {
      setIsAnalyzing(false);
      setAiResult('Based on your description/file, this appears to be a <b>Sale Deed</b> for a residential property. Expected Stamp Duty in ' + (aiState || 'the selected state') + ' would be approximately ' + (aiState === 'MH' ? '5–6%' : '4–7%') + ' plus registration fees.');
    }, 2000);
  };

  return (
    <div className="App">
      <header>
        <div className="container">
          <div className="header-inner">
            <div className="logo">
              <div className="logo-icon">🏛️</div>
              <div className="logo-text">Stamp<span>Calc</span> India</div>
            </div>
            <div className="hpills">
              <span className="hpill">ISA 1899 · Finance Act 2019 · Rules 2019</span>
              <span className="hpill">Registration Act 1908</span>
              <span className="hpill">All 36 States & UTs</span>
              <span className="hpill green">FY 2026–27 Updated</span>
              <span className="hpill red">Not Legal Advice</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="hero">
          <div className="hero-eyebrow">India's most comprehensive</div>
          <h1>Stamp Duty Calculator<br /><em>Every Instrument. Every Act. Every State.</em></h1>
          <p className="hero-sub">Covering Indian Stamp Act 1899 · Finance Act 2019 · SEBI/Depository Rules 2019 · SCRA 1956 · State Stamp Acts · Registration Act 1908 — with AI-powered document analysis.</p>
          <div className="stats-row">
            <div className="stat-pill"><span className="stat-num">36</span><span className="stat-label">States & UTs</span></div>
            <div className="stat-pill"><span className="stat-num">55+</span><span className="stat-label">Instrument Types</span></div>
            <div className="stat-pill"><span className="stat-num">12</span><span className="stat-label">Governing Acts</span></div>
            <div className="stat-pill"><span className="stat-num">AI</span><span className="stat-label">Doc Analysis</span></div>
          </div>
        </div>

        <div className="main-grid">
          <div className="left-panel">
            <div className="mode-tabs">
              <div className={`mode-tab ${mode === 'calc' ? 'active' : ''}`} onClick={() => setMode('calc')}><span className="ti">🧮</span>Calculator</div>
              <div className={`mode-tab ${mode === 'ai' ? 'active' : ''}`} onClick={() => setMode('ai')}><span className="ti">🤖</span>AI Document Analysis</div>
            </div>

            {mode === 'calc' ? (
              <div className="card">
                <div className="card-title">Instrument & Transaction Details</div>
                <div className="form-grid">
                  <div className="fg">
                    <label>State / Union Territory</label>
                    <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                      <option value="">— Select —</option>
                      {Object.entries(STATES).map(([code, s]) => <option key={code} value={code}>{s.name}</option>)}
                    </select>
                  </div>

                  <div className="fg">
                    <label>Instrument Category</label>
                    <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)}>
                      <option value="">— Select instrument —</option>
                      <optgroup label="── Immovable Property ──">
                        <option value="sale">Sale / Conveyance Deed</option>
                        <option value="gift_prop">Gift Deed (Property)</option>
                        <option value="mortgage">Mortgage Deed (Simple/Equitable)</option>
                        <option value="lease">Lease / Rental / Licence Deed</option>
                        <option value="exchange">Exchange / Swap Deed</option>
                        <option value="partition">Partition Deed</option>
                        <option value="release">Release / Relinquishment Deed</option>
                        <option value="settlement">Settlement Deed</option>
                        <option value="agreement_sale">Agreement for Sale</option>
                        <option value="development">Development Agreement</option>
                        <option value="construction">Construction Agreement</option>
                      </optgroup>
                      <optgroup label="── Securities (Finance Act 2019 / Rules 2019) ──">
                        <option value="share_transfer_unlisted">Share Transfer — Unlisted (SH-4)</option>
                        <option value="share_transfer_listed">Share Transfer — Listed (Demat / Stock Exchange)</option>
                        <option value="debenture_issue">Debenture / Bond Issue (Primary)</option>
                        <option value="debenture_transfer">Debenture Transfer (Secondary)</option>
                        <option value="repo">Repo / Reverse Repo on Securities</option>
                        <option value="futures">Futures Contract (Exchange Traded)</option>
                        <option value="options_exchange">Options Contract (Exchange Traded)</option>
                        <option value="options_otc">Options on Securities (OTC)</option>
                        <option value="other_derivatives">Other Derivatives (Swaps / CDS / IRS)</option>
                        <option value="mf_units">Mutual Fund Unit Transfer / Redemption</option>
                        <option value="aif_units">AIF / InvIT / REIT Units</option>
                        <option value="loa_shares">Letter of Allotment (Shares)</option>
                        <option value="warrant_shares">Share Warrant</option>
                      </optgroup>
                      <optgroup label="── Business / Corporate ──">
                        <option value="partnership">Partnership Deed</option>
                        <option value="llp">LLP Agreement</option>
                        <option value="moa">Memorandum of Association (MoA)</option>
                        <option value="aoa">Articles of Association (AoA)</option>
                        <option value="sha">Shareholders Agreement (SHA)</option>
                        <option value="jv">Joint Venture Agreement</option>
                        <option value="franchise">Franchise Agreement</option>
                        <option value="service_agmt">Service / Consultancy Agreement</option>
                        <option value="business_transfer">Business Transfer / Slump Sale Deed</option>
                      </optgroup>
                      <optgroup label="── Credit / Loan ──">
                        <option value="loan_agreement">Loan Agreement</option>
                        <option value="hypothecation">Hypothecation Agreement</option>
                        <option value="pledge">Pledge Agreement</option>
                        <option value="bank_guarantee">Bank Guarantee</option>
                        <option value="bond_indemnity">Indemnity Bond</option>
                        <option value="surety_bond">Surety Bond</option>
                      </optgroup>
                      <optgroup label="── Negotiable Instruments ──">
                        <option value="promissory">Promissory Note / Hundi (On Demand)</option>
                        <option value="promissory_usance">Promissory Note (Usance)</option>
                        <option value="bill_exchange">Bill of Exchange (On Demand)</option>
                        <option value="bill_usance">Bill of Exchange (Usance)</option>
                      </optgroup>
                      <optgroup label="── Legal / Notarial / Personal ──">
                        <option value="affidavit">Affidavit / Declaration / Oath</option>
                        <option value="pow_general">Power of Attorney (General — Non Sale)</option>
                        <option value="pow_special">Power of Attorney (Special — Sale)</option>
                        <option value="will">Will / Codicil</option>
                        <option value="adoption">Adoption Deed</option>
                        <option value="divorce_deed">Divorce Deed / Separation MOU</option>
                        <option value="notarial_act">Notarial Act</option>
                        <option value="trust_deed">Trust Deed</option>
                        <option value="receipt">Receipt (&gt;₹5,000)</option>
                        <option value="award_arbitration">Arbitration Award</option>
                        <option value="court_decree">Court Decree / Order</option>
                      </optgroup>
                    </select>
                  </div>

                  {inst.hint && <div className="fg full"><div className="ctx-hint">{inst.hint}</div></div>}

                  {inst.G === 1 && (
                    <div className="fg">
                      <label>Party / Executant</label>
                      <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="male">Individual (Male)</option>
                        <option value="female">Individual (Female)</option>
                        <option value="joint">Joint (Male + Female)</option>
                        <option value="joint_f">Joint (Female + Female)</option>
                        <option value="company">Company / LLP / Trust / HUF</option>
                      </select>
                    </div>
                  )}

                  {inst.PT && (
                    <div className="fg">
                      <label>Property / Asset Type</label>
                      <select value={ptype} onChange={(e) => setPtype(e.target.value)}>
                        <optgroup label="Immovable Property">
                          <option value="residential">Residential (Flat / House / Plot)</option>
                          <option value="commercial">Commercial (Shop / Office / Godown)</option>
                          <option value="agricultural">Agricultural Land</option>
                          <option value="industrial">Industrial / Factory</option>
                          <option value="open_plot">NA Plot / Layout</option>
                        </optgroup>
                        <optgroup label="Movable / Financial Assets">
                          <option value="shares">Shares / Equity</option>
                          <option value="debentures">Debentures / Bonds</option>
                          <option value="mf">Mutual Fund Units</option>
                          <option value="derivatives">Options / Derivatives</option>
                          <option value="vehicle">Vehicle / Machinery</option>
                          <option value="ip">Intellectual Property</option>
                        </optgroup>
                        <optgroup label="Business Interest">
                          <option value="business">Business / Going Concern</option>
                          <option value="goodwill">Goodwill</option>
                          <option value="partnership_share">Partnership Share</option>
                        </optgroup>
                      </select>
                    </div>
                  )}
                  {inst.PV && (
                    <div className="fg">
                      <label>{inst.plab || 'Market Value (₹)'}</label>
                      <div className="pfx"><span className="pfx-sym">₹</span><input type="number" value={pval} onChange={(e) => setPval(e.target.value)} /></div>
                    </div>
                  )}

                  {inst.CV && (
                    <div className="fg">
                      <label>Circle Rate (₹)</label>
                      <div className="pfx"><span className="pfx-sym">₹</span><input type="number" value={circle} onChange={(e) => setCircle(e.target.value)} /></div>
                    </div>
                  )}

                  {inst.LN && (
                    <div className="fg">
                      <label>Loan Amount (₹)</label>
                      <div className="pfx"><span className="pfx-sym">₹</span><input type="number" value={loan} onChange={(e) => setLoan(e.target.value)} /></div>
                    </div>
                  )}

                  {inst.MP && (
                    <div className="fg">
                      <label>Security Property Value (₹)</label>
                      <div className="pfx"><span className="pfx-sym">₹</span><input type="number" value={mortprop} onChange={(e) => setMortprop(e.target.value)} /></div>
                    </div>
                  )}

                  {inst.PX && (
                    <div className="fg">
                      <label>Total Property Value (₹)</label>
                      <div className="pfx"><span className="pfx-sym">₹</span><input type="number" value={partval} onChange={(e) => setPartval(e.target.value)} /></div>
                    </div>
                  )}

                  {inst.NS && (
                    <div className="fg">
                      <label>No. of Co-owners</label>
                      <input type="number" value={nshares} onChange={(e) => setNshares(e.target.value)} />
                    </div>
                  )}

                  {inst.PA && (
                    <div className="fg">
                      <label>Transaction / Property Value (₹)</label>
                      <div className="pfx"><span className="pfx-sym">₹</span><input type="number" value={poaval} onChange={(e) => setPoaval(e.target.value)} /></div>
                    </div>
                  )}

                  {inst.SV && (
                    <div className="fg">
                      <label>{inst.slab || 'Transaction Value (₹)'}</label>
                      <div className="pfx"><span className="pfx-sym">₹</span><input type="number" value={shareval} onChange={(e) => setShareval(e.target.value)} /></div>
                    </div>
                  )}

                  {inst.SF && (
                    <div className="fg">
                      <label>Face Value (₹)</label>
                      <div className="pfx"><span className="pfx-sym">₹</span><input type="number" value={sharefv} onChange={(e) => setSharefv(e.target.value)} /></div>
                    </div>
                  )}

                  {inst.DB && (
                    <div className="fg">
                      <label>Debenture / Bond Value (₹)</label>
                      <div className="pfx"><span className="pfx-sym">₹</span><input type="number" value={debval} onChange={(e) => setDebval(e.target.value)} /></div>
                    </div>
                  )}

                  {inst.PR && (
                    <div className="fg">
                      <label>{inst.prlab || 'Note / Bill Amount (₹)'}</label>
                      <div className="pfx"><span className="pfx-sym">₹</span><input type="number" value={pronote} onChange={(e) => setPronote(e.target.value)} /></div>
                    </div>
                  )}

                  {inst.US && (
                    <div className="fg">
                      <label>Usance Period (months)</label>
                      <input type="number" value={usance} onChange={(e) => setUsance(e.target.value)} />
                    </div>
                  )}

                  {inst.LA && (
                    <div className="fg">
                      <label>{inst.lalab || 'Loan / Agreement Amount (₹)'}</label>
                      <div className="pfx"><span className="pfx-sym">₹</span><input type="number" value={loanamt} onChange={(e) => setLoanamt(e.target.value)} /></div>
                    </div>
                  )}

                  {inst.AC && (
                    <div className="fg">
                      <label>Authorised Share Capital (₹)</label>
                      <div className="pfx"><span className="pfx-sym">₹</span><input type="number" value={autcap} onChange={(e) => setAutcap(e.target.value)} /></div>
                    </div>
                  )}

                  {inst.AR && (
                    <div className="fg full">
                      <label>Area sq.ft. <span style={{ textTransform: 'none', fontWeight: '400', color: 'var(--text3)', fontSize: '9px' }}>(optional)</span></label>
                      <input type="number" value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. 1200" style={{ maxWidth: '200px' }} />
                    </div>
                  )}

                  {selectedCat === 'lease' && (
                    <>
                      <div className="fg">
                        <label>Advance / Deposit (₹)</label>
                        <div className="pfx"><span className="pfx-sym">₹</span><input type="number" value={advance} onChange={(e) => setAdvance(e.target.value)} /></div>
                      </div>
                      <div className="fg">
                        <label>Period Type</label>
                        <select value={leasePeriodType} onChange={(e) => setLeasePeriodType(e.target.value)}>
                          <option value="months">Months</option>
                          <option value="years">Years</option>
                        </select>
                      </div>
                      <div className="fg">
                        <label>{leasePeriodType === 'months' ? 'No. of Months' : 'No. of Years'}</label>
                        <input type="number" value={leaseMonths} onChange={(e) => setLeaseMonths(e.target.value)} />
                      </div>
                      <div className="fg">
                        <label>{leasePeriodType === 'months' ? 'Monthly Rent (₹)' : 'Annual Rent (₹)'}</label>
                        <div className="pfx"><span className="pfx-sym">₹</span><input type="number" value={rent} onChange={(e) => setRent(e.target.value)} /></div>
                      </div>
                    </>
                  )}

                  {selectedCat === 'partnership' && (
                    <>
                      <div className="fg">
                        <label>Capital Contribution (₹)</label>
                        <div className="pfx"><span className="pfx-sym">₹</span><input type="number" value={partcap} onChange={(e) => setPartcap(e.target.value)} /></div>
                      </div>
                      <div className="fg">
                        <label>Deed Type</label>
                        <select value={partnew} onChange={(e) => setPartnew(e.target.value)}>
                          <option value="new">New Deed</option>
                          <option value="amendment">Amendment</option>
                          <option value="dissolution">Dissolution</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>

                <button className="calc-btn" onClick={calculate}>Calculate Stamp Duty →</button>

                <div style={{ marginTop: '12px' }}>
                  <button className={`rates-toggle-btn ${showRates ? 'open' : ''}`} onClick={() => setShowRates(!showRates)}>
                    <span>📊 View State-wise Stamp Duty Rates for this Instrument</span>
                    <span className="arrow">▼</span>
                  </button>
                  {showRates && (
                    <div className="collapsible-rates">
                      <div className="table-wrap">
                        <table>
                          <thead><tr><th>State / UT</th><th>Male</th><th>Female</th><th>Reg. Fee</th><th>Special</th></tr></thead>
                          <tbody>
                            {Object.entries(STATES).map(([code, s]) => (
                              <tr key={code}>
                                <td>{s.name}</td>
                                <td><span className="rpill">{s.useSlab ? 'Slab' : (s.base.male + '%')}</span></td>
                                <td><span className="rpill blue">{s.useSlab ? 'Slab' : (s.base.female + '%')}</span></td>
                                <td><span className="rpill">{s.reg}%</span></td>
                                <td style={{ fontSize: '10px', color: 'var(--text3)' }}>{s.concession}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                <button className={`rates-toggle-btn ${showInstrRef ? 'open' : ''}`} onClick={() => setShowInstrRef(!showInstrRef)} style={{ marginTop: '8px' }}>
                  <span>📋 View Instrument-wise Duty Reference (All Acts)</span>
                  <span className="arrow">▼</span>
                </button>
                {showInstrRef && (
                  <div className="collapsible-rates">
                    <div className="table-wrap">
                      <table>
                        <thead><tr><th>Instrument</th><th>Governing Act / Article</th><th>Rate</th><th>Notes</th></tr></thead>
                        <tbody>
                          {INSTRUMENT_REFERENCE.map((r, i) => (
                            <tr key={i}>
                              <td>{r.title}</td>
                              <td style={{ fontSize: '11px', color: 'var(--text3)' }}>{r.acts}</td>
                              <td><span className="rpill">{r.rate}</span></td>
                              <td style={{ fontSize: '11px', color: 'var(--text3)' }}>{r.note}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="card">
                <div className="card-title">AI DOCUMENT ANALYSIS</div>
                <div className="form-grid">
                  <div className="fg">
                    <label>STATE / UT</label>
                    <select value={aiState} onChange={(e) => setAiState(e.target.value)}>
                      <option value="">— Optional —</option>
                      {Object.entries(STATES).map(([code, s]) => <option key={code} value={code}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="fg">
                    <label>UPLOAD DOCUMENT</label>
                    <div className="upload-zone dashed" onClick={() => document.getElementById('ai-file').click()}>
                      <input type="file" id="ai-file" hidden onChange={handleFileChange} />
                      <div className="up-inner">
                        <span className="up-icon-large">📎</span>
                        <div className="up-title">Click to browse or drag & drop</div>
                        <div className="up-sub">PDF · JPG · PNG · TXT — Max 5MB</div>
                      </div>
                    </div>
                  </div>

                  <div className="fg full">
                    <div className="step-hdr">STEP 1 — SELECT AI PROVIDER & LOG IN TO GET YOUR API KEY</div>
                    <div className="ai-provider-grid-large">
                      {Object.entries(PROVIDERS).map(([id, p]) => (
                        <div key={id} className={`ai-pill-large ${selectedAI === id ? 'active' : ''}`} onClick={() => setSelectedAI(id)}>
                          <span className="ai-dot-large"></span>{p.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="fg full">
                    <div className="provider-info-box">
                      <div className="pib-hdr"><strong>{PROVIDERS[selectedAI].name}</strong> — {PROVIDERS[selectedAI].desc}</div>
                      <div className="pib-sub">How to get your API key:</div>
                      <ol className="pib-list">
                        <li>1. <a href={PROVIDERS[selectedAI].link} target="_blank" rel="noreferrer">Click here to open {PROVIDERS[selectedAI].linkText}</a> (opens in new tab)</li>
                        {PROVIDERS[selectedAI].steps.map((s, i) => <li key={i}>{i + 2}. {s}</li>)}
                      </ol>
                      <div className="pib-note">{PROVIDERS[selectedAI].note}</div>
                    </div>
                  </div>

                  <div className="fg full">
                    <div className="step-hdr">Step 2 — Paste Your API Key below</div>
                    <div className="key-security-note">
                      🔒 Your key is used only in your browser session — it is never stored, logged, or shared.
                    </div>
                    <div className="key-input-wrap">
                      <input type="password" value={aiApiKey} onChange={(e) => setAiApiKey(e.target.value)} className="ai-key-input-large" placeholder="Paste your API key here..." />
                    </div>
                    <a href={PROVIDERS[selectedAI].link} target="_blank" rel="noreferrer" className="key-help-link">→ Open {selectedAI.charAt(0).toUpperCase() + selectedAI.slice(1)} console / login page</a>
                  </div>

                  <div className="fg full">
                    <label>DESCRIBE DOCUMENT OR PASTE KEY TEXT</label>
                    <textarea value={aiNotes} onChange={(e) => setAiNotes(e.target.value)} placeholder="e.g. 'Partnership deed for ABC & Co, capital ₹5 lakh, Maharashtra' — or paste relevant clauses..." className="ai-textarea-large"></textarea>
                  </div>

                  <button className="ai-analyze-btn-large" onClick={analyzeDoc}>
                    <span className="btn-icon">🤖</span> Analyse & Suggest Stamp Duty
                  </button>

                  {isAnalyzing && <div className="ai-thinking"><div className="spinner"></div>Analyzing document...</div>}
                  {aiResult && <div className="ai-result-box" dangerouslySetInnerHTML={{ __html: aiResult }}></div>}
                </div>
              </div>
            )}

            {selectedState && STATES[selectedState] && (
              <div className="act-box" style={{ marginTop: '12px' }}>
                📜 <strong>{STATES[selectedState].name}:</strong> {STATES[selectedState].act}<br />
                ℹ️ {STATES[selectedState].notes}
              </div>
            )}
          </div>

            <div className="result-panel">
              <div className="result-card">
                <div className="result-hdr">
                  <span className="result-hdr-lbl">Stamp Duty Estimate</span>
                  <span className="state-badge">{selectedState ? STATES[selectedState].name : '—'}</span>
                </div>
                <div id="result-body">
                  {!result ? (
                    <div className="empty-result">
                      <span className="er-icon">📋</span>
                      Select instrument & fill values, then click <strong>Calculate</strong>.
                    </div>
                  ) : (
                    <>
                      <div className="total-block">
                        <div className="total-lbl">Total Payable</div>
                        <div className="total-amt">{fmt(result.total)}</div>
                        {result.baseValue > 0 && (
                          <div className="total-eff">
                            Effective rate: {((result.total / result.baseValue) * 100).toFixed(2)}% of base value
                          </div>
                        )}
                      </div>
                      <div className="blist">
                        {result.lines.map((l, i) => (
                          <div className="bitem" key={i}>
                            <div className="bi-l">
                              <div className="bi-n">{l.n}</div>
                              <div className="bi-r">{l.r} {l.note && `· ${l.note}`}</div>
                            </div>
                            <div className="bi-v">{fmt(l.v)}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {result && (
              <>
                <div className="info-grid">
                  <div className="info-card">
                    <div className="ic-lbl">Effective Rate</div>
                    <div className="ic-val gold">{((result.total / result.baseValue) * 100).toFixed(2)}%</div>
                  </div>
                  <div className="info-card">
                    <div className="ic-lbl">Female Savings</div>
                    <div className="ic-val green">
                      {(() => {
                        const r = result.state;
                        if (r && r.base && r.base.male && result.br < r.base.male) {
                          return fmt(result.baseValue * ((r.base.male - result.br) / 100));
                        }
                        return '—';
                      })()}
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="ic-lbl">Base Stamp Rate</div>
                    <div className="ic-val">{result.br ? pct(result.br) : 'Fixed'}</div>
                  </div>
                  <div className="info-card">
                    <div className="ic-lbl">Reg. Fee Rate</div>
                    <div className="ic-val">{result.reg ? pct(result.reg) : '—'}</div>
                  </div>
                </div>

                {EXPERT_OPINIONS[selectedCat] && (
                  <div className="expert-panel">
                    <div className="expert-panel-title">Expert Opinion</div>
                    <div className="expert-content" dangerouslySetInnerHTML={{ __html: EXPERT_OPINIONS[selectedCat] }}></div>
                  </div>
                )}
              </>
            )}

            <div className="disclaimer-box">
              <strong>⚠ Disclaimer (FY 2026–27):</strong> These are estimated computations based on laws, rules and notifications current as of April 2026. Actual stamp duty may vary based on circle rates, local surcharges, state budget amendments, and the specific facts of the transaction. This tool does not constitute legal advice. Always consult a qualified advocate, chartered accountant, or your state's Sub-Registrar before execution of any instrument. Penalties for under-stamping under Section 35 of ISA 1899 can be up to 10× the deficient duty.
            </div>
          </div>
        </div>
      </main>

      <footer>
        <div className="container">
          <p>StampCalc India · Indian Stamp Act 1899 · Finance Act 2019 · SEBI/Depository Rules 2019 · Registration Act 1908 · State Stamp Acts · FY 2026 - 27</p>
          <p className="red-text">Not legal advice — consult a qualified professional · Penalty for under-stamping: up to 10× deficit (Sec.35, ISA 1899)</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
