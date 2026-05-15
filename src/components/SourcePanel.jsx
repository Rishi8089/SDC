import React from 'react';
import { SOURCES } from '../data/sources';

/**
 * SourcePanel — Dynamically renders verified legal sources for the selected instrument.
 * Props:
 *   instrumentKey {string} — the selectedCat value from App.jsx
 */
export default function SourcePanel({ instrumentKey }) {
  const src = instrumentKey ? SOURCES[instrumentKey] : null;

  if (!instrumentKey) return null;

  return (
    <div className="source-panel">
      <div className="source-panel-header">
        <span className="source-verified-badge">✓ Verified Legal Source</span>
        <span className="source-authority-badge">{src ? src.badge : 'ISA 1899'}</span>
      </div>

      {src ? (
        <>
          <div className="source-row source-act">
            <span className="source-label">Governing Act / Article</span>
            <span className="source-value">{src.act}</span>
          </div>

          <div className="source-row source-link-row">
            <span className="source-label">Official Source</span>
            <a
              href={src.link}
              target="_blank"
              rel="noreferrer"
              className="source-link"
            >
              <span className="source-link-icon">↗</span>
              {src.linkText}
            </a>
          </div>

          <div className="source-row">
            <span className="source-label">Regulator / Authority</span>
            <span className="source-value">{src.regulator}</span>
          </div>

          <div className="source-row">
            <span className="source-label">Registration Portal</span>
            <span className="source-value source-portal">{src.portal}</span>
          </div>

          {src.note && (
            <div className="source-note">
              <span className="source-note-icon">ℹ</span>
              {src.note}
            </div>
          )}
        </>
      ) : (
        <div className="source-fallback">
          No specific source data for this instrument. Refer to the Indian Stamp Act 1899 and your state's stamp duty schedule.
        </div>
      )}
    </div>
  );
}
