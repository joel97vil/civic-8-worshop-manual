# ESM Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Honda Civic 8th-gen ESM work in Chrome/Firefox/Edge via `file://` by replacing IE framesets with named iframes and fixing IE-only JS/CSS.

**Architecture:** `index.html` hosts a static inline header plus two named iframes (`F11`=sidebar, `EsmContents`=content). `window.F12` is a getter alias → `frames['EsmContents']`. Existing cross-frame JS (`ChangeLang`, `ESMSELCT.HTML`) needs no changes to its navigation calls because browser auto-creates `window.F11` from the iframe name and the F12 alias covers the content frame. `_COM/main.js` is fully rewritten to remove the `fStart`/IE guard and use dynamic script loading.

**Tech Stack:** Vanilla JS, no framework, no build tools. Static file serving via `file://`.

---

## File Map

| File | Action | What changes |
|------|--------|-------------|
| `index.html` | Modify | Inline header, two named iframes, F10 stub + F12 alias script |
| `_COM/main.js` | Rewrite | Remove fStart/IE guards, add loadScript, fix init sequence |
| `_COM/HONDAESM.CSS` | Modify | `filter:shadow` → `text-shadow`, remove `cursor:hand` if present |
| `A00/HTML/CTL/ESMSELCT.HTML` | Modify | Redirect + cursor fix |
| `A01/HTML/CTL/ESMSELCT.HTML` | Modify | Redirect + cursor fix |
| `D00/HTML/CTL/ESMSELCT.HTML` | Modify | Redirect + cursor fix |
| `D01/HTML/CTL/ESMSELCT.HTML` | Modify | Redirect + cursor fix |
| `F00/HTML/CTL/ESMSELCT.HTML` | Modify | Redirect + cursor fix |
| `F01/HTML/CTL/ESMSELCT.HTML` | Modify | Redirect + cursor fix |
| `G00/HTML/CTL/ESMSELCT.HTML` | Modify | Redirect + cursor fix |
| `G01/HTML/CTL/ESMSELCT.HTML` | Modify | Redirect + cursor fix |
| `S00/HTML/CTL/ESMSELCT.HTML` | Modify | Redirect + cursor fix |
| `S01/HTML/CTL/ESMSELCT.HTML` | Modify | Redirect + cursor fix |

---

## Task 1: Fix `_COM/HONDAESM.CSS`

**Files:**
- Modify: `_COM/HONDAESM.CSS`

- [ ] **Step 1: Replace IE-only CSS**

Open `_COM/HONDAESM.CSS`. Its full content is one minified line. Replace it entirely with:

```css
body{background-color:white;margin-top:8px;}
div.Header{font-family:"MS Serif";font-size:2em;width:100%;text-shadow:1px 1px 2px gray;}
div.title{background-color:lightgrey;font-weight:bold;}
div.abbrev{margin-top:8px;}
input.abbrev{font-weight:bold;}
ul{list-style-type:none;margin-left:1em;margin-top:0px;}
img.illust{border-style:none;position:relative;top:4px;}
img.maru{position:relative;top:2px;border:0;}
```

The only change: `filter:shadow(color=gray,direction=135)` → `text-shadow:1px 1px 2px gray`.

- [ ] **Step 2: Commit**

```bash
git add _COM/HONDAESM.CSS
git commit -m "fix: replace IE filter:shadow with text-shadow in shared CSS"
```

---

## Task 2: Rewrite `_COM/main.js`

**Files:**
- Modify: `_COM/main.js`

- [ ] **Step 1: Replace file contents**

Overwrite `_COM/main.js` entirely with:

