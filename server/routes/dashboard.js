const router = require("express").Router();
const { query } = require("../db");

router.get("/resumo", async (_req, res) => {
  try {
    const [vendas, receita, estoque, alertas, clientes, produtosVendidos] = await Promise.all([

      query(`
        SELECT
          COUNT(DISTINCT v.id_venda)                 AS total_vendas,
          COALESCE(SUM(iv.quantidade * iv.preco), 0) AS receita_total,
          COALESCE(AVG(sub.total), 0)                AS ticket_medio
        FROM venda v
        LEFT JOIN item_venda iv ON iv.id_venda = v.id_venda
        LEFT JOIN (
          SELECT id_venda, SUM(quantidade * preco) AS total
          FROM item_venda GROUP BY id_venda
        ) sub ON sub.id_venda = v.id_venda
      `),

      query(`
        SELECT
          v.id_venda, v.numero_pedido, v.canal, v.status, v.data_venda,
          c.nome AS nome_cliente,
          COUNT(iv.id_item)                          AS qtd_itens,
          COALESCE(SUM(iv.quantidade * iv.preco), 0) AS total
        FROM venda v
        LEFT JOIN cliente c     ON c.id_cliente  = v.id_cliente
        LEFT JOIN item_venda iv ON iv.id_venda   = v.id_venda
        GROUP BY v.id_venda
        ORDER BY v.data_venda DESC
        LIMIT 10
      `),

      query(`
        SELECT COALESCE(SUM(e.saldo_disponivel * v.preco), 0) AS valor_estoque
        FROM estoque e
        JOIN variacoes_produto v ON v.id_var = e.id_var
      `),

      query(`SELECT COUNT(*) AS total FROM alerta_produto WHERE status_alerta = 'ativo'`),

      query(`SELECT COUNT(*) AS total FROM cliente`),

      query(`SELECT COALESCE(SUM(quantidade), 0) AS total FROM item_venda`),
    ]);

    res.json({
      total_vendas:      vendas[0].total_vendas,
      receita_total:     vendas[0].receita_total,
      ticket_medio:      vendas[0].ticket_medio,
      valor_estoque:     estoque[0].valor_estoque,
      alertas_ativos:    alertas[0].total,
      total_clientes:    clientes[0].total,
      produtos_vendidos: produtosVendidos[0].total,
      ultimas_vendas:    receita,
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;