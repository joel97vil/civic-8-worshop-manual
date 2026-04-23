# ESM Modernization Design

**Date:** 2026-04-23  
**Approach:** Iframe Shim (Option A)  
**Constraint:** No changes to manual content text/images. Local `file://` deployment.

---

## Goal

Make the Honda Civic 8th-gen ESM (`index.html`) work in modern browsers (Chrome, Firefox, Edge) without Internet Explorer. Original frameset entry (`HONDAESM.HTML`) is kept for reference, untouched.

---

## Architecture

Replace IE framesets with two named `<iframe>` elements inside a flexbox layout. Expose `window.F11` / `window.F12` aliases so existing cross-frame JS (`ChangeLang`, `ESMSELCT.HTML`) requires zero changes to its navigation calls. Global state (`document.ESM` / `gESM`) lives on the top-level `index.html` window, accessed by iframe children via `parent.document.ESM` — same pattern as before.

```
index.html (top window)
├── #header          — static inline HTML (replaces ESMTITLE.HTML frame)
└── #main (flexbox)
    ├── <iframe id="F11" name="F11">        — sidebar (ESMSELCT.HTML)
    └── <iframe id="EsmContents" name="EsmContents">  — content pages
```

`window.F12` is a JS alias → `frames['EsmContents']`, so existing code calling `parent.F12.location = ...` continues to work.

---

## Section 1 — Layout (`index.html`)

- Header content inlined (Honda logo, title bar images) — no longer loaded from `ESMTITLE.HTML`.
- Two iframes replace `#sidebar` and `#content` divs:
  - `<iframe id="F11" name="F11">` — 370px wide sidebar
  - `<iframe id="EsmContents" name="EsmContents">` — flex:1 content area
- Inline `<script>` block defines:
  ```js
  // F10 stub — header is static, no reload needed
  window.F10 = { location: { set href(v) {} } };
  // F11 alias — resolves to sidebar iframe contentWindow
  Object.defineProperty(window, 'F11', { get: () => frames['F11'] });
  // F12 alias — resolves to content iframe contentWindow
  Object.defineProperty(window, 'F12', { get: () => frames['EsmContents'] });
  ```
- Loads `_COM/HONDAESM.JS`, `_COM/MESSAGE.JS`, `_COM/ESMLANG.JS`, `_COM/main.js` in `<head>`.

---

## Section 2 — Initialization (`_COM/main.js`)

Full rewrite. Keeps same logic, fixes all IE/frameset assumptions.

**Changes:**
1. Remove `fStart` — always initialize fresh (no parent frame to inherit from).
2. Remove `CheckEnvironment()` — IE/Win32 guard blocks modern browsers entirely.
3. Remove `OnUnload()` — sets frame srcs on page unload; irrelevant.
4. Replace `document.write("<script src=...>")` with `loadScript(src, callback)`:
   ```js
   function loadScript(src, onload) {
     const s = document.createElement('script');
     s.src = src;
     s.onload = onload;
     document.head.appendChild(s);
   }
   ```
5. `OnLoad()` sequence:
   - Init `gESM`, `gLng`, `gDir`, `gMSG` arrays
   - Call `SetLang()`, `FMSG()`
   - `loadScript("_COM/ESMDIRS" + gESM.Lng[gESM.lngSel].Code + ".JS", () => { Initialize(); OnLoad(); })`
6. `Initialize()` reads cookie `EsmLang` to restore language/model selection (unchanged logic).
7. `OnLoad()` resolves `gESM.subSel`, `gESM.manTyp`, `gESM.mdlSel`, then calls `ChangeLang(false)` (unchanged logic).

---

## Section 3 — Navigation (`_COM/HONDAESM.JS`)

`ChangeLang()` requires **no changes**. When called with `fSub=false` from top frame:
- `wnd = window`
- `wnd.F10.location = ...` → hits the no-op stub
- `wnd.F11.location = "./A00/HTML/CTL/ESMSELCT.HTML"` → resolves via alias to sidebar iframe; setting `.location` on a `contentWindow` is valid in modern browsers
- `wnd.F12.location = "./A00/HTML/CTL/ESMBLANK.HTML"` → same for content iframe

When called with `fSub=true` from inside sidebar iframe:
- `wnd = parent` (top window)
- `parent.F11.location = ...` and `parent.F12.location = ...` → same aliases work
- `parent.location.reload()` → reloads `index.html` correctly

Paths use `strPath = "./"` for top-frame calls — correct relative to `index.html`.

---

## Section 4 — IE Compat Shims

### `document.all`
No shim needed. Modern browsers (Chrome, Firefox, Edge) implement `document.all` as a legacy API per the HTML spec. `document.all("id")` works identically to `document.getElementById("id")`.

### `_COM/HONDAESM.CSS`
- Replace `filter:shadow(color=gray,direction=135)` with `text-shadow: 1px 1px 2px gray`
- Replace `cursor:hand` with `cursor:pointer`

### `index.html` inline styles
- Remove `filter:shadow(...)` from the header `<div>` — covered by CSS above.

---

## Section 5 — `{lang}/HTML/CTL/ESMSELCT.HTML` (10 files)

Files: `A00`, `A01`, `D00`, `D01`, `F00`, `F01`, `G00`, `G01`, `S00`, `S01` — all under `{lang}/HTML/CTL/ESMSELCT.HTML`.

**Two mechanical find-replace operations per file:**

1. Redirect URL fix:
   - Find: `location.href="../../../HONDAESM.HTML"`
   - Replace: `location.href="../../../index.html"`

2. IE cursor fix:
   - Find: `style.cursor="hand"` (2 occurrences per file)
   - Replace: `style.cursor="pointer"`

**No other changes.** Specifically:
- `document.write("<script src=...>")` during parse — still works in modern browsers for same-origin iframes. No change.
- `parent.F12.location = ...` — resolves via alias. No change.
- `parent.document.ESM` access — top frame sets `document.ESM = gESM` in `main.js`. No change.
- `elmOpt.text`, `options.add()` — supported in modern browsers. No change.

---

## Files Changed

| File | Change |
|------|--------|
| `index.html` | New layout: inline header, two named iframes, F10/F11/F12 aliases |
| `_COM/main.js` | Full rewrite: remove fStart/IE checks, add loadScript, fix init sequence |
| `_COM/HONDAESM.CSS` | Fix `filter:shadow` → `text-shadow`, `cursor:hand` → `cursor:pointer` |
| `{lang}/HTML/CTL/ESMSELCT.HTML` ×10 | Redirect URL + cursor fix |

**Zero content pages touched.**

---

## Out of Scope

- Consolidating 10 `ESMSELCT.HTML` copies into one shared file (Option B follow-up)
- Converting to a proper build system / bundler
- Mobile responsive layout
