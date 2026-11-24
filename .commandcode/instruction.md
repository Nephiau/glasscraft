# SPEC.md — Glasscraft (Deterministic JSX Implementation Specification)

## 1. AI Execution Rules & Strict Constraints

You are implementing **Glasscraft**, a client-side CSS & Tailwind Glassmorphism Generator. Follow every specification in this document literally.

### STRICT DO / DO NOT RULES

* **DO** implement the entire application inside a single JavaScript/JSX file: `src/App.jsx`.
* **DO** use standard ES6+ JavaScript and React JSX syntax.
* **DO** use only Tailwind CSS utility classes and inline `style` attributes for dynamic CSS properties.
* **DO** use `lucide-react` exclusively for all icons.
* **DO NOT** use TypeScript syntax, type annotations, interfaces, or `.ts` / `.tsx` files.
* **DO NOT** create additional `.jsx`, `.js`, or `.css` files.
* **DO NOT** install extra packages (no Framer Motion, no Radix UI, no state libraries, no toast libraries).
* **DO NOT** add unrequested features (no dark/light app theme toggle, no localStorage history drawer, no export-to-PNG, no extra tabs, no modals, no footer links).
* **DO NOT** use external image URLs (`https://...`) anywhere in the code; all preview backdrops must be pure CSS.
* **DO NOT** deviate from the exact color tokens, dimensions, copy strings, or formulas defined below.

## 2. Target File & Environment

* **Target File:** `src/App.jsx` (default export `App`)
* **Required Package:** `lucide-react`
* **Styling:** Tailwind CSS (configured in host Vite + React project)
* **Allowed Icon Imports from `lucide-react`:**
  `Check`, `Copy`, `Moon`, `Play`, `RotateCcw`, `SkipBack`, `SkipForward`, `Sparkles`, `Sun`

## 3. Exact Constants & Data Structures

Define these exact constants at the top of `src/App.jsx`:

### Exact Default Configuration

```javascript
const DEFAULT_CONFIG = {
  blur: 16,
  opacity: 0.22,
  saturation: 140,
  borderRadius: 16,
  borderOpacity: 0.35,
  shadowOpacity: 0.14,
  tintColor: '#ffffff',
};
```

### Exact Presets Array (4 Items Only)

```javascript
const PRESETS = [
  {
    id: 'frosted-light',
    name: 'Frosted Light',
    backdrop: 'mesh-cyan',
    lightText: true,
    config: {
      blur: 16,
      opacity: 0.22,
      saturation: 140,
      borderRadius: 16,
      borderOpacity: 0.35,
      shadowOpacity: 0.14,
      tintColor: '#ffffff',
    },
  },
  {
    id: 'midnight-smoke',
    name: 'Midnight Smoke',
    backdrop: 'dark-grid',
    lightText: true,
    config: {
      blur: 20,
      opacity: 0.55,
      saturation: 150,
      borderRadius: 20,
      borderOpacity: 0.18,
      shadowOpacity: 0.35,
      tintColor: '#0f172a',
    },
  },
  {
    id: 'cyan-mist',
    name: 'Cyan Mist',
    backdrop: 'dark-grid',
    lightText: true,
    config: {
      blur: 14,
      opacity: 0.18,
      saturation: 165,
      borderRadius: 16,
      borderOpacity: 0.35,
      shadowOpacity: 0.18,
      tintColor: '#2dd4bf',
    },
  },
  {
    id: 'warm-rice',
    name: 'Warm Rice Paper',
    backdrop: 'warm-editorial',
    lightText: false,
    config: {
      blur: 18,
      opacity: 0.52,
      saturation: 120,
      borderRadius: 12,
      borderOpacity: 0.5,
      shadowOpacity: 0.08,
      tintColor: '#faf8f5',
    },
  },
];
```

### Exact Tint Swatches & Backdrops