```js
var gESM, gLng, gDir, gMSG, gMY, fn;

gESM = {};
gLng = [];
gDir = [];
gMSG = [];
gMY  = [];
fn   = {};

gESM.Lng   = gLng;
gESM.Dir   = gDir;
gESM.MsgC  = gMSG;
gESM.MY    = gMY;
gESM.lngSel = -1;
gESM.subSel = "";
gESM.mySel  = "";
gESM.mdlSel = 0;
gESM.manTyp = '1';
document.ESM = gESM;

SetLang();
FMSG();

fn.GetCookie  = GetCookie;
fn.SetCookie  = SetCookie;
fn.FormatStr  = FormatStr;
fn.ChangeLang = ChangeLang;
gESM.fn = fn;

function loadScript(src, onload) {
  var s = document.createElement('script');
  s.src = src;
  s.onload = onload;
  document.head.appendChild(s);
}

function Initialize() {
  var strLang, strCode, i;
  if (gESM.Lng.length <= 0) { alert("Not found Language Information."); return; }
  strLang = GetCookie("EsmLang");
  if (strLang.length > 0) {
    strLang = strLang.toUpperCase();
    gESM.subSel = strLang.substr(1, 2);
    if (gESM.subSel.length < 2) gESM.subSel = "00";
    if (strLang.length > 3) gESM.mySel = strLang.substr(3, 1);
    strCode = strLang.substr(0, 1);
    gESM.lngSel = -1;
    for (i = 0; i < gESM.Lng.length; ++i) {
      if (gESM.Lng[i].Code.toUpperCase() === strCode) { gESM.lngSel = i; break; }
    }
  }
  if (gESM.lngSel < 0) gESM.lngSel = 0;
}

function OnLoad() {
  var nNdx, i;
  if (typeof SetDirs !== 'function') { alert("Not found Language Information."); return; }
  SetDirs();
  gESM.mdlSel = 0;
  gESM.manTyp = "0";

  if (gESM.subSel.length !== 0) {
    for (i = 0; i < gESM.Dir.length; ++i) {
      if (gESM.Dir[i].Code === gESM.subSel) { gESM.manTyp = gESM.Dir[i].Type; break; }
    }
    if (gESM.manTyp !== "0") {
      nNdx = 0;
      for (i = 0; i < gESM.Dir.length; ++i) {
        if (gESM.Dir[i].Type === gESM.manTyp) {
          if (gESM.Dir[i].Code === gESM.subSel) { gESM.mdlSel = nNdx; break; }
          ++nNdx;
        }
      }
    } else {
      gESM.subSel = gESM.Dir[0].Code;
      gESM.manTyp = gESM.Dir[0].Type;
      gESM.mdlSel = 0;
    }
  } else {
    nNdx = 0;
    for (i = 0; i < gESM.Dir.length; ++i) {
      if (gESM.Dir[i].Type === "1") {
        gESM.subSel = gESM.Dir[i].Code; gESM.mdlSel = nNdx; gESM.manTyp = "1"; ++nNdx;
      }
    }
    if (gESM.subSel.length === 0) {
      nNdx = 0;
      for (i = 0; i < gESM.Dir.length; ++i) {
        if (gESM.Dir[i].Type === "2") {
          gESM.subSel = gESM.Dir[i].Code; gESM.mdlSel = nNdx; gESM.manTyp = "2"; ++nNdx;
        }
      }
    }
  }

  if (gESM.subSel.length === 0) { gESM.mdlSel = 0; gESM.subSel = "00"; gESM.manTyp = "1"; }
  ChangeLang(false);
}

Initialize();
fn.SetCookie("EsmStart", "true", true);

window.onload = function() {
  loadScript("./_COM/ESMDIRS" + gESM.Lng[gESM.lngSel].Code + ".JS", OnLoad);
};
```

- [ ] **Step 2: Verify no syntax errors**

Open browser DevTools console. Open `index.html` via `file://`. Confirm no `ReferenceError` or `SyntaxError` in console.

Expected console output: clean (no errors). If you see `SetLang is not defined`, the script load order in `index.html` is wrong — `ESMLANG.JS` must load before `main.js`.

- [ ] **Step 3: Commit**

```bash
git add _COM/main.js
git commit -m "fix: rewrite main.js — remove fStart/IE guards, add loadScript, fix init sequence"
```

---

## Task 3: Rewrite `index.html`

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace file contents**

