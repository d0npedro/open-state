'use client';

/**
 * ThemeSwitcher – Open State Design System
 *
 * Dezenter, sachlicher Umschalter für Theme und Darstellungsmodus.
 * Wirkt ausschließlich auf die visuelle Darstellung – keine Fachlogik.
 */

import { useState } from 'react';
import { useTheme } from '@/design-system/provider/ThemeProvider';
import { themes, densityModes, ThemeId, DensityMode } from '@/design-system/themes/themes';

export function ThemeSwitcher() {
  const { theme, density, setTheme, setDensity } = useTheme();
  const [open, setOpen] = useState(false);

  const currentTheme = themes.find(t => t.id === theme);
  const currentDensity = densityModes.find(d => d.id === density);

  return (
    <div style={{ position: 'relative' }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Darstellung ändern"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.25)',
          color: 'rgba(255,255,255,0.80)',
          borderRadius: '4px',
          padding: '0.25rem 0.65rem',
          fontSize: '0.75rem',
          cursor: 'pointer',
          fontFamily: 'inherit',
          transition: 'border-color 0.15s, background 0.15s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.55)';
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.25)';
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
        }}
      >
        <span aria-hidden="true" style={{ fontSize: '0.85rem' }}>⊞</span>
        <span>Darstellung</span>
      </button>

      {/* Panel */}
      {open && (
        <>
          {/* Backdrop zum Schließen */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 99 }}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-label="Darstellungseinstellungen"
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 0.5rem)',
              right: 0,
              zIndex: 100,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow)',
              padding: '1rem 1.125rem',
              minWidth: '240px',
              color: 'var(--color-text)',
            }}
          >
            {/* Theme-Auswahl */}
            <fieldset style={{ border: 'none', marginBottom: '0.875rem' }}>
              <legend style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                color: 'var(--color-text-muted)',
                marginBottom: '0.5rem',
                display: 'block',
              }}>
                Theme
              </legend>
              {themes.map(t => (
                <ThemeOption
                  key={t.id}
                  id={t.id}
                  label={t.label}
                  description={t.description}
                  selected={theme === t.id}
                  onSelect={() => setTheme(t.id as ThemeId)}
                />
              ))}
            </fieldset>

            <div style={{ height: '1px', background: 'var(--color-border)', margin: '0.75rem 0' }} />

            {/* Density-Auswahl */}
            <fieldset style={{ border: 'none' }}>
              <legend style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                color: 'var(--color-text-muted)',
                marginBottom: '0.5rem',
                display: 'block',
              }}>
                Darstellungsdichte
              </legend>
              {densityModes.map(d => (
                <ThemeOption
                  key={d.id}
                  id={d.id}
                  label={d.label}
                  description={d.description}
                  selected={density === d.id}
                  onSelect={() => setDensity(d.id as DensityMode)}
                />
              ))}
            </fieldset>

            {/* Hinweis */}
            <p style={{
              marginTop: '0.75rem',
              fontSize: '0.7rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.4,
              borderTop: '1px solid var(--color-border)',
              paddingTop: '0.625rem',
            }}>
              Auswahl wird gespeichert. Keine Auswirkung auf Fachlogik oder Daten.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function ThemeOption({
  id,
  label,
  description,
  selected,
  onSelect,
}: {
  id: string;
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      htmlFor={`theme-opt-${id}`}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.5rem',
        padding: '0.35rem 0.4rem',
        borderRadius: 'var(--radius-sm, 4px)',
        cursor: 'pointer',
        background: selected ? 'var(--color-primary-light)' : 'transparent',
        marginBottom: '0.2rem',
        transition: 'background 0.1s',
      }}
    >
      <input
        id={`theme-opt-${id}`}
        type="radio"
        name={id.includes('dense') || id === 'normal' || id === 'compact' || id === 'accessible' ? 'density' : 'theme'}
        checked={selected}
        onChange={onSelect}
        style={{ marginTop: '0.1rem', accentColor: 'var(--color-primary)', flexShrink: 0 }}
      />
      <span>
        <span style={{
          display: 'block',
          fontSize: 'var(--font-size-sm, 0.875rem)',
          fontWeight: selected ? 600 : 400,
          color: selected ? 'var(--color-primary)' : 'var(--color-text)',
          lineHeight: 1.2,
        }}>
          {label}
        </span>
        <span style={{
          display: 'block',
          fontSize: '0.7rem',
          color: 'var(--color-text-muted)',
          marginTop: '0.1rem',
        }}>
          {description}
        </span>
      </span>
    </label>
  );
}