```javascript
const TINT_SWATCHES = ['#ffffff', '#0f172a', '#2dd4bf', '#faf8f5', '#818cf8'];

const BACKDROP_OPTIONS = [
  { id: 'mesh-cyan', label: 'Cyan Mesh' },
  { id: 'warm-editorial', label: 'Warm Editorial' },
  { id: 'dark-grid', label: 'Dark Grid' },
  { id: 'sunset-orbs', label: 'Sunset Orbs' },
];
```

### Exact Slider Definitions (6 Sliders in Exact Order)

| `key` | `label` | `min` | `max` | `step` | `display` format |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `blur` | `Backdrop Blur` | `0` | `40` | `1` | `${config.blur}px` |
| `opacity` | `Tint Opacity` | `0` | `1` | `0.01` | `${Math.round(config.opacity * 100)}%` |
| `saturation` | `Saturation` | `100` | `200` | `5` | `${config.saturation}%` |
| `borderRadius` | `Corner Radius` | `0` | `32` | `1` | `${config.borderRadius}px` |
| `borderOpacity` | `Border Opacity` | `0` | `1` | `0.02` | `${Math.round(config.borderOpacity * 100)}%` |
| `shadowOpacity` | `Shadow Depth` | `0` | `0.5` | `0.02` | `${Math.round(config.shadowOpacity * 100)}%` |

## 4. Deterministic Utility Functions (Exact Logic)

### 4.1 `hexToRgba(hex, alpha, compact = false)`

1. Strip leading `#` and trim whitespace: `const clean = hex.replace('#', '').trim();`
2. Default RGB channels to `r = 255, g = 255, b = 255`.
3. If `/^[0-9a-fA-F]{3}$/.test(clean)`:
   * `r = parseInt(clean[0] + clean[0], 16);`
   * `g = parseInt(clean[1] + clean[1], 16);`
   * `b = parseInt(clean[2] + clean[2], 16);`
4. Else if `/^[0-9a-fA-F]{6}$/.test(clean)`:
   * `r = parseInt(clean.slice(0, 2), 16);`
   * `g = parseInt(clean.slice(2, 4), 16);`
   * `b = parseInt(clean.slice(4, 6), 16);`
5. Round alpha to max 2 decimals: `const a = Number(alpha.toFixed(2));`
6. If `compact === true`, return `` `rgba(${r},${g},${b},${a})` `` (no spaces—required for Tailwind arbitrary values).
7. Otherwise, return `` `rgba(${r}, ${g}, ${b}, ${a})` ``.

**Verification Assertions:**
* `hexToRgba('#ffffff', 0.22, false)` -> `'rgba(255, 255, 255, 0.22)'`
* `hexToRgba('#0f172a', 0.55, true)` -> `'rgba(15,23,42,0.55)'`
* `hexToRgba('#invalid', 0.5, false)` -> `'rgba(255, 255, 255, 0.5)'`

### 4.2 `generatePlainCSS(c)`

Must output this exact multi-line template:

```javascript
function generatePlainCSS(c) {
  return `.glass-surface {
  background: ${hexToRgba(c.tintColor, c.opacity, false)};
  backdrop-filter: blur(${c.blur}px) saturate(${c.saturation}%);
  -webkit-backdrop-filter: blur(${c.blur}px) saturate(${c.saturation}%);
  border-radius: ${c.borderRadius}px;
  border: 1px solid ${hexToRgba(c.tintColor, c.borderOpacity, false)};
  box-shadow: 0 8px 32px rgba(0, 0, 0, ${Number(c.shadowOpacity.toFixed(2))});
}`;
}
```

### 4.3 `generateTailwindCSS(c)`

Must output this exact single-line string (zero internal spaces inside brackets):

```javascript
function generateTailwindCSS(c) {
  const bg = hexToRgba(c.tintColor, c.opacity, true);
  const border = hexToRgba(c.tintColor, c.borderOpacity, true);
  const shadow = Number(c.shadowOpacity.toFixed(2));
  return `bg-[${bg}] backdrop-blur-[${c.blur}px] backdrop-saturate-[${c.saturation}%] rounded-[${c.borderRadius}px] border border-[${border}] shadow-[0_8px_32px_rgba(0,0,0,${shadow})]`;
}
```

