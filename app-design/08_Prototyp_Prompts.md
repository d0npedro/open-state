# Open State – App-Prototyp-Prompts & Figma-Konzept

*Basis: docs/01–07*

---

## 1. Midjourney / Flux – Bildprompts

Die folgenden Prompts erzeugen visuelles Material für Präsentationen, Pitches und das Design System. Alle Bilder folgen der Open State Designsprache: staatlich-vertrauenswürdig, modern, menschlich, klar.

---

### Prompt 1 – App-Hero-Screen (Onboarding)

**Verwendungszweck:** Hauptbild für App Store, Pitch-Deck Deckblatt, Pressematerial

```
A sleek modern German government app interface on a smartphone screen,
hero onboarding screen design. Dark navy blue (#003F8C) and white color
palette with soft green accents (#00A550). Clean sans-serif typography,
BundesSans font style. Central illustration: abstract geometric network
of glowing nodes connecting a single person silhouette to multiple
building icons (representing government agencies). The illustration
is friendly and warm, NOT bureaucratic or cold. Background: soft
light gray gradient (#F5F7FA). Bottom: large primary call-to-action
button "Jetzt starten". Top: "Open State" wordmark in white on navy.
Floating on a matte white device mockup (iPhone 15 Pro). Ultra-clean,
minimal UI. No stock photo aesthetics. --ar 9:16 --style raw --v 6
--q 2
```

**Flux-Variante:**
```
photorealistic smartphone mockup showing a government services app,
German e-government, clean minimal UI design, navy blue and white
interface, abstract connection network illustration in the center,
trust-inspiring government aesthetic but modern and human-centered,
soft shadows, matte device, white studio background, product photography
style, 8k resolution
```

---

### Prompt 2 – Dashboard / Home Screen

**Verwendungszweck:** Showcase der Kernfunktionalität, Investoren-Demo, App-Store-Screenshots

```
Mobile app UI design screenshot of a personal government dashboard,
Open State German e-government app. Light theme (#F5F7FA background).
Top section: personalized greeting "Guten Morgen, Anna" with subtle
avatar. Highlighted alert card in soft amber: pending tax declaration
with green "Jetzt erledigen" button. Below: two status cards in a
grid – one with green checkmark (completed Ummeldung), one with
amber clock icon (pending Bußgeld case, "3 Wochen"). Quick action
tiles: 4 icons in a row (house, briefcase, scales, euro sign) with
German labels. Bottom section: privacy activity widget showing
"Datentresor" with a subtle lock icon and last access timestamp.
Bottom navigation bar with 4 icons. Extremely clean, no clutter,
generous whitespace. Modern German government aesthetic.
--ar 9:16 --style raw --v 6
```

---

### Prompt 3 – CaseMatch AI Analyse-Screen

**Verwendungszweck:** KI-Kernfunktion visualisieren, Medienberichte, Tech-Pitches

```
Mobile app screen showing AI-powered legal case analysis interface,
German administrative law assistant. Dark-mode variant with deep
navy background. Center: large circular progress indicator showing
"78%" in bright green with label "Erfolgsquote Widerspruch". Below:
horizontal bar chart showing key factors – positive factors in green
("Parkschein vorhanden"), negative factors in amber ("Halteverbot-Zone").
Confidence indicator: "Konfidenz: 74%" with info icon. Three action
cards below: primary card "Widerspruch einlegen" (highlighted, green),
secondary "Vergleich 62€" (outlined), tertiary "Bezahlen 80€" (gray).
Small disclaimer text at bottom. Subtle AI analysis wave animation
implied through layered background elements. Ultra-clean data
visualization design, government-grade trustworthy aesthetics.
--ar 9:16 --style raw --v 6
```

---

### Prompt 4 – Erfolgs-Screen / Completion Animation

**Verwendungszweck:** Marketing-Material „Vorher / Nachher", Social Media, Kampagne

```
Split composition: LEFT side shows stressed person at a physical
German government office (Bürgeramt), long queue, paper forms,
clock showing 2 hours wait, muted gray-brown tones, slight blur.
RIGHT side: same person relaxed at home holding a smartphone,
bright and warm lighting, the phone screen shows a large animated
green checkmark with German text "Erledigt in 2 Min 14 Sek" and
"Ummeldung abgeschlossen", multiple green checkmarks cascading
down the screen for each notified agency. Clean white background
on right. Dividing line in the center with Open State logo.
Photorealistic style, advertising campaign quality, optimistic mood.
--ar 16:9 --style raw --v 6
```

**Alternativer Flux-Prompt (nur App-Screen):**
```
mobile app success screen, large animated green checkmark center,
completion screen design, German text "Erledigt in 2 Min 14 Sek",
cascading smaller checkmarks below for each agency, confetti-like
subtle celebration particles in brand colors (navy, green, white),
clean minimal design, warm congratulatory feeling, government app
but human and celebratory
```