Overwrite `index.html` entirely with:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="author" content="HONDA MOTOR Co.,Ltd.">
<title>Shop Manual (HONDA MOTOR Co.,Ltd.)</title>
<style>
  html, body { height: 100%; margin: 0; overflow: hidden; }
  #header { height: 71px; overflow: hidden; background: #fff; }
  #main { display: flex; height: calc(100% - 71px); }
  #F11 { width: 370px; min-width: 370px; border: none; border-right: 1px solid #ccc; height: 100%; }
  #EsmContents { flex: 1; border: none; height: 100%; }
</style>
<link href="./_COM/HONDAESM.CSS" rel="stylesheet">
<script src="./_COM/HONDAESM.JS"></script>
<script src="./_COM/MESSAGE.JS"></script>
<script src="./_COM/ESMLANG.JS"></script>
<script src="./_COM/main.js"></script>
</head>
<body>

<div id="header">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr style="margin:0;padding:0;">
      <td width="1%"></td>
      <td><div class="Header">HONDA ESM</div></td>
      <td valign="top" align="right" width="1%"><img src="./_COM/PNG/TTLHONDA.PNG" alt="Honda"></td>
      <td width="1%"></td>
    </tr>
  </table>
  <img src="./_COM/PNG/TITLEBAR.PNG" width="100%" height="31px" alt="">
</div>

<div id="main">
  <iframe id="F11" name="F11" src="./_COM/ESMBLANK.HTML"></iframe>
  <iframe id="EsmContents" name="EsmContents" src="./_COM/ESMBLANK.HTML"></iframe>
</div>

<script>
  window.F10 = {};
  Object.defineProperty(window, 'F12', {
    get: function() { return window.frames['EsmContents']; },
    configurable: true
  });
</script>

<noscript><p>Enable JavaScript in your browser.</p></noscript>
</body>
</html>
```

Key points:
- `window.F10 = {}` — stub; `ChangeLang` assigns `.location` on it, which is a harmless property set.
- `window.F11` — browser auto-creates this from `name="F11"` on the iframe; no code needed.
- `window.F12` getter — returns `frames['EsmContents']` (the content iframe's `contentWindow`). Using `defineProperty` so it can't be shadowed by a browser-auto-created property.
- `div.Header` class — gets `text-shadow` from `HONDAESM.CSS` (Task 1).

- [ ] **Step 2: Verify layout loads**

Open `index.html` via `file://` in Chrome or Firefox.

Expected:
- Header shows "HONDA ESM" with Honda logo and blue/red title bar.
- Sidebar iframe and content iframe both show blank white (loading `ESMBLANK.HTML`).
- No JS errors in DevTools console.
- After ~1 second, sidebar iframe loads `A00/HTML/CTL/ESMSELCT.HTML` (the default English sidebar).

If sidebar stays blank and console shows `ESMSELCT.HTML` redirecting to `HONDAESM.HTML` — that is fixed in Task 4.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "fix: replace frameset with named iframes, add F10 stub and F12 alias"
```

---

## Task 4: Patch `ESMSELCT.HTML` — redirect URL (all 10 files)

**Files:**
- Modify: `A00/HTML/CTL/ESMSELCT.HTML`, `A01/HTML/CTL/ESMSELCT.HTML`, `D00/HTML/CTL/ESMSELCT.HTML`, `D01/HTML/CTL/ESMSELCT.HTML`, `F00/HTML/CTL/ESMSELCT.HTML`, `F01/HTML/CTL/ESMSELCT.HTML`, `G00/HTML/CTL/ESMSELCT.HTML`, `G01/HTML/CTL/ESMSELCT.HTML`, `S00/HTML/CTL/ESMSELCT.HTML`, `S01/HTML/CTL/ESMSELCT.HTML`

Each file has this near the top:
```js
if(typeof(parent.document.ESM)!="object"){location.href="../../../HONDAESM.HTML";}
```

And this in `SetSubject()`:
```js
radSM.style.cursor="hand";Ind1I.style.cursor="hand";
```
and
```js
radBM.style.cursor="hand";Ind2I.style.cursor="hand";
```

- [ ] **Step 1: Apply find-replace to all 10 files**

Run these two sed commands from the repo root (or use your editor's find-replace across files):

```bash
for f in A00 A01 D00 D01 F00 F01 G00 G01 S00 S01; do
  sed -i 's|location.href="../../../HONDAESM.HTML"|location.href="../../../index.html"|g' "$f/HTML/CTL/ESMSELCT.HTML"
  sed -i 's|style\.cursor="hand"|style.cursor="pointer"|g' "$f/HTML/CTL/ESMSELCT.HTML"
