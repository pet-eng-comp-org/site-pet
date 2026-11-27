// Regressão da colisão de CSS nos dois sentidos entre o menu suspenso da barra
// (PainelDoMenu, em globals.css) e o painel administrativo (/admin/*, em
// Painel.css): sem escopo, globals.css esconde .painel-item do /admin/* com
// opacity: 0 (>= 834 px) e Painel.css aplica display: grid ao menu suspenso
// depois que o painel é carregado na sessão.

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const GLOBALS = path.join(RAIZ, "src/app/globals.css");
const PAINEL_CSS = path.join(RAIZ, "src/components/Painel/Painel.css");

const CLASSES_COMPARTILHADAS = /\.(painel-item|painel-grupo(?:-grande)?|painel-titulo)(?![-\w])/;

// Extrai cada seletor individual de um arquivo CSS (fora de comentários e at-rules).
function seletoresDe(css) {
  const semComentarios = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const achados = [];
  let atual = "";
  for (let i = 0; i < semComentarios.length; i++) {
    const c = semComentarios[i];
    if (c === "{") {
      const cabeca = atual.trim();
      atual = "";
      if (cabeca && !cabeca.startsWith("@")) {
        for (const s of cabeca.split(",")) {
          const limpo = s.replace(/\s+/g, " ").trim();
          if (limpo) achados.push(limpo);
        }
      }
    } else if (c === "}" || c === ";") {
      atual = "";
    } else {
      atual += c;
    }
  }
  return achados;
}

describe("isolamento de CSS entre menu suspenso e painel /admin/*", () => {
  it("globals.css restringe .painel-item, .painel-grupo e .painel-titulo a .painel-menu", () => {
    const css = fs.readFileSync(GLOBALS, "utf8");
    const vazando = seletoresDe(css).filter(
      (s) => CLASSES_COMPARTILHADAS.test(s) && !s.includes(".painel-menu")
    );
    assert.deepEqual(
      vazando,
      [],
      `Seletores globais em globals.css colidem com o painel /admin/*:\n${vazando.join("\n")}`
    );
  });

  it("Painel.css restringe .painel-item, .painel-grupo e .painel-titulo a .painel", () => {
    const css = fs.readFileSync(PAINEL_CSS, "utf8");
    const vazando = seletoresDe(css).filter(
      (s) => CLASSES_COMPARTILHADAS.test(s) && !/\.painel\s/.test(s)
    );
    assert.deepEqual(
      vazando,
      [],
      `Seletores globais em Painel.css colidem com .painel-menu da barra:\n${vazando.join("\n")}`
    );
  });
});
