import { useState } from 'react';
import './DisclaimerOverlay.css';

export default function DisclaimerOverlay({ onAccept }) {
  const [checked, setChecked] = useState(false);

  const handleAccept = () => {
    if (checked) {
      onAccept();
    }
  };

  return (
    <div id="tov" className="tov-overlay">
      <div className="tbox">
        {/* Header */}
        <div className="tbox-header">
          <div className="tname">
            Every<span className="s">Stamp</span>Duty<span className="d">.com</span>
          </div>
          <div className="ttag">
            India's Complete Stamp Duty Calculator · Every Act · Every State · Every Instrument
          </div>
          <div className="tbox-seal">
            <div className="tbox-seal-line"></div>
            <div className="tbox-seal-txt">Legal Disclaimer &amp; Terms of Use</div>
            <div className="tbox-seal-line"></div>
          </div>
        </div>

        {/* Body */}
        <div className="tbox-body">
          <div className="th2">Terms of Use &amp; Disclaimer</div>
          <div className="tbody">
            <h3>1. Educational Purpose Only</h3>
            <p>
              EveryStampDuty.com is an online stamp duty <strong>estimation tool</strong> provided purely for general
              informational and educational purposes. All calculations are indicative estimates only and{' '}
              <strong>do not constitute legal, financial, or professional advice</strong> of any kind.
            </p>

            <h3>2. Not Legal Advice — Consult a Professional</h3>
            <p>
              Rates shown are based on publicly available statutes, state government notifications, and Finance
              Ministry publications as on FY 2026–27. These may not reflect the latest amendments, circulars, or
              sub-registrar instructions. <strong>Always consult a qualified advocate, chartered accountant, or your state's Sub-Registrar office</strong> before executing any instrument.
            </p>

            <h3>3. Complete Limitation of Liability</h3>
            <p>EveryStampDuty.com, its owners, developers, contributors, and affiliates shall bear <strong>no liability whatsoever</strong> for:</p>
            <ol>
              <li>Any financial loss, penalty, fine, litigation, or legal consequence arising from reliance on this calculator;</li>
              <li>Errors or omissions due to legislative changes not yet reflected in this tool;</li>
              <li>Under-stamping penalties under <strong>Section 35, Indian Stamp Act 1899</strong> (up to 10× deficient duty + imprisonment);</li>
              <li>Rejection, impounding, or invalidation of documents by Sub-Registrar offices;</li>
              <li>Any direct, indirect, incidental, consequential, or punitive damages of any nature whatsoever;</li>
              <li>Loss of revenue, business, or opportunity arising from use of this tool.</li>
            </ol>

            <h3>4. No Warranty on Accuracy</h3>
            <p>
              Stamp duty laws change frequently through Union Budgets, State Budgets, and government notifications.{' '}
              <strong>We make no warranty, express or implied</strong>, that the rates shown are complete, accurate,
              or current. Always verify with the official Sub-Registrar office or relevant state portal before execution.
            </p>

            <h3>5. AI Document Analysis — Third Party Services</h3>
            <p>
              The AI analysis feature uses third-party providers (Anthropic, Google, OpenAI, Microsoft Azure). Your
              documents and API keys are processed only in your browser and are <strong>not stored, logged, or transmitted</strong>{' '}
              to EveryStampDuty.com. AI analysis is illustrative only and is not a substitute for professional legal review.
            </p>

            <h3>6. Location Data</h3>
            <p>
              This tool may request your device's approximate location <strong>solely to auto-select your state</strong> for
              convenience. Location data is used only within your browser session and is never stored, transmitted, or shared.
            </p>

            <h3>7. No Attorney-Client Relationship</h3>
            <p>
              Use of this website does not create any attorney-client, chartered accountant-client, or any other professional
              relationship between you and EveryStampDuty.com or its operators.
            </p>

            <h3>8. Intellectual Property</h3>
            <p>
              All content, design, and code on this website is the property of EveryStampDuty.com. Reproduction or
              redistribution without permission is prohibited.
            </p>

            <h3>9. Governing Law &amp; Jurisdiction</h3>
            <p>
              These Terms are governed by and construed in accordance with the laws of India. Any disputes shall be subject
              to the <strong>exclusive jurisdiction of courts in India</strong>. If any provision is found invalid, the
              remaining provisions shall continue in full force.
            </p>

            <h3>10. Acceptance Constitutes Binding Agreement</h3>
            <p>
              By clicking "I Accept" below, you confirm you have read, understood, and agree to be bound by these Terms.{' '}
              <strong>If you do not agree, please do not use this calculator.</strong>
            </p>
          </div>

          {/* Checkbox */}
          <div className="tcheck-wrap">
            <div className="tcheck">
              <input
                type="checkbox"
                id="tck"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
              <label htmlFor="tck">
                <strong>I have fully read and understood</strong> the above Terms of Use and Disclaimer. I agree that all stamp duty
                figures shown are <strong>estimates only</strong>. I will independently verify all calculations and consult a
                qualified legal professional before executing any instrument. I <strong>unconditionally hold EveryStampDuty.com
                and its operators harmless</strong> from any liability, loss, or legal consequence arising from my use of this calculator.
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="tbox-footer">
          <button
            id="tbtn"
            className={checked ? 'on' : ''}
            disabled={!checked}
            onClick={handleAccept}
          >
            ✓&nbsp; I Accept — Proceed to Stamp Duty Calculator
          </button>
          <div className="tbox-meta">
            <span>This disclaimer appears on every visit</span> to ensure your continued awareness &amp; our legal protection.<br />
            Acceptance is logged with timestamp for audit purposes. Version: FY 2026–27 · Last reviewed: May 2026
          </div>
        </div>
      </div>
    </div>
  );
}
