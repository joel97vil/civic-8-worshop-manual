// === Encapsulació del manual en un objecte modern ===
/*const ESM = {
  Lng: [], Dir: [], MsgC: [], MY: [],
  lngSel: -1, subSel: "", mySel: "", mdlSel: 0, manTyp: '1',
  fn: {}
};

// === Funcions helpers modernitzades ===
ESM.fn.GetCookie = function(name) {
  const v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return v ? v.pop() : "";
};
ESM.fn.SetCookie = function(name, value, days=true) {
  let expires = "";
  if(days !== true){
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    expires = ";expires="+d.toUTCString();
  }
  document.cookie = name + "=" + value + expires + ";path=/";
};

// === Carregar HTML extern amb fetch i innerHTML ===
async function loadHTML(id, file) {
  try {
    const resp = await fetch(file);
    const text = await resp.text();
    document.getElementById(id).innerHTML = text;
  } catch(e) {
    document.getElementById(id).innerHTML = "<p>Error carregant "+file+"</p>";
    console.error(e);
  }
}

// Inicialització
function Initialize() {
  const fStart = (ESM.fn.GetCookie("EsmStart") === "true") ? false : true;
  if(fStart || !document.referrer){
    // inicialitza arrays globals aquí o carregant els JS antics amb fetch
    ESM.fn.SetCookie("EsmStart","true");
  }
}

// === Execució ===
Initialize();*/




if(fStart||!document.referrer){gESM=new Array;gLng=new Array;gDir=new Array;gMSG=new Array;gMY=new Array;fn=new Array;gESM.Lng=gLng;gESM.Dir=gDir;gESM.lngSel=-1;gESM.MsgC=gMSG;gESM.MY=gMY;gESM.mySel="";gESM.subSel="";gESM.mdlSel=0;gESM.manTyp='1';document.ESM=gESM;SetLang();FMSG();fn.GetCookie=GetCookie;fn.SetCookie=SetCookie;fn.FormatStr=FormatStr;fn.ChangeLang=ChangeLang;gESM.fn=fn;}else{document.ESM=parent.document.ESM;gESM=document.ESM;gLng=gESM.Lng;gMSG=gESM.MsgC;fn=gESM.fn;}fn.SetCookie("EsmStart","true",true);function CheckEnvironment(){var nPos;with(navigator){if(appName.charAt(0)!="M"){alert("Execute the Microsoft Internet Explorer(R).");return(false);}if(appVersion.charAt(0)<"4"){alert("Execute the Microsoft Internet Explorer(R); Version more than 5.0.");return(false);}nPos=appVersion.indexOf("MSIE ");if(nPos>0){if(appVersion.charAt(nPos+5)<"4"){alert("Execute the Microsoft Internet Explorer(R); Version more than 5.0.");return(false);}}if(platform!="Win32"){alert("Execute under the Microsoft Windows(R) only.");return(false);}}return(true);}function Initialize(){var strLang,strCode;var i;if(gESM.Lng.length<=0){alert("Not found Language Information.");close();}if(fStart||(gESM.lngSel<0)){strLang=GetCookie("EsmLang");if(strLang.length>0){strLang.toUpperCase();gESM.subSel=strLang.substr(1);if(gESM.subSel.length<2){gESM.subSel="00";}else{gESM.subSel=strLang.substr(1,2);}if(strLang.length>3){gESM.mySel=strLang.substr(3,1);}strLang=strLang.substr(0,1);gESM.lngSel=-1;for(i=0;i<gESM.Lng.length;++i){strCode=gESM.Lng[i].Code;strCode.toUpperCase();if(strLang==strCode){gESM.lngSel=i;break;}}}}if(gESM.lngSel<0){gESM.lngSel=0;}}function OnLoad(){var nNdx;if(typeof(SetDirs)!="function"){alert("Not found Language Information.");close();}SetDirs();gESM.mdlSel=0;gESM.manTyp="0";if(gESM.subSel.length!=0){nNdx=0;for(i=0;i<gESM.Dir.length;++i){if(gESM.Dir[i].Code==gESM.subSel){gESM.manTyp=gESM.Dir[i].Type;break;}}if(gESM.manTyp!="0"){nNdx=0;for(i=0;i<gESM.Dir.length;++i){if(gESM.Dir[i].Type==gESM.manTyp){if(gESM.Dir[i].Code==gESM.subSel){gESM.mdlSel=nNdx;break;}++nNdx;}}}else{gESM.subSel=gESM.Dir[0].Code;gESM.manTyp=gESM.Dir[0].Type;gESM.mdlSel=0;}}else{nNdx=0;for(i=0;i<gESM.Dir.length;++i){if(gESM.Dir[i].Type=="1"){gESM.subSel=gESM.Dir[i].Code;gESM.mdlSel=nNdx;gESM.manTyp=gESM.Dir[i].Type;++nNdx;}}if(gESM.subSel.length==0){nNdx=0;for(i=0;i<gESM.Dir.length;++i){if(gESM.Dir[i].Type=="2"){gESM.subSel=gESM.Dir[i].Code;gESM.mdlSel=nNdx;gESM.manTyp=gESM.Dir[i].Type;++nNdx;}}}}if(gESM.subSel.length==0){gESM.mdlSel=0;gESM.subSel="00";gESM.manTyp="1";}ChangeLang(false);}function OnUnload(){F10.src="./_COM/ESMTITLE.HTML";F11.src="./_COM/ESMSELCT.HTML";F12.src="./_COM/ESMBLANK.HTML";}Initialize();document.write("<script src=\"./_COM/ESMDIRS"+gESM.Lng[gESM.lngSel].Code+".JS\"></script>");window.onload=OnLoad;