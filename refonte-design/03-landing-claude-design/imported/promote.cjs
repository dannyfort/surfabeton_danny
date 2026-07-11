/* Promeut build/index.html en site racine, en reportant le SEO de l'ancien
   index.html (sauvegardé au préalable en index.legacy.html). Réversible. */
const fs = require('fs');
const ROOT = '/Users/danielfortunato/Documents/surfabeton-site/';
const legacy = fs.readFileSync(ROOT + 'index.legacy.html', 'utf8');
let page = fs.readFileSync(ROOT + 'refonte-design/03-landing-claude-design/build/index.html', 'utf8');

const pick = (re) => { const m = legacy.match(re); return m ? m[0] : null; };
const title = pick(/<title>[\s\S]*?<\/title>/);
const desc = pick(/<meta\s+name="description"[^>]*>/);
const ld = pick(/<script type="application\/ld\+json">[\s\S]*?<\/script>/);

if (title) page = page.replace(/<title>[\s\S]*?<\/title>/, title);
if (desc) page = page.replace(/<meta name="description"[^>]*>/, desc);
if (ld) page = page.replace('</head>', '  ' + ld + '\n</head>');

fs.writeFileSync(ROOT + 'index.html', page);
console.log('promoted → index.html');
console.log('SEO carried:', { title: !!title, description: !!desc, ldjson: !!ld });
