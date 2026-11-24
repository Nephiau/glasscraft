# Glasscraft Design System

**Register:** product (a generator), presented as an editorial artifact
**Direction:** optical specimen sheet. Warm uncoated paper, ink serif display, hairline rules, numbered plates, one ink block for the active state.

The glass effect is the product's subject, not the interface's chrome. Backdrop-filter, tint, and gradients exist only inside the specimen plate, where the user is configuring them. Everything around the plate is flat, ruled, and printed.

---

## Color System

Tokens live in the Tailwind v4 `@theme` block in `src/index.css` and are emitted as `:root` custom properties.

| Role | Token | Hex | OKLCH | Use |
| --- | --- | --- | --- | --- |
| Page ground | `--color-paper` | `#f4f1ea` | `oklch(95.9% 0.010 87.5)` | Page background, default text on dark blocks |
| Recessed ground | `--color-paper-deep` | `#ebe5d8` | `oklch(92.3% 0.019 86.1)` | Code block, hover fill |
| Primary text | `--color-ink` | `#14120f` | `oklch(18.3% 0.007 78.1)` | Headings, active preset block background, primary button |
| Secondary text | `--color-ink-soft` | `#3f3a32` | `oklch(35.1% 0.015 79.6)` | Body copy, code text, control labels |
| Meta text | `--color-muted` | `#6b6459` | `oklch(50.6% 0.019 79.3)` | Kickers, plate captions, indices, inactive controls |
| Hairline | `--color-rule` | `#d3ccbd` | `oklch(84.7% 0.022 86.0)` | Slider tracks, dividers, swatch borders |
| Accent | `--color-accent` | `#0f766e` | `oklch(51.1% 0.086 186.4)` | Numeric readouts, active underline, copied state |

Measured contrast on paper: ink 16.7:1, ink-soft 10.0:1, muted 5.2:1, accent 4.9:1. Muted and accent pass AA at their smallest rendered size (10–12px mono).

No semantic success/warning/error roles exist yet; none are rendered by the interface.

---

## Typography

Tokens: `--font-serif`, `--font-sans`, `--font-mono`.

- **Display / specimen serif:** Iowan Old Style, Palatino Linotype, Palatino, Georgia, Times New Roman, serif. Masthead only.
- **Body:** Helvetica Neue, Helvetica, Arial, system-ui, sans-serif. Labels, descriptions, control rows.
- **Mono:** ui-monospace, SFMono-Regular, Menlo, Consolas, monospace. Indices, readouts, hex values, captions, code, buttons.

Voice: the serif is the publication voice; mono is the instrument panel. Sans sits between and stays quiet. There is no third display face and no second accent face.

### Not yet tokenized

These sizes are Tailwind utilities in `src/App.jsx`, not project tokens:

- 10px mono kicker / index / caption (`text-[10px]`)
- 11px tab label (`text-[11px]`)
- 12px readouts and code (`text-xs`)
- 14px body small (`text-sm`)
- 16–18px preset and specimen titles (`text-base`, `text-lg`)
- 20–24px section headings (`text-xl`, `text-2xl`)
- 52–104px masthead (`text-[clamp(3.25rem,9vw,6.5rem)]`)

---

## Spacing

Tailwind's default 4px scale. The page uses 4, 8, 12, 16, 20, 24, 28, 36, 40, 44, 56, and 80px. No custom spacing tokens are defined.

---

## Edges, Depth, Focus

- **Specimen plate:** 0 radius, 1px ink border. It is a printed frame, not a card.
- **Swatches and the play control:** full round. Roundness is reserved for physical objects (color chips, transport controls).
- **Panels and inputs:** 0 radius. No rounded app chrome anywhere.
- **Elevation:** none in the chrome. Separation comes from rules and paper tone. The only shadow in the product is the configurable `boxShadow` on the glass sample.
- **Focus:** range thumbs gain a 5px halo of `color-mix(in oklab, var(--color-accent) 30%, transparent)`; text inputs get a 2px accent underline. `outline: none` is never applied without a replacement.

---

## Button System

| Variant | Treatment | Example |
| --- | --- | --- |
| Primary / selected | Ink fill, paper text, square | Active preset, Copy code |
| Confirmation | Accent fill, white text | Copied |
| Quiet | Paper ground, muted text, ink on hover | Reset, text-contrast toggle |
| Rule tab | Mono uppercase label; active gets 2px accent underline | Plain CSS / Tailwind CSS, backdrops |

All buttons are native `<button>` elements with `type="button"`. Minimum target height is 36–44px depending on density.

---

## Motion

- Color and background transitions only: 150ms, default easing.
- No entrance animation, no scroll reveal, no parallax, no bounce.
- The only state change that reads as motion is the copy confirmation, which is a color swap, not a transform.

---

## Anti-references

This must not look or feel like:

- a zinc-950 SaaS dashboard with teal accents
- glassmorphic app chrome floating on purple-blue gradients
- a grid of rounded cards with nested cards
- pill-shaped everything
- neon glows, gradient text, or spotlight borders
- browser-default sliders on a dark panel
