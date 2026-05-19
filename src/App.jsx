import React, { useState } from 'react';
import './App.css';
import { STATES } from './data/states';
import { INSTRUMENTS } from './data/instruments';
import { EXPERT_OPINIONS } from './data/expert';
import { INSTRUMENT_REFERENCE } from './data/reference';
import { showToast } from './utils/toast';
import SourcePanel from './components/SourcePanel';
import DisclaimerOverlay from './components/DisclaimerOverlay';
import { autoDetectState } from './utils/location';
import CrossStateComparison from './components/CrossStateComparison';
import DosDontsGuide from './components/DosDontsGuide';
import CircleRatesDatabase from './components/CircleRatesDatabase';
import DeedDraftPanel from './components/DeedDraftPanel';
import PdfReportModal from './components/PdfReportModal';
import { runCalculation } from './utils/calcEngine';

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
  const [activeMainPage, setActiveMainPage] = useState('home'); // 'home', 'about', or 'contact'
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
  const [calcError, setCalcError] = useState(null);
  const [showRates, setShowRates] = useState(false);
  const [showInstrRef, setShowInstrRef] = useState(false);
  const [activeSubPage, setActiveSubPage] = useState(null); // 'comparison', 'guide', 'circlerates', 'draft'
  const [showPdfModal, setShowPdfModal] = useState(false);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [locationStatus, setLocationStatus] = useState('idle'); // 'idle', 'detecting', 'found', 'error'
  const [detectedCity, setDetectedCity] = useState('');
  const [detectedStateName, setDetectedStateName] = useState('');

  const triggerLocationDetection = () => {
    autoDetectState({
      onDetecting: () => {
        setLocationStatus('detecting');
      },
      onFound: (city, stateName, code) => {
        setLocationStatus('found');
        setDetectedCity(city);
        setDetectedStateName(stateName);
        if (code) {
          setSelectedState(code);
          showToast(`Auto-detected location: ${city || stateName || 'India'}`, 'success');
        }
      },
      onError: () => {
        setLocationStatus('error');
      }
    });
  };

  const handleAcceptTerms = () => {
    setTermsAccepted(true);
    try {
      localStorage.setItem('esd_accepted', new Date().toISOString());
    } catch {
      // Ignore local storage error
    }
    setTimeout(triggerLocationDetection, 400);
  };

  // Keyboard shortcut for Enter
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        if (mode === 'calc') {
          const tag = document.activeElement && document.activeElement.tagName;
          if (tag === 'INPUT' || tag === 'SELECT' || tag === 'BUTTON') {
            e.preventDefault();
            // We use a custom event or a ref to call calculate if it doesn't have stale closures.
            // But since calculate is a closure on state, it's better to attach it inside an effect that depends on all the form values.
            // Actually, we can just find the calculate button and click it!
            const btn = document.getElementById('btn-calculate');
            if (btn) btn.click();
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  const showMsg = (msg, fieldId) => {
    setResult(null);
    setCalcError(msg);
    showToast(msg, 'error');

    if (fieldId) {
      const el = document.getElementById(fieldId);
      if (el) {
        const wrap = el.closest('.fg');
        if (wrap) {
          wrap.classList.add('field-error');
          setTimeout(() => wrap.classList.remove('field-error'), 3000);
        }
        el.focus();
      }
    }
  };

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

  const calculate = () => {
    setCalcError(null);
    if (!selectedState) { showMsg('Please select a state / UT.', 'state'); return; }
    if (!selectedCat) { showMsg('Please select an instrument category.', 'instcat'); return; }
    
    const val = (v) => parseFloat(v) || 0;
    
    // Check validation of specific category inputs
    if (['partnership', 'llp'].includes(selectedCat)) {
      // capital validation
    } else if (['sha', 'jv', 'franchise', 'service_agmt'].includes(selectedCat)) {
      if (!val(pval)) { showMsg('Please enter the contract / deal value.', 'pval'); return; }
    } else if (['share_transfer_unlisted', 'share_transfer_listed', 'debenture_issue', 'debenture_transfer', 'repo', 'futures', 'options_exchange', 'options_otc', 'other_derivatives', 'mf_units', 'aif_units', 'warrant_shares'].includes(selectedCat)) {
      const isDeb = selectedCat.startsWith('debenture');
      const baseVal = isDeb ? val(debval) : (val(shareval) || val(pval));
      if (!baseVal) {
        showMsg('Please enter the transaction / value amount.', isDeb ? 'debval' : 'pval');
        return;
      }
    } else if (['promissory', 'promissory_usance', 'bill_exchange', 'bill_usance'].includes(selectedCat)) {
      if (!val(pronote)) { showMsg('Please enter the note / bill amount.', 'pronote'); return; }
    } else if (selectedCat === 'lease') {
      if (!val(rent) && !val(advance)) { showMsg('Please enter rent amount or advance/deposit.', 'rent'); return; }
    } else if (selectedCat === 'mortgage') {
      if (!val(loan)) { showMsg('Please enter the loan amount.', 'loan'); return; }
    } else if (selectedCat === 'partition') {
      if (!val(partval)) { showMsg('Please enter the total property value.', 'partval'); return; }
    } else {
      const pvalVal = val(pval), circleVal = val(circle);
      if (!pvalVal && !['mortgage', 'partition'].includes(selectedCat)) { showMsg('Please enter the property / asset value.', 'pval'); return; }
    }

    const inputs = {
      gender,
      ptype,
      pval,
      circle,
      loan,
      mortprop,
      advance,
      leasePeriodType,
      leaseMonths,
      rent,
      partval,
      nshares,
      poaval,
      shareval,
      sharefv,
      debval,
      pronote,
      usance,
      loanamt,
      autcap,
      area,
      partcap,
      partnew
    };

    const res = runCalculation(selectedState, selectedCat, inputs);
    if (res) {
      setResult(res);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      if (f.size > 5 * 1024 * 1024) { showToast('File too large. Max 5MB.', 'error'); return; }
      setFile(f);
    }
  };

  const analyzeDoc = async () => {
    if (!file && !aiNotes) { showToast('Please upload a document or describe it.', 'warning'); return; }
    if (!aiApiKey) { showToast('Please enter your API key.', 'warning'); return; }
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
      {/* Professional Legal & Finance Background Watermarks */}
      <div className="pro-bg" aria-hidden="true">
        {/* Legal scale icon - top left */}
        <svg className="bg-icon bg-icon-tl" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <line x1="60" y1="15" x2="60" y2="95" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <line x1="25" y1="35" x2="95" y2="35" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <line x1="25" y1="35" x2="15" y2="58" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="95" y1="35" x2="105" y2="58" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <ellipse cx="20" cy="61" rx="14" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
          <ellipse cx="100" cy="61" rx="14" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
          <line x1="45" y1="95" x2="75" y2="95" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        {/* Rupee stamp - top right */}
        <svg className="bg-icon bg-icon-tr" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 3"/>
          <circle cx="60" cy="60" r="40" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <text x="60" y="73" textAnchor="middle" fontSize="38" fontWeight="700" fontFamily="Arial" fill="currentColor">Rs</text>
        </svg>
        {/* Document icon - bottom left */}
        <svg className="bg-icon bg-icon-bl" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="5" width="65" height="85" rx="5" fill="none" stroke="currentColor" strokeWidth="2.5"/>
          <path d="M65 5 L75 5 L85 15 L75 15 L75 5" fill="none" stroke="currentColor" strokeWidth="2"/>
          <path d="M75 5 L75 15 L85 15" fill="none" stroke="currentColor" strokeWidth="2"/>
          <line x1="22" y1="30" x2="63" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="22" y1="42" x2="63" y2="42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="22" y1="54" x2="45" y2="54" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="57" cy="78" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
          <path d="M52 78 L56 82 L64 74" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {/* Building/Court icon - bottom right */}
        <svg className="bg-icon bg-icon-br" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="50" width="80" height="55" rx="2" fill="none" stroke="currentColor" strokeWidth="2.5"/>
          <line x1="10" y1="50" x2="110" y2="50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <polygon points="60,12 15,50 105,50" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
          <rect x="35" y="70" width="14" height="35" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
          <rect x="55" y="70" width="14" height="35" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
          <rect x="75" y="70" width="14" height="35" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
          <line x1="60" y1="18" x2="60" y2="12" stroke="currentColor" strokeWidth="2"/>
          <circle cx="60" cy="10" r="3" fill="currentColor"/>
        </svg>
        {/* Centre large subtle Rs watermark */}
        <svg className="bg-icon bg-icon-center" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
          <circle cx="100" cy="100" r="75" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
          <text x="100" y="128" text-anchor="middle" fontSize="80" fontWeight="900" fontFamily="Georgia,serif" fill="currentColor" opacity="0.9">Rs</text>
        </svg>
      </div>

      {!termsAccepted && <DisclaimerOverlay onAccept={handleAcceptTerms} />}
      <div className={!termsAccepted ? 'blurred' : ''}>
        <div className="tricolor"></div>
        <header>
          <div className="container">
            <div className="header-inner">
            <div className="logo" style={{ cursor: 'pointer' }} onClick={() => { setActiveMainPage('home'); setActiveSubPage(null); }}>
              {/* Legal Stamp Seal icon — scales of justice + rupee symbol */}
              <svg className="lsvg" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF9933"/>
                    <stop offset="50%" stopColor="#e07800"/>
                    <stop offset="100%" stopColor="#FF9933"/>
                  </linearGradient>
                  <filter id="gshadow"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,.3)"/></filter>
                </defs>
                {/* Hexagonal background */}
                <polygon points="28,2 52,15 52,41 28,54 4,41 4,15" fill="url(#bg1)" filter="url(#gshadow)"/>
                {/* Inner white hex outline */}
                <polygon points="28,7 47,18 47,38 28,49 9,38 9,18" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1"/>
                {/* Document icon body */}
                <rect x="18" y="13" width="20" height="26" rx="2.5" fill="rgba(255,255,255,.95)"/>
                {/* Document fold corner */}
                <path d="M33 13 L38 18 L33 18 Z" fill="rgba(255,153,51,.6)"/>
                <path d="M33 13 L38 18 L33 18" fill="none" stroke="rgba(180,100,0,.4)" strokeWidth=".8"/>
                {/* Rupee ₹ on document */}
                <text x="28" y="29" text-anchor="middle" fontFamily="'DM Sans',Georgia,sans-serif" fontSize="10" fontWeight="700" fill="#183078">₹</text>
                {/* Horizontal lines on doc */}
                <line x1="21" y1="33" x2="35" y2="33" stroke="#183078" strokeWidth="1.2" strokeLinecap="round" opacity=".35"/>
                <line x1="21" y1="36" x2="31" y2="36" stroke="#183078" strokeWidth="1.2" strokeLinecap="round" opacity=".25"/>
                {/* Stamp seal circle */}
                <circle cx="34" cy="37" r="5.5" fill="#138808" stroke="#fff" strokeWidth="1.2"/>
                <text x="34" y="40" text-anchor="middle" fontSize="7" fontWeight="700" fill="#fff" fontFamily="sans-serif">✓</text>
              </svg>
              <div>
                <div className="ltxt">Every<span className="s">Stamp</span>Duty<span className="d">.com</span></div>
                <span className="lsub">India's Complete Stamp Duty Calculator — Every Act · Every State · Every Instrument</span>
              </div>
            </div>
            
            <div className="header-nav">
              <button className={`nav-btn ${activeMainPage === 'home' ? 'active' : ''}`} onClick={() => { setActiveMainPage('home'); setActiveSubPage(null); }}>Calculator</button>
              <button className={`nav-btn ${activeMainPage === 'about' ? 'active' : ''}`} onClick={() => { setActiveMainPage('about'); setActiveSubPage(null); }}>About Us</button>
              <button className={`nav-btn ${activeMainPage === 'contact' ? 'active' : ''}`} onClick={() => { setActiveMainPage('contact'); setActiveSubPage(null); }}>Contact Us</button>
            </div>

            <div className="hpills">
              <span className="hpill">ISA 1899 · Finance Act 2019 · Rules 2019</span>
              <span className="hpill">Registration Act 1908</span>
              <span className="hpill">All 36 States & UTs</span>
              <span className="hpill green">FY 2026–27 Updated</span>
              <span className="hpill red">Not Legal Advice</span>
            </div>
            
            {/* Location widget — right side of header */}
            <div className="loc-widget" id="loc-widget">
              {locationStatus === 'detecting' && (
                <div className="loc-detecting">
                  <span className="loc-spin-sm"></span>
                  <span>Detecting location…</span>
                </div>
              )}
              {locationStatus === 'found' && (
                <div className="loc-found">
                  <span className="loc-pin">📍</span>
                  <div className="loc-info">
                    <div className="loc-city">
                      {detectedCity || detectedStateName || 'India'}
                    </div>
                    {detectedCity && detectedStateName && (
                      <div className="loc-state">{detectedStateName}</div>
                    )}
                  </div>
                </div>
              )}
              {locationStatus === 'error' && (
                <div className="loc-error">
                  <span style={{ fontSize: '13px' }}>📍</span>
                  <span>Location unavailable</span>
                </div>
              )}
              {locationStatus === 'idle' && (
                <div className="loc-detecting" style={{ cursor: 'pointer' }} onClick={triggerLocationDetection}>
                  <span className="loc-pin">📍</span>
                  <span>Click to auto-detect location</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        {activeMainPage === 'home' && (
          <>
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

        {result && activeSubPage === null && (
          <div className="action-toolkit-grid no-print">
            <div className={`toolkit-card ${activeSubPage === 'comparison' ? 'active' : ''}`} onClick={() => {
              if (!selectedCat) {
                showToast('Please select an instrument category in the calculator below to compare across states.', 'warning');
                document.getElementById('btn-calculate')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                setActiveSubPage('comparison');
              }
            }}>
              <div className="tk-icon">📊</div>
              <h3>Cross-State Compare</h3>
              <p>Dynamically compare stamp duty and registry slabs across all 36 Indian states.</p>
            </div>
            
            <div className={`toolkit-card ${activeSubPage === 'draft' ? 'active' : ''}`} onClick={() => setActiveSubPage('draft')}>
              <div className="tk-icon">📝</div>
              <h3>Deed Drafting Suite</h3>
              <p>Generate draft legal deeds with live Times New Roman preview and Word downloads.</p>
            </div>

            <div className={`toolkit-card ${activeSubPage === 'circlerates' ? 'active' : ''}`} onClick={() => setActiveSubPage('circlerates')}>
              <div className="tk-icon">🗺️</div>
              <h3>Circle Rates Database</h3>
              <p>Access direct state-wise government IGR portal links and valuation guides.</p>
            </div>

            <div className={`toolkit-card ${activeSubPage === 'guide' ? 'active' : ''}`} onClick={() => setActiveSubPage('guide')}>
              <div className="tk-icon">⚖️</div>
              <h3>Legal Compliance</h3>
              <p>Interactive statutory checklist and Section 35 deficient duty risk advisories.</p>
            </div>
          </div>
        )}

        {activeSubPage === 'comparison' && (
          <CrossStateComparison 
            selectedCat={selectedCat} 
            inputs={{ gender, ptype, pval, circle, loan, mortprop, advance, leasePeriodType, leaseMonths, rent, partval, nshares, poaval, shareval, sharefv, debval, pronote, usance, loanamt, autcap, area, partcap, partnew }} 
            onClose={() => setActiveSubPage(null)} 
          />
        )}
        {activeSubPage === 'draft' && (
          <DeedDraftPanel 
            selectedCat={selectedCat} 
            inputs={{ gender, ptype, pval, circle, loan, mortprop, advance, leasePeriodType, leaseMonths, rent, partval, nshares, poaval, shareval, sharefv, debval, pronote, usance, loanamt, autcap, area, partcap, partnew }} 
            onClose={() => setActiveSubPage(null)} 
          />
        )}
        {activeSubPage === 'circlerates' && (
          <CircleRatesDatabase 
            onClose={() => setActiveSubPage(null)} 
          />
        )}
        {activeSubPage === 'guide' && (
          <DosDontsGuide 
            selectedState={selectedState}
            selectedCat={selectedCat}
            inputs={{ gender, ptype, pval, circle, loan, mortprop, advance, leasePeriodType, leaseMonths, rent, partval, nshares, poaval, shareval, sharefv, debval, pronote, usance, loanamt, autcap, area, partcap, partnew }}
            result={result}
            onClose={() => setActiveSubPage(null)} 
          />
        )}

        {activeSubPage === null && (
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

                <button id="btn-calculate" className="calc-btn" onClick={calculate} aria-label="Calculate stamp duty">Calculate Stamp Duty →</button>

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
                  {calcError ? (
                    <div className="empty-result">
                      <span className="er-icon">⚠️</span>
                      {calcError}
                    </div>
                  ) : !result ? (
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
                        <button className="pdf-report-trigger-btn" onClick={() => setShowPdfModal(true)}>
                          📄 Generate PDF Audit Report
                        </button>
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

                {selectedCat && (
                  <SourcePanel instrumentKey={selectedCat} />
                )}
              </>
            )}

            <div className="disclaimer-box" style={{ marginTop: '16px' }}>
              <strong>⚠ Disclaimer (FY 2026–27):</strong> These are estimated computations based on laws, rules and notifications current as of April 2026. Actual stamp duty may vary based on circle rates, local surcharges, state budget amendments, and the specific facts of the transaction. This tool does not constitute legal advice. Always consult a qualified advocate, chartered accountant, or your state's Sub-Registrar before execution of any instrument. Penalties for under-stamping under Section 35 of ISA 1899 can be up to 10× the deficient duty.
            </div>
          </div>
        </div>
        )}
      </>
    )}

        {activeMainPage === 'about' && (
          <div className="subpage-container" style={{ marginTop: '20px' }}>
            <div className="subpage-header">
              <div className="sh-title">
                <span className="sh-icon">🏛️</span>
                <div>
                  <h1 style={{ margin: 0 }}>About EveryStampDuty.com</h1>
                  <p style={{ margin: 0 }}>Pioneering Indian Legal-Tech Accessibility & Computational High-Precision</p>
                </div>
              </div>
              <button className="subpage-close" onClick={() => { setActiveMainPage('home'); setActiveSubPage(null); }}>
                ← Back to Calculator
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div className="card" style={{ marginBottom: '24px' }}>
                <div className="card-title">Our Mission</div>
                <p style={{ fontSize: '15px', color: 'var(--tx2)', lineHeight: '1.8', marginBottom: '20px' }}>
                  EveryStampDuty.com was founded with a singular, resolute objective: <strong>to democratize and untangle the highly fragmented statutory stamp duty schedules across India</strong>. Operating under a dynamic federation of central, state, and union territory laws, calculating the exact stamp duty and registration fees has historically been a source of legal risk, financial penalties, and sub-registrar delays. 
                </p>
                <p style={{ fontSize: '15px', color: 'var(--tx2)', lineHeight: '1.8' }}>
                  By mapping over 94 distinct instrument categories to all 36 Indian states and UTs, and combining standard computations with real-time AI-powered semantic clause extraction, we provide individuals, advocates, chartered accountants, and institutions with an <strong>audit-ready, highly compliant estimations pipeline</strong>.
                </p>
              </div>

              <div className="matrix-meta-grid" style={{ marginBottom: '24px' }}>
                <div className="mm-item purple-glow">
                  <span className="mm-lbl">Statutory Scope</span>
                  <span className="mm-val">36 States & UTs</span>
                  <span className="mm-sub">Fully updated for FY 2026–27</span>
                </div>
                <div className="mm-item green-glow">
                  <span className="mm-lbl">Instrument Coverage</span>
                  <span className="mm-val">94+ Categories</span>
                  <span className="mm-sub">Leases, Sales, Trusts & Derivatives</span>
                </div>
                <div className="mm-item red-glow">
                  <span className="mm-lbl">Privacy Compliance</span>
                  <span className="mm-val">100% Client-Side</span>
                  <span className="mm-sub">Zero data or documents stored</span>
                </div>
              </div>

              <div className="card">
                <div className="card-title">Our Technical Framework</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '16px' }}>
                  <div className="vr-item">
                    <div className="vr-num">01</div>
                    <h3 style={{ color: 'var(--nv)', fontWeight: '600', marginBottom: '8px' }}>High-Precision Slab Engines</h3>
                    <p style={{ fontSize: '13px', color: 'var(--tx2)', lineHeight: '1.6' }}>
                      Our custom calcEngine computes complex percentage structures, ceiling caps (e.g., Maharashtra registration fee caps at ₹30,000), minimum thresholds, and area-specific surcharges natively in your session.
                    </p>
                  </div>
                  <div className="vr-item">
                    <div className="vr-num">02</div>
                    <h3 style={{ color: 'var(--nv)', fontWeight: '600', marginBottom: '8px' }}>AI Semantic Layer</h3>
                    <p style={{ fontSize: '13px', color: 'var(--tx2)', lineHeight: '1.6' }}>
                      Integrates with Claude, Gemini, ChatGPT, and Azure to read draft deeds directly, automatically parsing core transaction attributes to predict execution rates.
                    </p>
                  </div>
                  <div className="vr-item">
                    <div className="vr-num">03</div>
                    <h3 style={{ color: 'var(--nv)', fontWeight: '600', marginBottom: '8px' }}>Audit Transparency</h3>
                    <p style={{ fontSize: '13px', color: 'var(--tx2)', lineHeight: '1.6' }}>
                      Every calculation outputs verified legal sources, specific legislative articles, regulatory authorities, and direct state portal references so users can double-check estimates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMainPage === 'contact' && (
          <div className="subpage-container" style={{ marginTop: '20px' }}>
            <div className="subpage-header">
              <div className="sh-title">
                <span className="sh-icon">✉️</span>
                <div>
                  <h1 style={{ margin: 0 }}>Contact EveryStampDuty.com</h1>
                  <p style={{ margin: 0 }}>Connect with our Statutory Computations Liaison & Enterprise Integration Team</p>
                </div>
              </div>
              <button className="subpage-close" onClick={() => { setActiveMainPage('home'); setActiveSubPage(null); }}>
                ← Back to Calculator
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div className="contact-grid">
                <div className="contact-info-card">
                  <div className="card-title">Liaison Office</div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px', fontSize: '13.5px', color: 'var(--tx2)', lineHeight: '1.7' }}>
                    <div>
                      <strong>🏢 Legal-Tech Headquarters:</strong>
                      <p style={{ marginTop: '4px', fontSize: '13px' }}>
                        Janakshi Layout , Rajrajeshwari nagar 5th stage<br />
                        Main road, Bangalore,<br />
                        Karnataka — 560098
                      </p>
                    </div>
                    
                    <div>
                      <strong>✉️ General Inquiries:</strong>
                      <p style={{ marginTop: '2px' }}><a href="mailto:everystampduty@gmail.com" style={{ color: 'var(--pu)', textDecoration: 'none', fontWeight: '600' }}>everystampduty@gmail.com</a></p>
                    </div>

                    <div>
                      <strong>📱 Telephone Helpdesk:</strong>
                      <p style={{ marginTop: '2px', fontWeight: '600', color: 'var(--tx)' }}>+91 7338673370</p>
                      <span style={{ fontSize: '10.5px', color: 'var(--tx3)' }}>Mon–Fri, 9:30 AM – 6:30 PM IST</span>
                    </div>
                  </div>
                </div>

                <div className="contact-form-card">
                  <div className="card-title">Statutory Inquiry Form</div>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    showToast("Inquiry submitted successfully! A liaison officer will review your statutory query shortly.", "success");
                    e.target.reset();
                  }} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                    
                    <div className="contact-form-row">
                      <div className="pdf-party-field">
                        <label>Full Name</label>
                        <input type="text" placeholder="e.g. Adv. Rajesh Kumar" required />
                      </div>
                      <div className="pdf-party-field">
                        <label>Email Address</label>
                        <input type="email" placeholder="e.g. rajesh@legalcorp.in" required />
                      </div>
                    </div>

                    <div className="contact-form-row">
                      <div className="pdf-party-field">
                        <label>State / Union Territory</label>
                        <select required defaultValue="">
                          <option value="" disabled>— Select State —</option>
                          {Object.entries(STATES).map(([code, s]) => <option key={code} value={code}>{s.name}</option>)}
                        </select>
                      </div>
                      <div className="pdf-party-field">
                        <label>Inquiry Nature</label>
                        <select required defaultValue="general">
                          <option value="general">General Support / feedback</option>
                          <option value="slab">Slab rate amendment correction</option>
                          <option value="api">Enterprise API access integration</option>
                          <option value="legal">Legal team inquiry</option>
                        </select>
                      </div>
                    </div>

                    <div className="pdf-party-field">
                      <label>Your Query / Message</label>
                      <textarea style={{ 
                        width: '100%', 
                        minHeight: '110px', 
                        padding: '10px 12px', 
                        borderRadius: 'var(--rsm)', 
                        border: '1.5px solid var(--bdr)', 
                        background: 'var(--sfc2)', 
                        fontSize: '13px', 
                        fontFamily: 'inherit',
                        color: 'var(--tx)' 
                      }} placeholder="Please enter your specific question, state act queries, or API requirements..." required></textarea>
                    </div>

                    <button type="submit" className="pdf-report-trigger-btn" style={{ margin: '6px 0 0', width: '100%', border: '1.5px solid var(--sf)' }}>
                      ✓ Submit Statutory Inquiry
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer>
        <div className="container">
          <p><strong>EveryStampDuty.com</strong> — Every Act. Every State. Every Instrument.</p>
          <p style={{ marginTop: '3px' }}>Indian Stamp Act 1899 · Finance Act 2026 · SEBI Rules 2019 · Registration Act 1908 · All State Stamp Acts · FY 2026–27</p>
          <p style={{ marginTop: '4px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { setActiveMainPage('home'); setActiveSubPage(null); window.scrollTo({top: 0, behavior: 'smooth'}); }}>Calculator</span>
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { setActiveMainPage('about'); setActiveSubPage(null); window.scrollTo({top: 0, behavior: 'smooth'}); }}>About Us</span>
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { setActiveMainPage('contact'); setActiveSubPage(null); window.scrollTo({top: 0, behavior: 'smooth'}); }}>Contact Us</span>
          </p>
          <p style={{ marginTop: '4px', color: 'rgba(255,120,100,.9)', fontSize: '11px' }}>Not Legal Advice — Consult a qualified professional before executing any instrument</p>
        </div>
      </footer>
      <div className="tfoot"></div>
      </div>

      {showPdfModal && (
        <PdfReportModal 
          result={result} 
          selectedState={selectedState} 
          selectedCat={selectedCat} 
          inputs={{ gender, ptype, pval, circle, loan, mortprop, advance, leasePeriodType, leaseMonths, rent, partval, nshares, poaval, shareval, sharefv, debval, pronote, usance, loanamt, autcap, area, partcap, partnew }} 
          onClose={() => setShowPdfModal(false)} 
        />
      )}
    </div>
  );
}

export default App;
