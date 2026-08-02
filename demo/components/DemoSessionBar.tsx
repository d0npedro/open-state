'use client';

/**
 * Zeigt nach Demo-Interaktionen (Rückfrage, Upload, Kita-Meldefreigabe) eine Leiste zum Zurücksetzen.
 * Nur sichtbar, wenn die Session vom Ausgangs-Mock abweicht (Q-075 / Q-412).
 */

import { useCallback, useEffect, useState } from 'react';
import { useDemoState } from '@/context/DemoStateContext';
import { useGruendungState } from '@/context/GruendungStateContext';
import { Icon } from '@/components/Icon';
import {
  clearKitaMeldeSession,
  KITA_MELDE_SESSION_EVENT,
  MELDEEINGANG_SESSION_KEY,
  readKitaMeldeSessionFreigabe,
} from '@/types/kitaMeldeeingang';

function SessionBarShell({
  visible,
  onReset,
  label,
}: {
  visible: boolean;
  onReset: () => void;
  label: string;
}) {
  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Demo-Session"
      style={{
        background: 'var(--color-neutral-light)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0.5rem 0',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          flexWrap: 'wrap',
          fontSize: '0.875rem',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text)' }}>
          <Icon name="refresh" size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
          <span>
            <strong>Demo-Session geändert</strong>
            <span style={{ color: 'var(--color-text-muted)' }}>
              {' '}
              — {label}. Keine Speicherung außerhalb dieser Browser-Session.
            </span>
          </span>
        </span>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onReset}
          style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', minHeight: 36, whiteSpace: 'nowrap' }}
        >
          <Icon name="refresh" size={14} />
          Demo zurücksetzen
        </button>
      </div>
    </div>
  );
}

/** AV-Domäne: nutzt DemoStateContext */
export function AvDemoSessionBar() {
  const { hasSessionChanges, resetSession } = useDemoState();
  return (
    <SessionBarShell
      visible={hasSessionChanges}
      onReset={resetSession}
      label="Status, Unterlagen, Verlauf und Fairness-Signale weichen vom Ausgangsfall ab"
    />
  );
}

/** UG-Domäne: nutzt GruendungStateContext */
export function UgDemoSessionBar() {
  const { hasSessionChanges, resetSession } = useGruendungState();
  return (
    <SessionBarShell
      visible={hasSessionChanges}
      onReset={resetSession}
      label="Aktenstatus, Unterlagen, Verlauf und Hinweise weichen vom Ausgangsfall ab"
    />
  );
}

/**
 * Kita-Domäne: Session über localStorage (Meldefreigabe US-KJ-004 → Lagebild).
 * Parität AV/UG: Hinweis + „Demo zurücksetzen“ (Q-412).
 */
export function KitaDemoSessionBar() {
  const [hasSession, setHasSession] = useState(false);

  const refresh = useCallback(() => {
    setHasSession(Boolean(readKitaMeldeSessionFreigabe()));
  }, []);

  useEffect(() => {
    refresh();
    function onStorage(ev: StorageEvent) {
      if (ev.key === MELDEEINGANG_SESSION_KEY || ev.key === null) refresh();
    }
    function onSessionEvent() {
      refresh();
    }
    function onFocus() {
      refresh();
    }
    window.addEventListener('storage', onStorage);
    window.addEventListener(KITA_MELDE_SESSION_EVENT, onSessionEvent);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(KITA_MELDE_SESSION_EVENT, onSessionEvent);
      window.removeEventListener('focus', onFocus);
    };
  }, [refresh]);

  function handleReset() {
    clearKitaMeldeSession();
    // Remount aller Kita-Seiten inkl. React-State der Meldungsseite
    window.location.reload();
  }

  return (
    <SessionBarShell
      visible={hasSession}
      onReset={handleReset}
      label="Meldefreigabe und Meldeeingang weichen vom Ausgangsstand ab"
    />
  );
}
