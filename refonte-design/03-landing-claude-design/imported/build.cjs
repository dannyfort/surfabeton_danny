/* Convertit le .dc.html Claude Design (x-dc / sc-if / {{ }} / runtime React)
   en index.html standalone vanilla. */
const fs = require('fs');
const DIR = '/Users/danielfortunato/Documents/surfabeton-site/refonte-design/03-landing-claude-design/imported/';
const OUT = '/Users/danielfortunato/Documents/surfabeton-site/refonte-design/03-landing-claude-design/build/index.html';

let tpl = fs.readFileSync(DIR + 'template.html', 'utf8');
const helmet = fs.readFileSync(DIR + 'helmet.html', 'utf8');
const logic = fs.readFileSync(DIR + 'component-logic.js', 'utf8');

// 1. drop helmet (rebuilt into <head>)
tpl = tpl.replace(/<helmet>[\s\S]*?<\/helmet>/, '');

// 2. global reactive-binding → vanilla hooks
tpl = tpl
  .replace(/onSubmit="\{\{ onSubmit \}\}"/g, 'data-sb-form')
  .replace(/onClick="\{\{ onDevisCta \}\}"/g, 'data-sb-devis-cta')
  .replace(/onClick="\{\{ openSheet \}\}"/g, 'data-sb-open-sheet')
  .replace(/onClick="\{\{ closeSheet \}\}"/g, 'data-sb-close-sheet')
  .replace(/role="status"/g, 'role="status" data-sb-formnote')
  .replace(/\{\{ formNote \}\}/g, '')
  .replace(/transform: \{\{ sheetTransform \}\};/g, 'transform: translateY(112%);');

// 3. element-specific classes / hooks
// poster (reduced-motion fallback): tag it + hide by default
tpl = tpl.replace(/<img\s+src="assets\/poster-wide\.jpg"[^>]*>/, m =>
  m.replace('<img ', '<img data-reduced-poster ').replace('style="', 'style="display:none; '));
// desktop glass card
tpl = tpl.replace(/<div\s+data-card-outer=""/, '<div data-card-outer="" class="sb-desktop-card"');
// mobile CTA bar
tpl = tpl.replace(/<div style="position: fixed; left: 16px; right: 16px; bottom: 16px; z-index: 65">/,
  '<div class="sb-mobile-only" style="position: fixed; left: 16px; right: 16px; bottom: 16px; z-index: 65">');
// mobile scrim (already data-sb-close-sheet after step 2)
tpl = tpl.replace(/<div data-sb-close-sheet style="position: fixed; inset: 0; z-index: 68;([^"]*)">/,
  '<div data-sb-close-sheet data-sb-scrim class="sb-mobile-only" style="display:none; position: fixed; inset: 0; z-index: 68;$1">');
// mobile sheet
tpl = tpl.replace(/<div style="position: fixed; left: 0; right: 0; bottom: 0; z-index: 70;/,
  '<div data-sb-sheet class="sb-mobile-only" style="position: fixed; left: 0; right: 0; bottom: 0; z-index: 70;');

// 4. style-hover / style-focus → generated CSS classes (with !important to beat inline base)
let genCss = '';
const bang = v => v.split(';').map(s => s.trim()).filter(Boolean).map(s => s + ' !important').join('; ');
const uniq = re => [...new Set([...tpl.matchAll(re)].map(m => m[1]))];
uniq(/style-hover="([^"]*)"/g).forEach((v, i) => {
  genCss += `.sb-hv-${i}:hover{ ${bang(v)}; }\n`;
  tpl = tpl.split(`style-hover="${v}"`).join(`class="sb-hv-${i}"`);
});
uniq(/style-focus="([^"]*)"/g).forEach((v, i) => {
  genCss += `.sb-fc-${i}:focus{ ${bang(v)}; }\n`;
  tpl = tpl.split(`style-focus="${v}"`).join(`class="sb-fc-${i}"`);
});