---

### Prompt 5 – Datentresor / Privacy Screen

**Verwendungszweck:** Datenschutz-Kommunikation, politische Pitches, Vertrauensaufbau

```
Mobile app privacy control center interface, "Datentresor" data vault
screen. Deep navy header with golden lock icon (#003F8C background,
gold lock). Clean white card-based layout below. Timeline/activity
log showing recent data accesses: each entry has an agency icon,
agency name, timestamp, data type accessed, and a subtle verified
checkmark. Color-coded: green for user-initiated, blue for authorized
agency access. Top summary: "Ihr Datentresor – Alles unter Ihrer
Kontrolle". Bottom section: toggle switches for each active data
sharing consent with individual agency logos. Export button and
account deletion option in subtle red at very bottom. Extremely
clean, reassuring, trustworthy design language. Zero clutter.
Communicates: YOU are in control. --ar 9:16 --style raw --v 6
```

---

## 2. Figma-Prototyp-Konzept

### 2.1 Projektstruktur (Figma-Datei)

```
Open State – Design File
│
├── 📁 0_Design System
│   ├── Colors (Tokens)
│   ├── Typography
│   ├── Icons (Phosphor Icons – Open Source)
│   ├── Spacing & Grid
│   ├── Shadows & Elevation
│   ├── Motion Principles
│   └── Component Library
│       ├── Atoms (Button, Input, Badge, Icon)
│       ├── Molecules (Card, ListItem, Alert, ProgressBar)
│       ├── Organisms (Navigation, Header, Form)
│       └── Templates (PageLayouts)
│
├── 📁 1_Flows (Wireframes Lo-Fi)
│   ├── Flow 01 – Onboarding & eID
│   ├── Flow 02 – Home Dashboard
│   ├── Flow 03 – Wohnsitzummeldung
│   ├── Flow 04 – CaseMatch Bußgeld
│   ├── Flow 05 – Steuererklärung
│   ├── Flow 06 – Datentresor
│   ├── Flow 07 – Gewerbeanmeldung
│   └── Flow 08 – Einstellungen & Barrierefreiheit
│
├── 📁 2_Screens (Hi-Fi Design)
│   ├── iOS Screens (375px, iPhone 15 Pro)
│   ├── Android Screens (360px, Pixel 8)
│   ├── PWA Screens (1440px, Desktop)
│   └── Kiosk Screens (1080px, Touchscreen)
│
├── 📁 3_Prototypes (Interaktiv)
│   ├── Prototype A – Onboarding Journey (präsentierfähig)
│   ├── Prototype B – Ummeldung (Usability-Test)
│   ├── Prototype C – CaseMatch (Stakeholder-Demo)
│   └── Prototype D – Vollständige App (Investor Demo)
│
└── 📁 4_Assets
    ├── Illustrationen (SVG, generiert mit obigen Prompts)
    ├── Icons (Phosphor + Custom Government Icons)
    ├── Animationen (Lottie JSON-Dateien)
    └── Mockups (Device Frames)
```

### 2.2 Design System – Kern-Komponenten

**Primäre Komponenten (als Figma Auto-Layout):**

| Komponente | Varianten | Zustände |
|------------|-----------|---------|
| Button | Primary, Secondary, Ghost, Danger | Default, Hover, Active, Disabled, Loading |
| Input Field | Text, PIN, Search, Date | Empty, Focused, Filled, Error, Success |
| Card | Info, Status, Action, Alert | Default, Highlighted, Disabled |
| Status Badge | Success, Warning, Error, Pending | — |
| Progress Bar | Linear, Circular, Steps | 0–100% |
| Bottom Sheet | Small, Medium, Full | Collapsed, Expanded |
| Alert Banner | Info, Warning, Success, Error | Dismissible, Persistent |
| Navigation | Bottom Tab Bar, Top Header | Default, Scrolled |

**Tokens-Setup (Figma Variables):**
```
Token-Struktur:
├── color/brand/primary        → #003F8C
├── color/brand/primary-dark   → #002A6B
├── color/brand/accent         → #00A550
├── color/status/success       → #00A550
├── color/status/warning       → #E8A000
├── color/status/error         → #C0392B
├── color/neutral/background   → #F5F7FA
├── color/neutral/surface      → #FFFFFF
├── color/neutral/text-primary → #1A1A2E
├── color/neutral/text-secondary → #6B7280
├── spacing/xs → 4px
├── spacing/sm → 8px
├── spacing/md → 16px
├── spacing/lg → 24px
├── spacing/xl → 32px
├── radius/sm → 8px
├── radius/md → 12px
├── radius/lg → 20px
└── radius/full → 9999px
```

### 2.3 Interaktiver Prototype – Kernflows

