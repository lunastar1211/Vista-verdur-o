const router = require("express").Router();
const { db, query } = require("../db");

router.get("/", async (_req, res) => {
  try {
    res.json(await query(`
      SELECT v.*, p.nome AS nome_produto, p.categoria
      FROM variacoes_produto v
      JOIN produto p ON p.SKU = v.SKU
    `));
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.post("/", (req, res) => {
  const { SKU, tamanho, cor, preco } = req.body;
  console.log("Recebido:", req.body);

  const sql = `
    INSERT INTO variacoes_produto (SKU, tamanho, cor, preco)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [SKU, tamanho, cor, preco], (err, result) => {
    if (err) {
      console.error("Erro SQL:", err);
      return res.status(500).json({ erro: err.message });
    }
    return res.status(201).json({
      mensagem: "Variação criada com sucesso",
      id_var: result.insertId,
    });
  });
});

module.exports = router;