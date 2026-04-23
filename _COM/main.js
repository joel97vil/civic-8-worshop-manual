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
  s.onerror = function() { alert("Not found Language Information."); };
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