// 5. unwrap all <sc-if> (conditions handled by CSS media-queries + JS)
tpl = tpl.replace(/<sc-if\b[^>]*>/g, '').replace(/<\/sc-if>/g, '');

// 6. assertions — nothing reactive must survive
const leftovers = {
  'mustache {{': (tpl.match(/\{\{/g) || []).length,
  'sc-if': (tpl.match(/sc-if/g) || []).length,
  onClick: (tpl.match(/onClick=/g) || []).length,
  onSubmit: (tpl.match(/onSubmit=/g) || []).length,
  'style-hover': (tpl.match(/style-hover=/g) || []).length,
  'style-focus': (tpl.match(/style-focus=/g) || []).length,
};
const bad = Object.entries(leftovers).filter(([, n]) => n > 0);
if (bad.length) { console.error('LEFTOVERS:', JSON.stringify(leftovers)); process.exit(1); }

// 7. assemble standalone document
const runtimeCss = `
/* Lenis smooth scroll */
html.lenis,html.lenis body{height:auto}
.lenis.lenis-smooth{scroll-behavior:auto !important}
.lenis.lenis-smooth [data-lenis-prevent]{overscroll-behavior:contain}
.lenis.lenis-stopped{overflow:hidden}
.lenis.lenis-smooth iframe{pointer-events:none}
/* responsive visibility (matches JS matchMedia 820px) */
.sb-mobile-only{display:none}
@media (max-width:820px){
  .sb-desktop-card{display:none !important}
  .sb-mobile-only{display:block}
}
${genCss}`;

const script = `
(function(){
  class DCLogic{
    constructor(props){ this.props = props || {}; }
    setState(patch){ this.state = Object.assign({}, this.state, patch); this._reflect(patch); }
    _reflect(){}
  }
${logic}
  Component.prototype._reflect = function(patch){
    if('formNote' in patch){
      document.querySelectorAll('[data-sb-formnote]').forEach(function(el){ el.textContent = patch.formNote || ''; });
    }
    if('sheetOpen' in patch){
      var sheet = document.querySelector('[data-sb-sheet]');
      var scrim = document.querySelector('[data-sb-scrim]');
      if(sheet) sheet.style.transform = patch.sheetOpen ? 'translateY(0%)' : 'translateY(112%)';
      if(scrim) scrim.style.display = patch.sheetOpen ? 'block' : 'none';
    }
  };
  function boot(){
    var props = { particlesEnabled:true, wideLoop:true, tiltEnabled:true };
    var cmp = window.__sb = new Component(props);
    if(cmp.state.reduced){
      var v = document.getElementById('hero-video'); if(v) v.style.display='none';
      var pw = document.querySelector('[data-reduced-poster]'); if(pw) pw.style.display='block';
    }
    document.querySelectorAll('[data-sb-form]').forEach(function(f){ f.addEventListener('submit', function(e){ cmp._onSubmit(e); }); });
    document.querySelectorAll('[data-sb-devis-cta]').forEach(function(b){ b.addEventListener('click', function(){ cmp._onDevisCta(); }); });
    document.querySelectorAll('[data-sb-open-sheet]').forEach(function(b){ b.addEventListener('click', function(){ cmp.setState({sheetOpen:true}); }); });
    document.querySelectorAll('[data-sb-close-sheet]').forEach(function(b){ b.addEventListener('click', function(){ cmp.setState({sheetOpen:false}); }); });
    cmp.componentDidMount();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();`;

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Surfabéton — Dallage industriel haute planéité</title>
<meta name="description" content="Surfabéton — dallage béton industriel haute planéité : coulage, lissage mécanique, béton ciré poli miroir. Normandie & national. Devis sous 24h.">
${helmet.trim()}
<style>${runtimeCss}</style>
</head>
<body>
${tpl.trim()}
<script>${script}</script>
</body>
</html>`;

fs.writeFileSync(OUT, html);
console.log('OK →', OUT, '(' + (html.length / 1024).toFixed(0) + ' KB)');
console.log('leftovers clean:', JSON.stringify(leftovers));