## 5. Exact Component State & Event Handlers

Inside `App()`, declare only these 6 state variables:

1. `const [config, setConfig] = useState(DEFAULT_CONFIG);`
2. `const [activePresetId, setActivePresetId] = useState('frosted-light');`
3. `const [backdrop, setBackdrop] = useState('mesh-cyan');`
4. `const [lightText, setLightText] = useState(true);`
5. `const [format, setFormat] = useState('css');`
6. `const [copied, setCopied] = useState(false);`

### Exact State Transitions

* **Slider or Color Change (`updateField(key, value)`):** Updates `config[key]` (`setConfig((prev) => ({ ...prev, [key]: value }))`) and sets `setActivePresetId(null)`.
* **Preset Click (`applyPreset(preset)`):** Sets `config` to `{ ...preset.config }`, `backdrop` to `preset.backdrop`, `lightText` to `preset.lightText`, and `activePresetId` to `preset.id`.
* **Reset Click (`handleReset()`):** Resets `config` to `DEFAULT_CONFIG`, `backdrop` to `'mesh-cyan'`, `lightText` to `true`, and `activePresetId` to `'frosted-light'`.
* **Copy Click (`handleCopy()`):**
  * Attempts `await navigator.clipboard.writeText(generatedCode)`.
  * Includes a `catch` fallback creating a temporary `<textarea>`, selecting its text, and calling `document.execCommand('copy')` so copying works in restricted iframes.
  * Sets `copied` to `true` and resets `copied` to `false` after `1500` milliseconds.

## 6. Exact Layout & Tailwind Class Blueprint

### 6.1 Root Container
* `<div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-teal-400/30">`

### 6.2 Sticky Top Header (`<header>`)
* Outer classes: `sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md`
* Inner container: `max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4`
* **Left Brand Group:**
  * Icon badge: `w-8 h-8 rounded-lg bg-teal-400/15 border border-teal-400/30 flex items-center justify-center text-teal-300` containing `<Sparkles className="w-4 h-4" />`
  * Title (`<h1>`): `text-sm font-semibold tracking-tight text-white` -> Exact text: `Glasscraft`
  * Subtitle (`<p>`): `text-xs text-zinc-400` -> Exact text: `Visual CSS & Tailwind Glassmorphism Generator`
* **Right Preset & Reset Group:** `flex flex-wrap items-center gap-2`
  * Render the 4 `PRESETS` as `<button>` elements:
    * Active (`activePresetId === preset.id`): `px-3 py-1.5 rounded-lg text-xs font-medium bg-teal-400/15 text-teal-300 border border-teal-400/30 transition-colors`
    * Inactive: `px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors`
  * Reset button (`aria-label="Reset to defaults"`): `p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors` containing `<RotateCcw className="w-4 h-4" />`.

### 6.3 Main Two-Column Grid (`<main>`)
* Classes: `max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start`

### 6.4 Left Column: Surface Controls (`<section className="lg:col-span-5 ...">`)
* Card classes: `lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-6`
* Section heading (`<h2>`): `text-xs font-semibold uppercase tracking-wider text-zinc-400` -> Exact text: `Surface Controls`
* **Sliders List (`space-y-4`):**
  * Each row has a header `<div className="flex items-center justify-between mb-1.5">`:
    * `<label htmlFor={item.key} className="text-xs font-medium text-zinc-300">{item.label}</label>`
    * `<span className="font-mono text-xs tabular-nums text-teal-300 bg-teal-400/10 px-2 py-0.5 rounded">{item.display}</span>`
  * `<input id={item.key} type="range" ... onChange={(e) => updateField(item.key, parseFloat(e.target.value))} className="w-full h-1.5 bg-zinc-800 rounded-lg accent-teal-400 cursor-pointer" />`
