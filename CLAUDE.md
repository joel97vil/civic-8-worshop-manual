# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Honda Civic 8th-gen Electronic Service Manual (ESM) — a static HTML/JS app originally built for Internet Explorer with framesets. This repo is a modernization effort to make it work in current browsers without frames.

## Running Locally

No build tools. Serve the root as a static site:

```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

Open `index.html` (the modernized entry point). The original frameset entry is `HONDAESM.HTML` (IE-only, kept for reference).

## Architecture

### Two Entry Points

- **`HONDAESM.HTML`** — original frameset (3 frames: title, sidebar, content). IE/Win32-only checks baked in. Do not modify.
- **`index.html`** — modern rewrite. Replaces frames with flexbox divs (`#header`, `#sidebar`, `#content`). Loads the same `_COM/` JS files.

### Global State (`gESM`)

All navigation state lives in a global object `document.ESM` / `gESM` (initialized in `_COM/main.js` and `_COM/HONDAESM.JS`):

| Field | Meaning |
|-------|---------|
| `Lng[]` | Language list (FSL objects: Code + Name) |
| `Dir[]` | Model/subtype list (FDL objects: Code + Model + Type) |
| `lngSel` | Index into `Lng[]` for current language |
| `subSel` | 2-char sub-model code (e.g. `"00"`, `"01"`) |
| `manTyp` | Manual type (`"1"` = primary, `"2"` = secondary) |
| `mdlSel` | Index within same-type models |
| `fn` | Shared function refs (GetCookie, SetCookie, FormatStr, ChangeLang) |

State is persisted via cookie `EsmLang` = `{langCode}{subCode}{mySel}` (e.g. `A00`).

### Content Directory Layout

```
{LangCode}{SubCode}/          e.g. A00/  (English, model 00)
  HTML/
    {subDir}/                 e.g. 00/, 01/, 3A/, ...
      {dbKey}.HTML            e.g. SMG6E00000000000000EBAT00i001.HTML
    CTL/                      Control pages (ESMTITLE.HTML, ESMSELCT.HTML, ESMBLANK.HTML)
    ESM_DISP.CSS, etc.
```

Language codes: `A`=English, `D`=Dutch, `F`=French, `G`=German, `S`=Spanish. Each language has two top-level dirs (e.g. `A00`, `A01`) corresponding to model subtypes defined in `_COM/ESMDIRS{LangCode}.JS`.

### Key Files in `_COM/`

| File | Role |
|------|------|
| `HONDAESM.JS` | Core logic: cookie helpers, `ChangeLang()`, `LoadStr()`, `FormatStr()`, `FSL`/`FDL` constructors |
| `ESMLANG.JS` | Defines `gLng[]` — the 5 supported languages |
| `ESMDIRS{X}.JS` | Defines `gDir[]` for language X — maps subcode → model name + type |
| `MESSAGE.JS` | UI string table (`gMSG[]`) used by `LoadStr()`/`FormatStr()` |
| `main.js` | Initialization code for `index.html`. Contains a **commented-out** async/fetch modernization attempt; the active code below it is the original minified init from `HONDAESM.HTML`. |
| `ESMSELCT.HTML` | Sidebar/selection panel (loaded into `#sidebar` or frame F11) |
| `ESMTITLE.HTML` | Header panel |

### `ChangeLang(fSub)`

Core navigation function. Builds path `{langCode}{subCode}` and either reloads the page (frameset mode, `fSub=true`) or sets frame `.location` to `{langCode}{subCode}/HTML/CTL/ESMTITLE.HTML` etc. In `index.html`, frame references (`F10`, `F11`, `F12`) don't exist — this is the main gap to bridge in the modernization.

### `dbKeyToHtmlFile(path, dbKey)`

Converts a document key to an HTML path: `path + dbKey.substr(5,2) + "/" + dbKey + ".HTML"`.

## Modernization Context

`_COM/main.js` has a commented-out block showing the intended modern approach: encapsulate state in an `ESM` object, load HTML partials with `fetch()` into `innerHTML`. The active code below it is a copy of the original minified init. The goal is to make the `fetch`-based approach work and uncomment it, replacing the old code.
