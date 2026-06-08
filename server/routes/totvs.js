const router = require("express").Router();
const { query } = require("../db");
const { buscarProdutos, buscarSaldos, buscarPrecos } = require("../services/totvs");

// ══════════════════════════════════════════════════════════════
// GET /api/totvs/status — testa conexão com o TOTVS
// ══════════════════════════════════════════════════════════════
router.get("/status", async (_req, res) => {
  try {
    const dados = await buscarProdutos(0, 1);
    res.json({ status: "ok", mensagem: "Conexão com TOTVS funcionando.", amostra: dados });
  } catch (err) {
    res.status(500).json({ status: "erro", mensagem: err.message });
  }
});

// ══════════════════════════════════════════════════════════════
// POST /api/totvs/sincronizar — sincroniza tudo com db_vv
// ══════════════════════════════════════════════════════════════
router.post("/sincronizar", async (_req, res) => {
  const log = { produtos: 0, variacoes: 0, estoque: 0, erros: [] };

  try {
    // 1. Busca produtos, preços e saldos em paralelo
    const [resProdutos, resPrecos, resSaldos] = await Promise.all([
      buscarProdutos(0, 200),
      buscarPrecos(0, 200),
      buscarSaldos(0, 200),
    ]);

    const produtos  = resProdutos?.items  ?? resProdutos?.data  ?? [];
    const precos    = resPrecos?.items    ?? resPrecos?.data    ?? [];
    const saldos    = resSaldos?.items    ?? resSaldos?.data    ?? [];

    // 2. Sincroniza produtos
    for (const p of produtos) {
      try {
        const sku      = p.code       ?? p.productCode ?? p.id;
        const nome     = p.name       ?? p.productName ?? "Sem nome";
        const categoria = p.group?.description ?? p.category ?? p.groupDescription ?? "Sem categoria";

        if (!sku) continue;

        // Upsert produto
        await query(
          `INSERT INTO produto (SKU, nome, categoria)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE nome = VALUES(nome), categoria = VALUES(categoria)`,
          [sku, nome, categoria]
        );
        log.produtos++;

        // 3. Sincroniza variações (grade: tamanho/cor)
        const grade = p.grids ?? p.grid ?? p.variations ?? [];
        for (const g of grade) {
          const tamanho = g.size        ?? g.tamanho ?? "M";
          const cor     = g.color?.description ?? g.cor ?? g.colorDescription ?? "Único";

          // Normaliza tamanho para o ENUM do banco
          const tamanhosValidos = ['PP', 'P', 'M', 'G', 'GG'];
          const tamanhoNorm = tamanhosValidos.includes(tamanho?.toUpperCase())
            ? tamanho.toUpperCase() : 'M';

          // Busca preço correspondente
          const precoItem = precos.find(pr =>
            (pr.productCode ?? pr.code) == sku &&
            (pr.size ?? pr.tamanho) === tamanho
          );
          const preco = precoItem?.price ?? precoItem?.valor ?? 0;

          const existe = await query(
            "SELECT id_var FROM variacoes_produto WHERE SKU = ? AND tamanho = ? AND cor = ?",
            [sku, tamanhoNorm, cor]
          );

          let id_var;
          if (existe.length) {
            await query(
              "UPDATE variacoes_produto SET preco = ? WHERE id_var = ?",
              [preco, existe[0].id_var]
            );
            id_var = existe[0].id_var;
          } else {
            const r = await query(
              "INSERT INTO variacoes_produto (SKU, tamanho, cor, preco) VALUES (?, ?, ?, ?)",
              [sku, tamanhoNorm, cor, preco]
            );
            id_var = r.insertId;
          }
          log.variacoes++;

          // 4. Sincroniza estoque
          const saldoItem = saldos.find(s =>
            (s.productCode ?? s.code) == sku &&
            (s.size ?? s.tamanho) === tamanho &&
            (s.color ?? s.cor) === cor
          );
          const saldo = saldoItem?.balance ?? saldoItem?.saldo ?? 0;

          const estoqueExiste = await query(
            "SELECT id_Estoque FROM estoque WHERE id_var = ?",
            [id_var]
          );

          if (estoqueExiste.length) {
            await query(
              "UPDATE estoque SET saldo_disponivel = ?, uptaded_at = NOW() WHERE id_var = ?",
              [saldo, id_var]
            );
          } else {
            await query(
              "INSERT INTO estoque (id_var, localizacao, saldo_disponivel) VALUES (?, 'TOTVS', ?)",
              [id_var, saldo]
            );
          }
          log.estoque++;
        }
      } catch (e) {
        log.erros.push({ produto: p.code ?? p.id, erro: e.message });
      }
    }

    res.json({
      mensagem: "Sincronização concluída!",
      resultado: log,
    });
  } catch (err) {
    res.status(500).json({ erro: err.message, log });
  }
});

module.exports = router;