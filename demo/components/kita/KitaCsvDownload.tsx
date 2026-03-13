'use client';

import type { KitaLagebild } from '@/types/kita';

export function KitaCsvDownload({ lagebild }: { lagebild: KitaLagebild }) {
  function handleDownload() {
    const header = [
      'Planungsraum',
      'Genehmigte Plätze U3',
      'Genehmigte Plätze Ü3',
      'Belegte Plätze U3',
      'Belegte Plätze Ü3',
      'Freie Plätze U3',
      'Freie Plätze Ü3',
      'Auslastungsgrad (%)',
      'Versorgungsquote U3 (%)',
      'Versorgungsquote Ü3 (%)',
      'Wartelistenbestand',
      'Wartelistendruck-Faktor',
      'Personalausfallquote (%)',
    ].join(';');

    const rows = lagebild.planungsraeume.map(pr => [
      pr.bezeichnung,
      pr.genehmmigtePlaetzeU3,
      pr.genehmmigtePlaetzeUe3,
      pr.belegtePlaetzeU3,
      pr.belegtePlaetzeUe3,
      pr.freiePlaetzeU3,
      pr.freiePlaetzeUe3,
      pr.auslastungsgradProzent.toFixed(1).replace('.', ','),
      pr.versorgungsquote.u3.toFixed(1).replace('.', ','),
      pr.versorgungsquote.ue3.toFixed(1).replace('.', ','),
      pr.wartelisteBestand,
      pr.wartelisteDruckFaktor.toFixed(1).replace('.', ','),
      pr.personalAusfallquoteProzent.toFixed(1).replace('.', ','),
    ].join(';'));

    const csv = [
      `# Transparenzbericht Kindertagesbetreuung ${lagebild.kommuneBezeichnung}`,
      `# Datenstand: ${lagebild.stand} | Berichtszeitraum: ${lagebild.berichtszeitraum}`,
      `# Freigegeben: ${lagebild.freigegebenAm} | Version: ${lagebild.version}`,
      '',
      header,
      ...rows,
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kita-transparenzbericht-${lagebild.stand}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button className="btn btn-secondary" onClick={handleDownload} style={{ fontSize: '0.875rem' }}>
      CSV herunterladen (Planungsraumdaten)
    </button>
  );
}
