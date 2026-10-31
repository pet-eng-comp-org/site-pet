// Antes do build: tira do CSS do mdbreact o @import da fonte Roboto no Google
// Fonts. Nenhum texto do site usa a Roboto, e a chamada entregava ao Google o
// IP de cada visitante, em toda visita.
import fs from "node:fs";

const arquivo = new URL("../node_modules/mdbreact/dist/css/mdb.css", import.meta.url);
const css = fs.readFileSync(arquivo, "utf8");
const limpo = css.replace(/@import url\("https:\/\/fonts\.googleapis\.com[^"]*"\);/g, "");
if (limpo !== css) fs.writeFileSync(arquivo, limpo);
console.log("mdb.css sem Google Fonts");
