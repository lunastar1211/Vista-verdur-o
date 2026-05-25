const router = require("express").Router();
const { query } = require("../db");

router.get("/", async (_req, res) => {
  try {
    res.json(await query(`
      SELECT pt.*, vp.tamanho, vp.cor, p.nome AS nome_produto
      FROM previsao_tendencia pt
      JOIN variacoes_produto vp ON vp.id_var = pt.id_var
      JOIN produto p ON p.SKU = vp.SKU
      ORDER BY pt.data_geracao DESC
    `));
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.post("/", async (req, res) => {
  const { periodo_ref, vendas_previstas, calc_mae, data_geracao, id_var } = req.body;
  try {
    const result = await query(
      "INSERT INTO previsao_tendencia (periodo_ref, vendas_previstas, calc_mae, data_geracao, id_var) VALUES (?, ?, ?, ?, ?)",
      [periodo_ref, vendas_previstas, calc_mae, data_geracao, id_var]
    );
    res.status(201).json({ id_previsao: result.insertId });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

module.exports = router;