done
```

If on Windows without sed, use PowerShell:

```powershell
foreach ($f in @('A00','A01','D00','D01','F00','F01','G00','G01','S00','S01')) {
  $path = "$f\HTML\CTL\ESMSELCT.HTML"
  $content = Get-Content $path -Raw
  $content = $content -replace 'location\.href="\.\./\.\./\.\./HONDAESM\.HTML"', 'location.href="../../../index.html"'
  $content = $content -replace 'style\.cursor="hand"', 'style.cursor="pointer"'
  Set-Content $path $content -NoNewline
}
```

- [ ] **Step 2: Verify changes applied**

```bash
grep -r "HONDAESM.HTML" A00 A01 D00 D01 F00 F01 G00 G01 S00 S01 --include="ESMSELCT.HTML"
```

Expected output: **nothing** (all references replaced).

```bash
grep -r 'cursor="hand"' A00 A01 D00 D01 F00 F01 G00 G01 S00 S01 --include="ESMSELCT.HTML"
```

Expected output: **nothing**.

- [ ] **Step 3: Commit**

```bash
git add A00/HTML/CTL/ESMSELCT.HTML A01/HTML/CTL/ESMSELCT.HTML \
        D00/HTML/CTL/ESMSELCT.HTML D01/HTML/CTL/ESMSELCT.HTML \
        F00/HTML/CTL/ESMSELCT.HTML F01/HTML/CTL/ESMSELCT.HTML \
        G00/HTML/CTL/ESMSELCT.HTML G01/HTML/CTL/ESMSELCT.HTML \
        S00/HTML/CTL/ESMSELCT.HTML S01/HTML/CTL/ESMSELCT.HTML
git commit -m "fix: update ESMSELCT redirect to index.html, cursor hand→pointer (all 10 lang files)"
```

---

## Task 5: End-to-End Verification

No test framework. Verify manually in browser.

- [ ] **Step 1: Open `index.html` in Chrome via `file://`**

Open Chrome. Press `Ctrl+Shift+I` to open DevTools. Navigate to `file:///path/to/civic-8-worshop-manual/index.html`.

Expected:
- No red errors in Console tab.
- Header shows "HONDA ESM" text with shadow, Honda logo, colored title bar.
- Left sidebar (370px) loads and shows: Model dropdown (CIVIC 5D), Model Year dropdown, Shop Manual / Body Repair Manual radio buttons, a tree view iframe below.
- Right content area shows blank white initially.

- [ ] **Step 2: Click a tree item in the sidebar**

In the sidebar tree view, click any entry (e.g., "Engine").

Expected: Right content iframe navigates to the corresponding `.HTML` content page. Manual text and diagrams display correctly. No `target` navigation errors.

- [ ] **Step 3: Change language**

In the sidebar, change the Language dropdown to "Spanish" (or any other language).

Expected: Page reloads (`index.html` reloads), sidebar re-renders in chosen language, content resets to blank.

- [ ] **Step 4: Verify cookie persistence**

Close and reopen `index.html`. 

Expected: Language selection from Step 3 is remembered (cookie `EsmLang` persists).

- [ ] **Step 5: Verify in Firefox**

Repeat Steps 1–3 in Firefox. Expected: same behavior. Firefox is stricter about `file://` cross-frame access — if errors appear, check DevTools console for `SecurityError`.

- [ ] **Step 6: Commit verification note**

```bash
git commit --allow-empty -m "chore: manual e2e verification passed in Chrome and Firefox"
```
