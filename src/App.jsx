import { useState } from 'react';
import {
  Check,
  Copy,
  Moon,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Sparkles,
  Sun,
} from 'lucide-react';

const DEFAULT_CONFIG = {
  blur: 16,
  opacity: 0.22,
  saturation: 140,
  borderRadius: 16,
  borderOpacity: 0.35,
  shadowOpacity: 0.14,
  tintColor: '#ffffff',
};

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

const TINT_SWATCHES = ['#ffffff', '#0f172a', '#2dd4bf', '#faf8f5', '#818cf8'];

const BACKDROP_OPTIONS = [
  { id: 'mesh-cyan', label: 'Cyan Mesh' },
  { id: 'warm-editorial', label: 'Warm Editorial' },
  { id: 'dark-grid', label: 'Dark Grid' },
  { id: 'sunset-orbs', label: 'Sunset Orbs' },
];

const SLIDERS = [
  { key: 'blur', label: 'Backdrop Blur', min: 0, max: 40, step: 1, display: (c) => `${c.blur}px` },
  { key: 'opacity', label: 'Tint Opacity', min: 0, max: 1, step: 0.01, display: (c) => `${Math.round(c.opacity * 100)}%` },
  { key: 'saturation', label: 'Saturation', min: 100, max: 200, step: 5, display: (c) => `${c.saturation}%` },
  { key: 'borderRadius', label: 'Corner Radius', min: 0, max: 32, step: 1, display: (c) => `${c.borderRadius}px` },
  { key: 'borderOpacity', label: 'Border Opacity', min: 0, max: 1, step: 0.02, display: (c) => `${Math.round(c.borderOpacity * 100)}%` },
  { key: 'shadowOpacity', label: 'Shadow Depth', min: 0, max: 0.5, step: 0.02, display: (c) => `${Math.round(c.shadowOpacity * 100)}%` },
];

function hexToRgba(hex, alpha, compact = false) {
  const clean = hex.replace('#', '').trim();
  let r = 255;
  let g = 255;
  let b = 255;

  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (/^[0-9a-fA-F]{6}$/.test(clean)) {
    r = parseInt(clean.slice(0, 2), 16);
    g = parseInt(clean.slice(2, 4), 16);
    b = parseInt(clean.slice(4, 6), 16);
  }

  const a = Number(alpha.toFixed(2));

  if (compact === true) {
    return `rgba(${r},${g},${b},${a})`;
  }

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

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

function generateTailwindCSS(c) {
  const bg = hexToRgba(c.tintColor, c.opacity, true);
  const border = hexToRgba(c.tintColor, c.borderOpacity, true);
  const shadow = Number(c.shadowOpacity.toFixed(2));
  return `bg-[${bg}] backdrop-blur-[${c.blur}px] backdrop-saturate-[${c.saturation}%] rounded-[${c.borderRadius}px] border border-[${border}] shadow-[0_8px_32px_rgba(0,0,0,${shadow})]`;
}

function Backdrop({ backdrop }) {
  if (backdrop === 'mesh-cyan') {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-teal-950 to-indigo-950">
        <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-teal-400/50 blur-2xl" />
        <div className="absolute bottom-4 right-8 w-72 h-72 rounded-full bg-indigo-500/50 blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full bg-cyan-300/40 blur-xl" />
      </div>
    );
  }

  if (backdrop === 'warm-editorial') {
    return (
      <div className="absolute inset-0 bg-[#faf8f5]">
        <div className="absolute top-8 left-12 w-44 h-44 rounded-full bg-teal-300/70" />
        <div className="absolute bottom-8 right-14 w-52 h-52 rounded-full bg-amber-300/70" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-6xl font-black tracking-tighter text-zinc-900/15">GLASSCRAFT</span>
        </div>
      </div>
    );
  }

  if (backdrop === 'dark-grid') {
    return (
      <div
        className="absolute inset-0 bg-zinc-950"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      >
        <div className="absolute top-10 right-16 w-48 h-48 rounded-full bg-teal-400/35 blur-2xl" />
        <div className="absolute bottom-10 left-16 w-48 h-48 rounded-full bg-violet-500/35 blur-2xl" />
      </div>
    );
  }

  if (backdrop === 'sunset-orbs') {
    return (
      <div className="absolute inset-0 bg-gradient-to-tr from-rose-950 via-amber-900 to-purple-950">
        <div className="absolute top-6 left-16 w-56 h-56 rounded-full bg-orange-400/60 blur-xl" />
        <div className="absolute bottom-6 right-12 w-60 h-60 rounded-full bg-pink-500/50 blur-xl" />
      </div>
    );
  }

  return null;
}

