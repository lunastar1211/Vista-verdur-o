const router = require("express").Router();
const { query } = require("../db");

router.get("/", async (_req, res) => {
  try {
    res.json(await query(`
      SELECT e.*, v.tamanho, v.cor, v.preco, p.nome AS nome_produto, p.categoria
      FROM estoque e
      JOIN variacoes_produto v ON v.id_var = e.id_var
      JOIN produto p ON p.SKU = v.SKU
    `));
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.get("/:id", async (req, res) => {
  try {
    const rows = await query("SELECT * FROM estoque WHERE id_Estoque = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ erro: "Estoque não encontrado" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.post("/", async (req, res) => {
  const { id_var, localizacao, saldo_disponivel } = req.body;
  try {
    const result = await query(
      "INSERT INTO estoque (id_var, localizacao, saldo_disponivel) VALUES (?, ?, ?)",
      [id_var, localizacao, saldo_disponivel]
    );
    res.status(201).json({ id_Estoque: result.insertId });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.patch("/:id/saldo", async (req, res) => {
  const { saldo_disponivel } = req.body;
  try {
    await query(
      "UPDATE estoque SET saldo_disponivel = ?, uptaded_at = NOW() WHERE id_Estoque = ?",
      [saldo_disponivel, req.params.id]
    );
    res.json({ mensagem: "Saldo atualizado" });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

module.exports = router;