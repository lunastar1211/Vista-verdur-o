const router = require("express").Router();
const { query } = require("../db");

// ══════════════════════════════════════════════════════════════
// #16 — Produtos parados (CA01: >= 91 dias | CA02: saldo > 0)
// ══════════════════════════════════════════════════════════════
router.get("/produtos-parados", async (_req, res) => {
  try {
    const rows = await query(`
      SELECT
        p.SKU,
        p.nome                             AS nome_produto,
        p.categoria,
        vp.id_var,
        vp.tamanho,
        vp.cor,
        vp.preco,
        e.id_Estoque,
        e.saldo_disponivel,
        MAX(v.data_venda)                  AS ultima_venda,
        DATEDIFF(NOW(), MAX(v.data_venda)) AS dias_parado,
        CASE
          WHEN DATEDIFF(NOW(), MAX(v.data_venda)) BETWEEN 91 AND 120 THEN 10
          WHEN DATEDIFF(NOW(), MAX(v.data_venda)) BETWEEN 121 AND 180 THEN 20
          WHEN DATEDIFF(NOW(), MAX(v.data_venda)) > 180              THEN 30
          WHEN MAX(v.data_venda) IS NULL                             THEN 30
          ELSE 0
        END AS desconto_sugerido
      FROM produto p
      JOIN variacoes_produto vp ON vp.SKU = p.SKU
      JOIN estoque e            ON e.id_var = vp.id_var
      LEFT JOIN item_venda iv   ON iv.id_var = vp.id_var
      LEFT JOIN venda v         ON v.id_venda = iv.id_venda
      WHERE e.saldo_disponivel > 0
      GROUP BY p.SKU, vp.id_var, e.id_Estoque
      HAVING dias_parado >= 91 OR ultima_venda IS NULL
      ORDER BY dias_parado DESC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ══════════════════════════════════════════════════════════════
// #15 — Giro de estoque por variação
// ══════════════════════════════════════════════════════════════
router.get("/giro-estoque", async (_req, res) => {
  try {
    const rows = await query(`
      SELECT
        p.SKU,
        p.nome                                          AS nome_produto,
        p.categoria,
        vp.id_var,
        vp.tamanho,
        vp.cor,
        vp.preco,
        e.saldo_disponivel,
        COALESCE(SUM(iv.quantidade), 0)                 AS total_vendido,
        COUNT(DISTINCT v.id_venda)                      AS num_vendas,
        MAX(v.data_venda)                               AS ultima_venda,
        CASE
          WHEN DATEDIFF(NOW(), MIN(v.data_venda)) > 0
            THEN ROUND(COALESCE(SUM(iv.quantidade), 0)
                 / DATEDIFF(NOW(), MIN(v.data_venda)) * 30, 2)
          ELSE 0
        END                                             AS giro_mensal
      FROM produto p
      JOIN variacoes_produto vp ON vp.SKU = p.SKU
      JOIN estoque e            ON e.id_var = vp.id_var
      LEFT JOIN item_venda iv   ON iv.id_var = vp.id_var
      LEFT JOIN venda v         ON v.id_venda = iv.id_venda
      GROUP BY p.SKU, vp.id_var, e.id_Estoque
      ORDER BY giro_mensal DESC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ══════════════════════════════════════════════════════════════
// Curva ABC — classificação por receita acumulada
// ══════════════════════════════════════════════════════════════
router.get("/curva-abc", async (_req, res) => {
  try {
    const rows = await query(`
      SELECT
        p.SKU,
        p.nome                                        AS nome_produto,
        p.categoria,
        COALESCE(SUM(iv.quantidade * iv.preco), 0)    AS receita_total,
        COALESCE(SUM(iv.quantidade), 0)               AS qtd_vendida
      FROM produto p
      JOIN variacoes_produto vp ON vp.SKU = p.SKU
      LEFT JOIN item_venda iv   ON iv.id_var = vp.id_var
      GROUP BY p.SKU
      ORDER BY receita_total DESC
    `);

    const totalGeral = rows.reduce((acc, r) => acc + Number(r.receita_total), 0);
    let acumulado = 0;

    const comCurva = rows.map(r => {
      acumulado += Number(r.receita_total);
      const pct = totalGeral > 0 ? (acumulado / totalGeral) * 100 : 0;
      return {
        ...r,
        pct_acumulado: Math.round(pct),
        curva: pct <= 80 ? 'A' : pct <= 95 ? 'B' : 'C',
      };
    });

    res.json(comCurva);
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ══════════════════════════════════════════════════════════════
// #17 — Gerar sugestões de desconto por regra de negócio
// ══════════════════════════════════════════════════════════════
router.post("/gerar-sugestoes", async (req, res) => {
  try {
    // Busca produtos parados >= 91 dias com saldo > 0
    const parados = await query(`
      SELECT
        p.SKU, p.nome AS nome_produto, p.categoria,
        vp.id_var, vp.tamanho, vp.cor, vp.preco,
        e.id_Estoque, e.saldo_disponivel,
        MAX(v.data_venda)                  AS ultima_venda,
        DATEDIFF(NOW(), MAX(v.data_venda)) AS dias_parado
      FROM produto p
      JOIN variacoes_produto vp ON vp.SKU = p.SKU
      JOIN estoque e            ON e.id_var = vp.id_var
      LEFT JOIN item_venda iv   ON iv.id_var = vp.id_var
      LEFT JOIN venda v         ON v.id_venda = iv.id_venda
      WHERE e.saldo_disponivel > 0
      GROUP BY p.SKU, vp.id_var, e.id_Estoque
      HAVING dias_parado >= 91 OR ultima_venda IS NULL
      ORDER BY dias_parado DESC
    `);

    if (!parados.length) {
      return res.json({ mensagem: "Nenhum produto parado encontrado.", sugestoes: [] });
    }

    const salvas = [];

    for (const p of parados) {
      const dias = p.dias_parado ?? 91;

      // Regra de desconto progressivo
      let desconto, justificativa, score;
      if (dias >= 181) {
        desconto     = 30;
        justificativa = `Produto parado há ${dias} dias (mais de 6 meses). Desconto agressivo de 30% para liquidação imediata.`;
        score        = 95;
      } else if (dias >= 121) {
        desconto     = 20;
        justificativa = `Produto parado há ${dias} dias (4 a 6 meses). Desconto de 20% recomendado para acelerar saída.`;
        score        = 85;
      } else {
        desconto     = 10;
        justificativa = `Produto parado há ${dias} dias (91 a 120 dias). Desconto inicial de 10% para estimular vendas.`;
        score        = 75;
      }

      // Garante alerta no banco
      const existe = await query(
        "SELECT id_alerta FROM alerta_produto WHERE id_var = ? AND status_alerta = 'ativo'",
        [p.id_var]
      );
      let id_alerta;
      if (existe.length) {
        id_alerta = existe[0].id_alerta;
      } else {
        const r = await query(
          "INSERT INTO alerta_produto (dias_sem_v, status_alerta, id_var, id_estoque) VALUES (?, 'ativo', ?, ?)",
          [dias, p.id_var, p.id_Estoque]
        );
        id_alerta = r.insertId;
      }

      // Salva sugestão
      const r = await query(
        `INSERT INTO sugestao_promo
          (desconto_sugerido, justificativa, score_confianca, status_decisao,
           data_geracao, data_decisao, id_alerta, id_usuario)
         VALUES (?, ?, ?, 'pendente', NOW(), NOW(), ?, 1)`,
        [desconto, justificativa, score, id_alerta]
      );

      salvas.push({ id_sugestao: r.insertId, desconto_sugerido: desconto, justificativa });
    }

    res.status(201).json({ mensagem: `${salvas.length} sugestões geradas.`, sugestoes: salvas });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ══════════════════════════════════════════════════════════════
// Listar sugestões pendentes de aprovação
// ══════════════════════════════════════════════════════════════
router.get("/sugestoes-pendentes", async (_req, res) => {
  try {
    const rows = await query(`
      SELECT
        s.*,
        p.nome  AS nome_produto,
        vp.tamanho, vp.cor, vp.preco,
        e.saldo_disponivel,
        a.dias_sem_v
      FROM sugestao_promo s
      JOIN alerta_produto a     ON a.id_alerta = s.id_alerta
      JOIN variacoes_produto vp ON vp.id_var   = a.id_var
      JOIN produto p            ON p.SKU       = vp.SKU
      JOIN estoque e            ON e.id_var    = vp.id_var
      WHERE s.status_decisao = 'pendente'
      ORDER BY s.data_geracao DESC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ══════════════════════════════════════════════════════════════
// Aprovar ou rejeitar sugestão (CA04)
// ══════════════════════════════════════════════════════════════
router.patch("/sugestoes/:id/decisao", async (req, res) => {
  const { status_decisao, id_usuario } = req.body;
  if (!['aprovado', 'rejeitado'].includes(status_decisao)) {
    return res.status(400).json({ erro: "status_decisao deve ser 'aprovado' ou 'rejeitado'" });
  }
  try {
    await query(
      "UPDATE sugestao_promo SET status_decisao = ?, id_usuario = ?, data_decisao = NOW() WHERE id_sugestao = ?",
      [status_decisao, id_usuario ?? 1, req.params.id]
    );
    await query(
      "INSERT INTO log_auditoria (tipo_evento, id_referencia, motivo, id_usuario) VALUES (?, ?, ?, ?)",
      [`sugestao_${status_decisao}`, req.params.id, `Gestor ${status_decisao} sugestão`, id_usuario ?? 1]
    );
    res.json({ mensagem: `Sugestão ${status_decisao} com sucesso.` });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

module.exports = router;