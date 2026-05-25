const router = require("express").Router();
const { query } = require("../db");

router.get("/", async (_req, res) => {
  try { res.json(await query("SELECT * FROM produto")); }
  catch (err) { res.status(500).json({ erro: err.message }); }
});

router.get("/:sku", async (req, res) => {
  try {
    const rows = await query("SELECT * FROM produto WHERE SKU = ?", [req.params.sku]);
    if (!rows.length) return res.status(404).json({ erro: "Produto não encontrado" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.post("/", async (req, res) => {
  const { SKU, nome, categoria } = req.body;
  try {
    await query("INSERT INTO produto (SKU, nome, categoria) VALUES (?, ?, ?)", [SKU, nome, categoria]);
    res.status(201).json({ SKU });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.put("/:sku", async (req, res) => {
  const { nome, categoria } = req.body;
  try {
    await query("UPDATE produto SET nome = ?, categoria = ? WHERE SKU = ?", [nome, categoria, req.params.sku]);
    res.json({ mensagem: "Produto atualizado" });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.delete("/:sku", async (req, res) => {
  try {
    await query("DELETE FROM produto WHERE SKU = ?", [req.params.sku]);
    res.json({ mensagem: "Produto removido" });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

module.exports = router;