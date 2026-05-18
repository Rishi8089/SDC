import { STATES } from '../data/states';

export const runCalculation = (selectedState, selectedCat, inputs) => {
  const r = STATES[selectedState];
  if (!r) return null;

  const gkey = inputs.gender || 'male';
  const ptype = inputs.ptype || 'residential';
  const val = (v) => parseFloat(v) || 0;
  
  const pct = (num) => (num && num > 0) ? num.toFixed(3).replace(/\.?0+$/, '') + '%' : '—';
  const pctOf = (rate, b) => b * (rate / 100);

  let lines = [];
  let total;
  let sd;
  let br;
  const sk = selectedState;

  const slabCalc = (v, slabs, genderKey) => {
    let calculatedSD = 0;
    let remaining = v;
    let prevLimit = 0;
    for (const slab of slabs) {
      const slabLimit = slab.upto;
      const rate = slab[genderKey] || slab.male || 5;
      const chunk = Math.min(remaining, slabLimit - prevLimit);
      if (chunk <= 0) break;
      calculatedSD += chunk * (rate / 100);
      remaining -= chunk;
      prevLimit = slabLimit;
    }
    return calculatedSD;
  };

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
    let duty = fd.duty;
    let reg = fd.reg;
    let note = fd.note;
    
    if (selectedState === 'KA' && selectedCat === 'will') {
      duty = 0;
      reg = 200;
      note = 'Karnataka Will: NIL stamp duty, ₹200 registration fee.';
    } else if (selectedState === 'KA' && selectedCat === 'adoption') {
      duty = 1000;
      reg = 200;
      note = 'Karnataka Adoption: ₹1,000 stamp duty, ₹200 registration fee.';
    }
    
    lines.push({ n: 'Stamp duty (' + selectedCat.replace(/_/g, ' ') + ')', r: 'Fixed (' + fd.art + ')', v: duty, note: note });
    if (reg > 0) lines.push({ n: 'Registration fee', r: 'Fixed', v: reg });
    total = duty + (reg || 0);
    return { total, lines, baseValue: total, br: 0, reg: 0, state: r };
  }

  // Partnership / LLP
  if (selectedCat === 'partnership' || selectedCat === 'llp') {
    const cap = val(inputs.partcap);
    const partnew = inputs.partnew || 'new';
    let duty, note;
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
    return { total, lines, baseValue: cap || 0, br: 0, reg: 0, state: r };
  }

  // MOA
  if (selectedCat === 'moa') {
    const ac = val(inputs.autcap);
    let duty = 200;
    if (ac > 0) duty = 200 + Math.floor(ac / 500000) * 1000;
    duty = Math.min(duty, 50000000);
    lines.push({ n: 'MoA stamp duty', r: 'Slab', v: duty, note: '₹200 + ₹1,000/₹5L authorised capital' });
    lines.push({ n: 'ROC filing fees (approx)', r: '—', v: 1000, note: 'Actual fees per Companies (Registration Offices) Rules' });
    total = duty + 1000;
    return { total, lines, baseValue: ac, br: 0, reg: 0, state: r };
  }

  // Commercial Agreements
  if (['sha', 'jv', 'franchise', 'service_agmt'].includes(selectedCat)) {
    const deal = val(inputs.pval);
    const rate = 0.1, duty = Math.max(200, deal * (rate / 100));
    lines.push({ n: 'Stamp duty (commercial agreement)', r: '0.1% or ₹200 min', v: duty });
    lines.push({ n: 'Registration fee (if registered)', r: '₹200 fixed', v: 200 });
    total = duty + 200;
    return { total, lines, baseValue: deal, br: rate, reg: 0, state: r };
  }

  // Securities
  const SEC_RATES = {
    share_transfer_unlisted: 0.015, share_transfer_listed: 0.015,
    debenture_issue: 0.005, debenture_transfer: 0.0001,
    repo: 0.00001, futures: 0.002, options_exchange: 0.003, options_otc: 0.003,
    other_derivatives: 0.0001, mf_units: 0.005, aif_units: 0.015, warrant_shares: 0.015,
  };
  if (SEC_RATES[selectedCat] !== undefined) {
    const base = (selectedCat === 'debenture_issue' || selectedCat === 'debenture_transfer') ? val(inputs.debval) : (val(inputs.shareval) || val(inputs.pval));
    const rate = SEC_RATES[selectedCat];
    const faceV = val(inputs.sharefv);
    const taxBase = (faceV > base && selectedCat.startsWith('share_')) ? faceV : base;
    const taxDuty = taxBase * (rate / 100);
    if (faceV > base && selectedCat.startsWith('share_')) lines.push({ n: 'Face value applied (higher than consideration)', r: '—', v: faceV, note: 'FMV rule under Finance Act 2019' });
    lines.push({ n: 'Stamp duty — ' + selectedCat.replace(/_/g, ' '), r: pct(rate) + ' (Finance Act 2019)', v: taxDuty, note: 'Collected by: ' + (selectedCat.includes('listed') || selectedCat === 'futures' || selectedCat === 'options_exchange' ? 'Stock Exchange' : 'Depository / Clearing Corp / State') });
    total = taxDuty;
    return { total, lines, baseValue: taxBase, br: rate, reg: 0, state: r };
  }

  // Negotiable Instruments
  if (['promissory', 'promissory_usance', 'bill_exchange', 'bill_usance'].includes(selectedCat)) {
    const amt = val(inputs.pronote);
    const usanceMo = val(inputs.usance);
    let rate = 0.5, note = 'On demand — Art.49/13 ISA';
    if (selectedCat.includes('usance')) {
      rate = usanceMo <= 3 ? 0.25 : 0.5;
      note = 'Usance ' + usanceMo + ' months — ' + (usanceMo <= 3 ? '0.25%' : '0.5%');
    }
    const duty = amt * (rate / 100);
    lines.push({ n: (selectedCat.includes('bill') ? 'Bill of Exchange' : 'Promissory Note') + ' — stamp duty', r: pct(rate), v: duty, note: note });
    total = duty;
    return { total, lines, baseValue: amt, br: rate, reg: 0, state: r };
  }

  // Lease logic
  if (selectedCat === 'lease') {
    const adv = val(inputs.advance);
    const rentIn = val(inputs.rent);
    const periodVal = Math.max(1, parseInt(inputs.leaseMonths) || 1);

    let totalMonths, annualRent;
    if (inputs.leasePeriodType === 'years') {
      totalMonths = periodVal * 12;
      annualRent = rentIn;
    } else {
      totalMonths = periodVal;
      annualRent = rentIn * 12;
    }
    const totalYears = totalMonths / 12;
    const monthlyRent = annualRent / 12;

    let duty, lrNote = '', regMandatory = false, regFee = 0;

    if (sk === 'MH') {
      const totalRentVal = monthlyRent * totalMonths;
      const notionalInt = adv * 0.10 * totalYears;
      const taxBase = totalRentVal + notionalInt;
      const rate = totalYears <= 5 ? 0.25 : totalYears <= 10 ? 0.5 : 1;
      duty = Math.max(100, pctOf(rate, taxBase));
      lrNote = `MSA Art.36A: ${rate}% of (total rent + 10% notional interest).`;
      regMandatory = true;
      regFee = 1000;
      lines.push({ n: 'Total rent', r: '—', v: totalRentVal });
      if (adv > 0) lines.push({ n: 'Notional interest on deposit (10% p.a.)', r: '10%', v: notionalInt });
    } else if (sk === 'KA') {
      const isResidential = (ptype === 'residential');
      const base = annualRent + adv;
      lines.push({ n: 'Average Annual Rent (AAR)', r: '—', v: annualRent, note: totalMonths + ' months' });
      if (adv > 0) lines.push({ n: 'Advance / Premium / Fine (included in base)', r: '—', v: adv, note: 'AAR + Advance' });
      lines.push({ n: 'Taxable base (AAR + Advance)', r: '—', v: base });

      const kaLeaseReg = Math.max(200, Math.ceil(base / 1000) * 5);
      if (totalYears <= 1) {
        const raw = pctOf(0.5, base);
        if (isResidential) {
          duty = Math.min(500, Math.max(100, raw));
          lrNote = 'IGR KA Item 9(i): Residential ≤1yr — 0.5% of (AAR+Advance), max ₹500.';
        } else {
          duty = Math.max(100, raw);
          lrNote = 'IGR KA Item 9(ii): Commercial/Industrial ≤1yr — 0.5% of (AAR+Advance). NO MAX CAP.';
        }
        regMandatory = false;
        regFee = kaLeaseReg;
      } else if (totalYears <= 10) {
        duty = pctOf(1, base);
        lrNote = 'IGR KA Item 9(iii): >1yr to <10yr — 1% of (AAR+Advance).';
        regMandatory = true;
        regFee = kaLeaseReg;
      } else if (totalYears <= 20) {
        duty = pctOf(2, base);
        lrNote = 'IGR KA Item 9(iv): >10yr to <20yr — 2% of (AAR+Advance).';
        regMandatory = true;
        regFee = kaLeaseReg;
      } else if (totalYears <= 30) {
        duty = pctOf(3, base);
        lrNote = 'IGR KA Item 9(v): >20yr to <30yr — 3% of (AAR+Advance).';
        regMandatory = true;
        regFee = kaLeaseReg;
      } else {
        const mv = Math.max(base, annualRent * 30);
        duty = mv * 0.05;
        lrNote = 'IGR KA Item 9(vi): >30yr/perpetuity — 5% conveyance rate on higher of MV or AAR×30. Reg: 2%.';
        regMandatory = true;
        regFee = mv * 0.02;
      }
    } else if (sk === 'DL') {
      if (totalMonths <= 11) { duty = 50; lrNote = 'Delhi ≤11 months: ₹50'; }
      else if (totalYears <= 5) { duty = pctOf(2, annualRent + adv); lrNote = 'Delhi 1–5 yrs: 2%'; regMandatory = true; regFee = 1100; }
      else if (totalYears <= 10) { duty = pctOf(3, annualRent + adv); lrNote = 'Delhi 5–10 yrs: 3%'; regMandatory = true; regFee = 1100; }
      else { duty = pctOf(4, annualRent + adv); lrNote = 'Delhi >10 yrs: 4%'; regMandatory = true; regFee = 1100; }
    } else if (sk === 'TN') {
      const base = (monthlyRent * totalMonths) + adv;
      duty = pctOf(1, base);
      lrNote = 'Tamil Nadu: 1% of total rent + deposit.';
      regMandatory = true;
      regFee = Math.min(20000, base * 0.04);
    } else if (sk === 'KL') {
      if (totalMonths <= 11) { duty = 500; lrNote = 'Kerala ≤11 months: ₹500'; regMandatory = true; regFee = 1000; }
      else { duty = pctOf(8, annualRent + adv); lrNote = 'Kerala >11 months: 8%'; regMandatory = true; regFee = Math.min(15000, (annualRent + adv) * 0.02); }
    } else if (sk === 'UP') {
      if (totalMonths <= 11) { duty = 200; lrNote = 'UP ≤11 months: ₹200'; }
      else {
        if (annualRent <= 200000) duty = totalYears <= 1 ? 500 : totalYears <= 5 ? 1500 : 2000;
        else if (annualRent <= 600000) duty = totalYears <= 1 ? 1500 : totalYears <= 5 ? 4500 : 7500;
        else duty = totalYears <= 1 ? 2500 : totalYears <= 5 ? 6000 : 10000;
        regMandatory = true;
        regFee = duty;
      }
    } else if (sk === 'GJ') {
      const base = annualRent + adv;
      duty = Math.max(300, pctOf(1, base));
      lrNote = 'Gujarat: 1% of (annual rent + deposit), min ₹300.';
      regMandatory = totalMonths > 11;
      regFee = regMandatory ? Math.min(10000, pctOf(1, base)) : 0;
    } else if (sk === 'HR') {
      const base = annualRent + adv;
      const rate = totalYears <= 5 ? 1.5 : 3;
      duty = pctOf(rate, base);
      lrNote = `Haryana: ${rate}% of (annual rent + deposit).`;
      regMandatory = totalMonths > 11;
      regFee = regMandatory ? Math.min(50000, pctOf(1, base)) : 0;
    } else if (sk === 'WB') {
      if (totalMonths <= 11) { duty = 100; lrNote = 'West Bengal ≤11 months: ₹100'; }
      else if (totalYears <= 5) { duty = pctOf(2, annualRent + adv); lrNote = 'WB 1–5 yrs: 2%'; regMandatory = true; regFee = Math.min(10000, pctOf(1, annualRent + adv)); }
      else if (totalYears <= 10) { duty = pctOf(3, annualRent + adv); lrNote = 'WB 5–10 yrs: 3%'; regMandatory = true; }
      else { duty = pctOf(4, annualRent + adv); lrNote = 'WB >10 yrs: 4%'; regMandatory = true; }
    } else if (sk === 'RJ') {
      if (totalMonths <= 11) { duty = 500; lrNote = 'Rajasthan ≤11 months: ₹500'; }
      else {
        duty = totalYears <= 5 ? pctOf(2, annualRent + adv) : pctOf(3, annualRent + adv);
        lrNote = `Rajasthan ${totalYears <= 5 ? '1–5' : '5+'} yrs: ${totalYears <= 5 ? '2%' : '3%'}`;
        regMandatory = true;
        regFee = pctOf(1, annualRent + adv);
      }
    } else {
      const base = annualRent + adv;
      if (totalMonths <= 11) { duty = 200; lrNote = 'Standard: ₹200 fixed'; }
      else if (totalYears <= 5) { duty = pctOf(2, base); lrNote = '1–5 yrs: 2%'; regMandatory = true; }
      else if (totalYears <= 10) { duty = pctOf(3, base); lrNote = '5–10 yrs: 3%'; regMandatory = true; }
      else if (totalYears <= 20) { duty = pctOf(4, base); lrNote = '10–20 yrs: 4%'; regMandatory = true; }
      else { duty = pctOf(5, base); lrNote = '20+ yrs: 5%'; regMandatory = true; }
      regFee = regMandatory ? Math.min((r.regCap || Infinity), base * (r.reg / 100)) : 0;
    }

    lines.push({ n: 'Stamp duty (Lease)', r: 'Calculated', v: duty, note: lrNote });
    if (regMandatory && regFee > 0) lines.push({ n: 'Registration fee', r: '—', v: regFee });
    total = duty + regFee;
    return { total, lines, baseValue: annualRent + adv, br: 0, reg: 0, state: r };
  }

  // Conveyance Family / Rest
  const pvalVal = val(inputs.pval), circleVal = val(inputs.circle);
  const propertyVal = Math.max(pvalVal, circleVal);
  if (circleVal > pvalVal) lines.push({ n: 'Circle rate applied (higher)', r: '—', v: circleVal });

  if (selectedCat === 'mortgage') {
    const ln = val(inputs.loan);
    const mr = r.mortgage || 0.5;
    let rf;
    if (sk === 'KA') {
      const baseSD = ln * (mr / 100);
      const sc = baseSD * 0.12;
      sd = baseSD + sc;
      lines.push({ n: 'Stamp duty — Mortgage without possession (KSA Item 10(ii))', r: '0.5% + surcharge', v: Math.round(sd), note: 'IGR KA Official: 0.5% on loan amount + 12% surcharge' });
      rf = Math.min(25000, Math.ceil(ln / 25000) * 5);
      lines.push({ n: 'Registration fee (₹5/₹25,000, max ₹25,000)', r: '₹5/₹25k', v: rf, note: 'KSA Item 10(ii)' });
    } else {
      sd = ln * (mr / 100);
      lines.push({ n: 'Stamp duty — Mortgage (Art.' + (r.art || '40') + ' ISA)', r: pct(mr), v: sd });
      rf = ln * (r.reg / 100); if (r.regCap && rf > r.regCap) rf = r.regCap;
      lines.push({ n: 'Registration fee (Reg. Act 1908)', r: pct(r.reg), v: rf });
    }
    total = sd + rf;
    return { total, lines, baseValue: ln, br: mr, reg: r.reg, state: r };
  } else if (selectedCat === 'partition') {
    const pv = val(inputs.partval), ns = Math.max(2, parseInt(inputs.nshares) || 2);
    const sv1 = pv / ns;
    lines.push({ n: 'Total property value', r: '—', v: pv, note: `${ns} co-owners` });
    lines.push({ n: "Each party's share value", r: '—', v: sv1 });

    const pr = r.partition || 2;
    let rf;
    if (sk === 'KA') {
      sd = 5000 * ns;
      rf = 1000 * ns;
      lines.push({ n: 'Stamp duty — KSA Partition (Urban BBMP/Corp: ₹5,000/share)', r: '₹5,000/share', v: sd });
      lines.push({ n: 'Registration fee (₹1,000/share — BBMP/Corp)', r: '₹1,000/share', v: rf });
    } else {
      sd = sv1 * (pr / 100);
      lines.push({ n: 'Stamp duty — Partition (Art.' + (r.art || '45') + ' ISA)', r: pct(pr), v: sd });
      const partRegRate = Math.min(r.reg, 1);
      rf = sv1 * (partRegRate / 100);
      lines.push({ n: 'Registration fee (partition)', r: pct(partRegRate), v: rf });
    }
    total = sd + rf;
    return { total, lines, baseValue: sv1, br: pr, reg: r.reg, state: r };
  } else {
    if (sk === 'KA') {
      if (selectedCat === 'gift_prop') {
        const baseSD = propertyVal * 0.05;
        const surchargeTotal = baseSD * 0.12;
        sd = baseSD + surchargeTotal;
        lines.push({ n: 'Stamp duty — Gift (non-family) KSA: 5%', r: '5%', v: baseSD, note: 'IGR KA Item 8(i)' });
        lines.push({ n: 'Surcharge & Additional Duty (12% of base SD)', r: '12%', v: surchargeTotal });
        lines.push({ n: '— If donee is a family member —', r: 'Fixed Concession', v: 0, note: 'BBMP/Corp: ₹5,000 | Municipal/Town: ₹3,000 | Others: ₹1,000 (Reg: ₹1,000)' });
        let rf = propertyVal * 0.02;
        lines.push({ n: 'Registration fee (non-family)', r: '2%', v: rf });
        total = sd + rf;
        return { total, lines, baseValue: propertyVal, br: 5, reg: 2, state: r };
      } else {
        const baseSD = propertyVal * 0.05;
        const surchargeTotal = baseSD * 0.12;
        sd = baseSD + surchargeTotal;
        lines.push({ n: 'Stamp duty — Conveyance KSA Art.20(1)', r: '5%', v: baseSD });
        lines.push({ n: 'Surcharge & Additional Duty (12% of base SD — BBMP/Corp areas)', r: '12%', v: surchargeTotal });
        let rf = propertyVal * 0.02;
        lines.push({ n: 'Registration fee (Reg. Act 1908)', r: '2%', v: rf });
        total = sd + rf;
        return { total, lines, baseValue: propertyVal, br: 5, reg: 2, state: r };
      }
    } else {
      if (r.useSlab) { sd = slabCalc(propertyVal, r.slabs, gkey); br = (sd / propertyVal) * 100; }
      else { br = r.base[gkey] || r.base.male; sd = propertyVal * (br / 100); }
      
      lines.push({ n: 'Stamp duty (Art.' + (r.art || '23') + ' ISA)', r: pct(br), v: sd });
      
      if (r.surcharge) {
        const sc = sd * (r.surcharge / 100);
        lines.push({ n: 'Stamp duty surcharge (' + r.surcharge + '%)', r: r.surcharge + '%', v: sc });
        sd += sc;
      }
      if (r.transfer && ptype !== 'agricultural' && (selectedCat === 'sale' || selectedCat === 'exchange')) {
        const td = propertyVal * (r.transfer / 100);
        lines.push({ n: 'Transfer duty', r: pct(r.transfer), v: td });
        sd += td;
      }
      if (r.extras) {
        for (const ex of r.extras) {
          if (ex.noAgri && ptype === 'agricultural') continue;
          const ev = propertyVal * (ex.r / 100);
          lines.push({ n: ex.n, r: pct(ex.r), v: ev });
          sd += ev;
        }
      }
      
      let rf;
      if (selectedCat === 'agreement_sale' || selectedCat === 'development') {
        rf = 200;
        lines.push({ n: 'Registration fee (nominal)', r: '₹200 fixed', v: 200 });
      } else {
        rf = propertyVal * (r.reg / 100);
        if (r.regCap && rf > r.regCap) rf = r.regCap;
        lines.push({ n: 'Registration fee (Reg. Act 1908)', r: pct(r.reg), v: rf });
      }
      total = sd + rf;
      return { total, lines, baseValue: propertyVal, br: br, reg: r.reg, state: r };
    }
  }
};