* **Tint Color Block (`pt-4 border-t border-zinc-800 space-y-3`):**
  * Header row: `flex items-center justify-between` with `<span className="text-xs font-medium text-zinc-300">Tint Color</span>` and `<span className="font-mono text-xs uppercase text-zinc-400">{config.tintColor}</span>`.
  * Controls row: `flex items-center gap-2.5`
    * 5 swatch `<button>` elements (`w-7 h-7 rounded-full border transition-transform`), highlighting the matching swatch with `scale-110 ring-2 ring-teal-400 border-zinc-950` and others with `border-zinc-700 hover:scale-105`.
    * Right-aligned color input group (`ml-auto flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1`):
      * `<input type="color" aria-label="Pick tint color" value={/^#[0-9a-fA-F]{6}$/.test(config.tintColor) ? config.tintColor : '#ffffff'} onChange={(e) => updateField('tintColor', e.target.value)} className="w-5 h-5 bg-transparent border-0 cursor-pointer" />`
      * `<input type="text" aria-label="Tint hex code" maxLength={7} value={config.tintColor} onChange={(e) => updateField('tintColor', e.target.value)} className="w-16 bg-transparent font-mono text-xs text-zinc-200 focus:outline-none" />`

### 6.5 Right Column: Preview Stage & Code Output (`<section className="lg:col-span-7 flex flex-col gap-6">`)

#### A. Preview Stage Card (`bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-4`)
* **Stage Toolbar (`flex flex-wrap items-center justify-between gap-2`):**
  * Left: 4 backdrop buttons (`BACKDROP_OPTIONS`):
    * Active: `px-2.5 py-1 rounded-lg text-xs font-medium bg-teal-400/15 text-teal-300 border border-teal-400/30`
    * Inactive: `px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800`
  * Right: Foreground text contrast toggle button (`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700`):
    * Renders `<Sun className="w-3.5 h-3.5" />` + `Light Text` when `lightText === true`, or `<Moon className="w-3.5 h-3.5" />` + `Dark Text` when `lightText === false`.
* **Stage Viewport (`relative h-[360px] rounded-xl overflow-hidden flex items-center justify-center p-6 select-none`):**
  Render ONLY the active backdrop layer (`absolute inset-0`):
  1. `'mesh-cyan'`:
     * Container: `absolute inset-0 bg-gradient-to-br from-slate-900 via-teal-950 to-indigo-950`
     * Orb 1: `absolute -top-10 -left-10 w-64 h-64 rounded-full bg-teal-400/50 blur-2xl`
     * Orb 2: `absolute bottom-4 right-8 w-72 h-72 rounded-full bg-indigo-500/50 blur-2xl`
     * Orb 3: `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full bg-cyan-300/40 blur-xl`
  2. `'warm-editorial'`:
     * Container: `absolute inset-0 bg-[#faf8f5]`
     * Circle 1: `absolute top-8 left-12 w-44 h-44 rounded-full bg-teal-300/70`
     * Circle 2: `absolute bottom-8 right-14 w-52 h-52 rounded-full bg-amber-300/70`
     * Watermark text: `absolute inset-0 flex items-center justify-center pointer-events-none` containing `<span className="text-6xl font-black tracking-tighter text-zinc-900/15">GLASSCRAFT</span>`
  3. `'dark-grid'`:
     * Container: `absolute inset-0 bg-zinc-950` with inline style:
       `backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px'`
     * Orb 1: `absolute top-10 right-16 w-48 h-48 rounded-full bg-teal-400/35 blur-2xl`
     * Orb 2: `absolute bottom-10 left-16 w-48 h-48 rounded-full bg-violet-500/35 blur-2xl`
  4. `'sunset-orbs'`:
     * Container: `absolute inset-0 bg-gradient-to-tr from-rose-950 via-amber-900 to-purple-950`
     * Orb 1: `absolute top-6 left-16 w-56 h-56 rounded-full bg-orange-400/60 blur-xl`
     * Orb 2: `absolute bottom-6 right-12 w-60 h-60 rounded-full bg-pink-500/50 blur-xl`

