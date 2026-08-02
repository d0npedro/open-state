/**
 * Skip-Link: erstes fokussierbares Element – springt zum Hauptinhalt (#main-content).
 * WCAG 2.4.1 Bypass Blocks. Visuell verborgen bis Fokus.
 */
export function SkipLink() {
  return (
    <a href="#main-content" className="skip-link">
      Zum Inhalt springen
    </a>
  );
}