function SectionHeading({ index, title, children }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-2.5 mb-5">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[10px] tracking-[0.2em] text-accent">{index}</span>
        <h2 className="font-serif text-xl sm:text-2xl">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function App() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [activePresetId, setActivePresetId] = useState('frosted-light');
  const [backdrop, setBackdrop] = useState('mesh-cyan');
  const [lightText, setLightText] = useState(true);
  const [format, setFormat] = useState('css');
  const [copied, setCopied] = useState(false);

  const updateField = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setActivePresetId(null);
  };

  const applyPreset = (preset) => {
    setConfig({ ...preset.config });
    setBackdrop(preset.backdrop);
    setLightText(preset.lightText);
    setActivePresetId(preset.id);
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    setBackdrop('mesh-cyan');
    setLightText(true);
    setActivePresetId('frosted-light');
  };

  const generatedCode = format === 'css' ? generatePlainCSS(config) : generateTailwindCSS(config);
  const activeBackdropLabel = BACKDROP_OPTIONS.find((option) => option.id === backdrop)?.label ?? '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = generatedCode;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-paper text-ink gc-paper">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <header className="pt-10 sm:pt-14 pb-7">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
                A visual index of translucent surfaces
              </p>
              <h1 className="mt-3 font-serif text-[clamp(3.25rem,9vw,6.5rem)] leading-[0.84] tracking-[-0.035em]">
                Glasscraft
              </h1>
            </div>
            <div className="hidden sm:block text-right pb-1.5 shrink-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Specimen</p>
              <p className="font-serif text-3xl leading-none mt-1.5">No. 04</p>
              <p className="font-mono text-[10px] text-muted mt-1.5">CSS · Tailwind</p>
            </div>
          </div>
          <p className="mt-6 max-w-[56ch] text-sm leading-relaxed text-ink-soft">
            Tune blur, tint, saturation, and depth on a live pane, then take the stylesheet or the
            utility classes with you.
          </p>
        </header>

        <nav aria-label="Preset styles" className="border-y border-ink">
          <div className="flex flex-col sm:flex-row sm:items-stretch">
            <span className="hidden sm:flex items-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted pr-5">
              Presets
            </span>
            <div className="grid grid-cols-2 sm:flex sm:flex-1">
              {PRESETS.map((preset, i) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={
                    activePresetId === preset.id
                      ? 'flex-1 text-left px-4 py-3 bg-ink text-paper border-b border-rule sm:border-b-0 odd:border-r sm:odd:border-r-0 transition-colors'
                      : 'flex-1 text-left px-4 py-3 text-ink hover:bg-paper-deep border-b border-rule sm:border-b-0 odd:border-r sm:odd:border-r-0 transition-colors'
                  }
                >
                  <span
                    className={
                      activePresetId === preset.id
                        ? 'block font-mono text-[10px] tracking-[0.2em] opacity-70'
                        : 'block font-mono text-[10px] tracking-[0.2em] text-muted'
                    }
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="block font-serif text-base leading-tight mt-0.5">{preset.name}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label="Reset to defaults"
              onClick={handleReset}
              className="flex items-center justify-center gap-2 border-t sm:border-t-0 sm:border-l border-ink px-4 min-h-[44px] font-mono text-[10px] uppercase tracking-[0.18em] text-muted hover:text-ink hover:bg-paper-deep transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </nav>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-12 py-10 pb-20">
          <section className="lg:col-span-5">
            <SectionHeading index="01" title="Surface" />

            <div className="divide-y divide-rule border-b border-rule">
              {SLIDERS.map((item) => (
                <div key={item.key} className="py-3.5">
                  <div className="flex items-baseline justify-between mb-1">
                    <label htmlFor={item.key} className="text-sm text-ink-soft">
                      {item.label}
                    </label>
                    <span className="font-mono text-xs tabular-nums text-accent">{item.display(config)}</span>
                  </div>
                  <input
                    id={item.key}
                    type="range"
                    min={item.min}
                    max={item.max}
                    step={item.step}
                    value={config[item.key]}
                    onChange={(e) => updateField(item.key, parseFloat(e.target.value))}
                    className="gc-range"
                  />
                </div>
              ))}
            </div>

            <div className="pt-6">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-ink-soft">Tint</span>
                <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted">{config.tintColor}</span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                {TINT_SWATCHES.map((swatch) => (
                  <button
                    key={swatch}
                    type="button"
                    aria-label={`Tint ${swatch}`}
                    onClick={() => updateField('tintColor', swatch)}
                    style={{ backgroundColor: swatch }}
                    className={
                      config.tintColor === swatch
                        ? 'w-8 h-8 rounded-full border border-ink ring-1 ring-ink ring-offset-2 ring-offset-paper transition-transform'
                        : 'w-8 h-8 rounded-full border border-rule hover:border-ink transition-colors'
                    }
                  />
                ))}
                <div className="ml-auto flex items-center gap-2 border border-rule px-2.5 py-1.5">
                  <input
                    type="color"
                    aria-label="Pick tint color"
                    value={/^#[0-9a-fA-F]{6}$/.test(config.tintColor) ? config.tintColor : '#ffffff'}
                    onChange={(e) => updateField('tintColor', e.target.value)}
                    className="w-6 h-6 bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    aria-label="Tint hex code"
                    maxLength={7}
                    value={config.tintColor}
                    onChange={(e) => updateField('tintColor', e.target.value)}
                    className="w-16 bg-transparent font-mono text-base sm:text-xs text-ink focus:outline-none focus-visible:underline decoration-accent decoration-2 underline-offset-2"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="lg:col-span-7 flex flex-col gap-11">
            <div>
              <SectionHeading index="02" title="Specimen">
                <button
                  type="button"
                  onClick={() => setLightText((prev) => !prev)}
                  className="flex items-center gap-1.5 min-h-[32px] px-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted hover:text-ink transition-colors"
                >
                  {lightText === true ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  {lightText === true ? 'Light text' : 'Dark text'}
                </button>
              </SectionHeading>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4">
                {BACKDROP_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setBackdrop(option.id)}
                    className={
                      backdrop === option.id
                        ? 'min-h-[36px] font-mono text-[10px] uppercase tracking-[0.16em] text-ink border-b border-accent pb-0.5'
                        : 'min-h-[36px] font-mono text-[10px] uppercase tracking-[0.16em] text-muted hover:text-ink border-b border-transparent pb-0.5 transition-colors'
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="border border-ink">
                <div className="relative h-[320px] sm:h-[380px] overflow-hidden flex items-center justify-center p-6 select-none">
                  <Backdrop backdrop={backdrop} />

                  <div
                    className={`relative z-10 w-full max-w-[360px] p-5 transition-colors duration-150 ${lightText ? 'text-white' : 'text-zinc-900'}`}
                    style={{
                      backgroundColor: hexToRgba(config.tintColor, config.opacity, false),
                      backdropFilter: `blur(${config.blur}px) saturate(${config.saturation}%)`,
                      WebkitBackdropFilter: `blur(${config.blur}px) saturate(${config.saturation}%)`,
                      borderRadius: `${config.borderRadius}px`,
                      border: `1px solid ${hexToRgba(config.tintColor, config.borderOpacity, false)}`,
                      boxShadow: `0 8px 32px rgba(0, 0, 0, ${Number(config.shadowOpacity.toFixed(2))})`,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-400 to-indigo-500 flex items-center justify-center shrink-0 shadow-md">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-70">Live surface preview</p>
                        <h3 className="mt-1 font-serif text-base sm:text-lg leading-snug">Midnight Ambient Session</h3>
                        <p className="text-xs opacity-75 truncate">24-bit Lossless · 96 kHz</p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className={`h-[3px] w-full overflow-hidden ${lightText ? 'bg-white/25' : 'bg-zinc-900/15'}`}>
                        <div className="h-full w-2/3 bg-accent" />
                      </div>
                      <div className="flex items-center justify-between font-mono text-xs opacity-80">
                        <span>02:14</span>
                        <div className="flex items-center gap-4">
                          <SkipBack className="w-4 h-4" />
                          <div className="w-8 h-8 rounded-full bg-teal-400 text-zinc-950 flex items-center justify-center">
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                          <SkipForward className="w-4 h-4" />
                        </div>
                        <span>03:42</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  <span>Plate 02 · {activeBackdropLabel}</span>
                  <span>
                    {config.blur}px · {Math.round(config.opacity * 100)}% · {config.saturation}%
                  </span>
                </div>
              </div>
            </div>

            <div>
              <SectionHeading index="03" title="Output">
                <button
                  type="button"
                  onClick={handleCopy}
                  className={
                    copied === true
                      ? 'flex items-center gap-1.5 px-3.5 min-h-[36px] font-mono text-[10px] uppercase tracking-[0.16em] bg-accent text-white transition-colors'
                      : 'flex items-center gap-1.5 px-3.5 min-h-[36px] font-mono text-[10px] uppercase tracking-[0.16em] bg-ink text-paper hover:bg-ink-soft transition-colors'
                  }
                >
                  {copied === true ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === true ? 'Copied' : 'Copy code'}
                </button>
              </SectionHeading>

              <div className="flex items-center gap-6 border-b border-rule pb-2 mb-0">
                <button
                  type="button"
                  onClick={() => setFormat('css')}
                  className={
                    format === 'css'
                      ? 'font-mono text-[11px] uppercase tracking-[0.16em] text-ink border-b-2 border-accent -mb-[9px] pb-2'
                      : 'font-mono text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink -mb-[9px] pb-2 transition-colors'
                  }
                >
                  Plain CSS
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('tailwind')}
                  className={
                    format === 'tailwind'
                      ? 'font-mono text-[11px] uppercase tracking-[0.16em] text-ink border-b-2 border-accent -mb-[9px] pb-2'
                      : 'font-mono text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink -mb-[9px] pb-2 transition-colors'
                  }
                >
                  Tailwind CSS
                </button>
              </div>

              <pre className="bg-paper-deep border border-rule border-t-0 p-5 overflow-x-auto text-xs font-mono text-ink-soft leading-relaxed whitespace-pre-wrap break-all">
                <code>{generatedCode}</code>
              </pre>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
