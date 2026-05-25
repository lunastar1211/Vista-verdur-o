const router = require("express").Router();
const { query } = require("../db");

router.get("/", async (_req, res) => {
  try {
    res.json(await query(`
      SELECT a.*, vp.tamanho, vp.cor, p.nome AS nome_produto, e.saldo_disponivel
      FROM alerta_produto a
      JOIN variacoes_produto vp ON vp.id_var = a.id_var
      JOIN produto p ON p.SKU = vp.SKU
      LEFT JOIN estoque e ON e.id_Estoque = a.id_estoque
      ORDER BY a.data_deteccao DESC
    `));
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.post("/", async (req, res) => {
  const { dias_sem_v, status_alerta, id_var, id_estoque } = req.body;
  try {
    const result = await query(
      "INSERT INTO alerta_produto (dias_sem_v, status_alerta, id_var, id_estoque) VALUES (?, ?, ?, ?)",
      [dias_sem_v, status_alerta, id_var, id_estoque]
    );
    res.status(201).json({ id_alerta: result.insertId });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.put("/:id", async (req, res) => {
  const { status_alerta } = req.body;
  try {
    await query(
      "UPDATE alerta_produto SET status_alerta = ? WHERE id_alerta = ?",
      [status_alerta, req.params.id]
    );
    res.json({ mensagem: "Alerta atualizado" });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

module.exports = router;