**Prototype A: Onboarding (für Usability-Tests)**
```
Startscreen
    ↓ [Tap "Jetzt starten"]
Erklärungs-Slides (3x swipe)
    ↓ [Tap "Loslegen"]
eID-Scan Screen
    ↓ [Animate: NFC-Ring pulsiert → Grün]
PIN-Eingabe (6-stellig)
    ↓ [Tap "Bestätigen"]
Erfolgsscreen + Willkommens-Animation
    ↓ [Tap "Zur App"]
Home Dashboard (personalisiert)
```

**Prototype B: Ummeldung (für Stakeholder-Demo)**
```
Home Dashboard
    ↓ [Tap "Ummeldung" Tile]
Schritt 1: Adresseingabe (Autocomplete animiert)
    ↓ [Tap "Weiter"]
Schritt 2: Behörden-Übersicht (Toggles aktivierbar)
    ↓ [Tap "Fortfahren"]
Schritt 3: Bestätigungsscreen
    ↓ [Tap "Jetzt bestätigen" → Face ID Animation]
Erfolgsscreen (Checkmarks erscheinen animiert, einer nach dem anderen)
    ↓ [Tap "Meldebestätigung öffnen"]
PDF-Vorschau
```

**Prototype C: CaseMatch (für Investoren)**
```
Home Dashboard
    ↓ [Tap "Bußgeld" Tile]
Scan-Screen (Kamera-Animation)
    ↓ [Animate: OCR-Scanning]
Erkannte Daten bestätigen
    ↓ [Tap "Stimmt so"]
Situation auswählen (Radio Buttons)
    ↓ [Tap "Weiter"]
Analyse-Loading (AI-Wave-Animation, 2 Sek)
    ↓ [Animate: Ergebnis baut sich auf]
Analyse-Ergebnis (78% Kreis, Faktoren, Optionen)
    ↓ [Tap "Widerspruch einlegen"]
Schriftsatz-Vorschau
    ↓ [Tap "Einreichen" → eID-Bestätigung]
Bestätigungsscreen + Aktenzeichen
```

### 2.4 Figma-Plugin-Empfehlungen

| Plugin | Zweck |
|--------|-------|
| **Tokens Studio** | Design Token Management, Sync mit Code |
| **Stark** | Barrierefreiheitsprüfung (Kontrast, Colorblind) |
| **LottieFiles** | Animations-Integration |
| **Unsplash** | Placeholder-Fotos in Mockups |
| **iconify** | Phosphor Icons einbinden |
| **Figma to Code** | React/Swift/Kotlin Code-Generierung |
| **Content Reel** | Realistische Testdaten (Namen, Adressen) |
| **A11y – Focus Orderer** | Fokus-Reihenfolge für Barrierefreiheit |

### 2.5 Handoff-Spezifikation (Dev Mode)

Für die Entwicklerübergabe werden in Figma folgende Annotationen gepflegt:

- **Abstände:** Alle Abstände in 8px-Schritten, annotiert
- **Komponentenzustände:** Alle interaktiven Zustände documentiert
- **Animationen:** Lottie-Dateien verlinkt, Timing-Werte annotiert
- **Zugänglichkeit:** ARIA-Labels, Fokus-Reihenfolge, Mindestgröße Touchziele (44×44px)
- **Responsive Rules:** Auto-Layout-Regeln für verschiedene Schriftgrößen
- **Copy:** Alle Texte in Figma-Textstrings exportierbar (i18n-vorbereitet)

---

## 3. Illustrationsstil-Guide

Alle Illustrationen in Open State folgen einem einheitlichen Stil:

**Stil:** Geometrisch-abstrakt, mit menschlichen Elementen
- Keine realistischen Fotos von Menschen (Privatsphäre, Repräsentation)
- Abstrakte Silhouetten + geometrische Formen
- Konsistente Farbpalette: Nur Brand-Farben + Weiß
- Strichstärke: 2px, abgerundete Enden
- Animierbar: Alle Illustrationen als Lottie-fähige SVGs

**5 Kern-Illustrationen:**
1. **Verbindung** (Onboarding): Netzwerk aus Punkten und Linien, Mensch in der Mitte
2. **Schlüssel & Tresor** (Datenschutz): Stilisierter Schlüssel mit Schloss
3. **Stoppuhr & Häkchen** (Effizienz): Minimal-Stoppuhr mit großem grünen Häkchen
4. **KI-Analyse** (CaseMatch): Abstrakte Balkendiagramme + Gehirn-Netzwerk-Hybrid
5. **Erfolg** (Completion): Aufsteigende Häkchen-Kaskade, konfetti-artig

---

*Erstellt auf Basis: docs/01_Master_Blueprint.md bis app-design/07_UI_UX_User_Flows.md*
