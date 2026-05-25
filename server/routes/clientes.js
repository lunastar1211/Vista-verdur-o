const router = require("express").Router();
const { query } = require("../db");

router.get("/", async (_req, res) => {
  try { res.json(await query("SELECT * FROM cliente")); }
  catch (err) { res.status(500).json({ erro: err.message }); }
});

router.get("/:id", async (req, res) => {
  try {
    const rows = await query("SELECT * FROM cliente WHERE id_cliente = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ erro: "Cliente não encontrado" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.post("/", async (req, res) => {
  const { id_cliente, nome, email } = req.body;
  try {
    await query(
      "INSERT INTO cliente (id_cliente, nome, email) VALUES (?, ?, ?)",
      [id_cliente, nome, email]
    );
    res.status(201).json({ id_cliente });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.put("/:id", async (req, res) => {
  const { nome, email } = req.body;
  try {
    await query(
      "UPDATE cliente SET nome = ?, email = ? WHERE id_cliente = ?",
      [nome, email, req.params.id]
    );
    res.json({ mensagem: "Cliente atualizado" });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

module.exports = router;