* **Live Glass Sample Card (centered inside Stage Viewport):**
  * Inline `style`:
    * `backgroundColor: hexToRgba(config.tintColor, config.opacity, false)`
    * `backdropFilter: \`blur(${config.blur}px) saturate(${config.saturation}%)\``
    * `WebkitBackdropFilter: \`blur(${config.blur}px) saturate(${config.saturation}%)\``
    * `borderRadius: \`${config.borderRadius}px\``
    * `border: \`1px solid ${hexToRgba(config.tintColor, config.borderOpacity, false)}\``
    * `boxShadow: \`0 8px 32px rgba(0, 0, 0, ${Number(config.shadowOpacity.toFixed(2))})\``
  * Classes: `relative z-10 w-full max-w-[380px] p-5 transition-colors duration-150 ${lightText ? 'text-white' : 'text-zinc-900'}`
  * Exact Card Content:
    * Top row (`flex items-center gap-4`):
      * Artwork square (`w-14 h-14 rounded-xl bg-gradient-to-br from-teal-400 to-indigo-500 flex items-center justify-center shrink-0 shadow-md`) with `<Sparkles className="w-6 h-6 text-white" />`
      * Text stack (`min-w-0 flex-1`):
        * `<p className="text-[11px] uppercase tracking-wider opacity-70 font-medium">Live Surface Preview</p>`
        * `<h3 className="font-semibold text-base truncate">Midnight Ambient Session</h3>`
        * `<p className="text-xs opacity-75 truncate">24-bit Lossless • 96 kHz</p>`
    * Bottom controls (`mt-5 space-y-3`):
      * Progress bar track (`h-1.5 w-full rounded-full overflow-hidden ${lightText ? 'bg-white/20' : 'bg-zinc-900/15'}`) with fill (`h-full w-2/3 rounded-full bg-teal-400`)
      * Playback row (`flex items-center justify-between text-xs opacity-80 font-mono`):
        * Left timestamp: `<span>02:14</span>`
        * Center icons (`flex items-center gap-4`): `<SkipBack className="w-4 h-4" />`, play pill (`w-8 h-8 rounded-full bg-teal-400 text-zinc-950 flex items-center justify-center` with `<Play className="w-3.5 h-3.5 fill-current ml-0.5" />`), `<SkipForward className="w-4 h-4" />`
        * Right timestamp: `<span>03:42</span>`

#### B. Code Output Card (`bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3`)
* Top toolbar (`flex items-center justify-between gap-2`):
  * Format tabs (`flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800`):
    * Button 1 (`format === 'css'`): label `Plain CSS`
    * Button 2 (`format === 'tailwind'`): label `Tailwind CSS`
    * Active tab class: `px-3 py-1 rounded-md text-xs font-medium bg-zinc-800 text-white`
    * Inactive tab class: `px-3 py-1 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-200`
  * Copy button (`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-teal-400 hover:bg-teal-300 text-zinc-950 transition-colors`):
    * When `copied === true`: `<Check className="w-3.5 h-3.5" />` + `Copied!`
    * When `copied === false`: `<Copy className="w-3.5 h-3.5" />` + `Copy Code`
* Code block (`<pre className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 overflow-x-auto text-xs font-mono text-zinc-200 leading-relaxed whitespace-pre-wrap break-all"><code>{generatedCode}</code></pre>`).

## 7. Pre-Completion Verification Checklist

Before finishing, verify every item below:

1. Only `src/App.jsx` was created/modified; zero extra `.jsx`, `.js`, `.ts`, or `.tsx` files exist.
2. Zero TypeScript syntax or type annotations exist anywhere in `src/App.jsx`.
3. Production build (`npm run build`) completes cleanly with zero errors.
4. All 6 sliders, 5 tint swatches, native color picker, hex text input, 4 presets, reset button, 4 backdrops, light/dark text toggle, Plain CSS / Tailwind tabs, and Copy Code button function identically to this specification.