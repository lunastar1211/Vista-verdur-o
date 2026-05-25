const router = require("express").Router();
const { db, query } = require("../db");

router.get("/", async (_req, res) => {
  try {
    res.json(await query(`
      SELECT v.*, c.nome AS nome_cliente
      FROM venda v
      LEFT JOIN cliente c ON c.id_cliente = v.id_cliente
      ORDER BY v.data_venda DESC
    `));
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.get("/stats", async (_req, res) => {
  try {
    const [porCategoria, porCanal, porDia] = await Promise.all([

      // Receita por categoria de produto
      query(`
        SELECT p.categoria, SUM(iv.quantidade * iv.preco) AS total
        FROM item_venda iv
        JOIN variacoes_produto vp ON vp.id_var = iv.id_var
        JOIN produto p ON p.SKU = vp.SKU
        GROUP BY p.categoria
        ORDER BY total DESC
      `),

      // Receita por canal de venda
      query(`
        SELECT v.canal, SUM(iv.quantidade * iv.preco) AS total
        FROM venda v
        JOIN item_venda iv ON iv.id_venda = v.id_venda
        GROUP BY v.canal
        ORDER BY total DESC
      `),

      // Receita por dia (últimos 30 dias)
      query(`
        SELECT DATE(v.data_venda) AS dia, SUM(iv.quantidade * iv.preco) AS total
        FROM venda v
        JOIN item_venda iv ON iv.id_venda = v.id_venda
        WHERE v.data_venda >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(v.data_venda)
        ORDER BY dia ASC
      `),

    ]);

    res.json({ porCategoria, porCanal, porDia });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.get("/:id", async (req, res) => {
  try {
    const venda = await query("SELECT * FROM venda WHERE id_venda = ?", [req.params.id]);
    if (!venda.length) return res.status(404).json({ erro: "Venda não encontrada" });

    const itens = await query(`
      SELECT iv.*, vp.tamanho, vp.cor, p.nome AS nome_produto
      FROM item_venda iv
      JOIN variacoes_produto vp ON vp.id_var = iv.id_var
      JOIN produto p ON p.SKU = vp.SKU
      WHERE iv.id_venda = ?
    `, [req.params.id]);

    res.json({ ...venda[0], itens });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.post("/", (req, res) => {
  const { id_cliente, numero_pedido, canal, status, itens } = req.body;

  db.getConnection(async (err, conn) => {
    if (err) return res.status(500).json({ erro: err.message });

    const q = (sql, params) =>
      new Promise((resolve, reject) =>
        conn.query(sql, params, (e, r) => (e ? reject(e) : resolve(r)))
      );

    try {
      await q("START TRANSACTION");

      const result = await q(
        "INSERT INTO venda (id_cliente, numero_pedido, canal, status) VALUES (?, ?, ?, ?)",
        [id_cliente, numero_pedido, canal, status]
      );
      const id_venda = result.insertId;

      if (itens && itens.length) {
        for (const item of itens) {
          await q(
            "INSERT INTO item_venda (quantidade, preco, id_venda, id_var) VALUES (?, ?, ?, ?)",
            [item.quantidade, item.preco, id_venda, item.id_var]
          );
          await q(
            "UPDATE estoque SET saldo_disponivel = saldo_disponivel - ? WHERE id_var = ?",
            [item.quantidade, item.id_var]
          );
        }
      }

      await q("COMMIT");
      res.status(201).json({ id_venda });
    } catch (e) {
      await q("ROLLBACK");
      res.status(500).json({ erro: e.message });
    } finally {
      conn.release();
    }
  });
});

router.put("/:id/status", async (req, res) => {
  const { status } = req.body;
  try {
    await query("UPDATE venda SET status = ? WHERE id_venda = ?", [status, req.params.id]);
    res.json({ mensagem: "Status atualizado" });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

module.exports = router;