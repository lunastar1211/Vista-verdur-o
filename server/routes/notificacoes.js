const router = require("express").Router();
const { query } = require("../db");

router.get("/", async (req, res) => {
  try {
    const { id_usuario } = req.query;
    const sql = id_usuario
      ? "SELECT * FROM notificacao WHERE id_usuario = ? ORDER BY data_criacao DESC"
      : "SELECT * FROM notificacao ORDER BY data_criacao DESC";
    res.json(await query(sql, id_usuario ? [id_usuario] : []));
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.post("/", async (req, res) => {
  const { id_usuario, tipo, mensagem } = req.body;
  try {
    const result = await query(
      "INSERT INTO notificacao (id_usuario, tipo, mensagem) VALUES (?, ?, ?)",
      [id_usuario, tipo, mensagem]
    );
    res.status(201).json({ id_notificacao: result.insertId });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.patch("/:id/lida", async (req, res) => {
  try {
    await query("UPDATE notificacao SET lida = 1 WHERE id_notificacao = ?", [req.params.id]);
    res.json({ mensagem: "Notificação marcada como lida" });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

module.exports = router;