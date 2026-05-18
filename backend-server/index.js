const express = require("express");
const cors    = require("cors");
const mysql   = require("mysql2");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ── Conexão com o banco ───────────────────────────────────────
const db = mysql.createPool({
  host:     process.env.DB_HOST     || "localhost",
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME     || "db_vv",
});

db.getConnection((err, conn) => {
  if (err) {
    console.error("Erro ao conectar no banco:", err.message);
  } else {
    console.log("✅  Banco conectado!");
    conn.release();
  }
});

// Helper para queries com Promise
const query = (sql, params) =>
  new Promise((resolve, reject) =>
    db.query(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)))
  );

// ── Health check ──────────────────────────────────────────────
app.get("/", (_req, res) => res.send("Servidor funcionando!"));
app.get("/api/health", (_req, res) => res.json({ status: "ok", timestamp: new Date() }));

// ══════════════════════════════════════════════════════════════
// PRODUTOS
// ══════════════════════════════════════════════════════════════
app.get("/api/produtos", async (_req, res) => {
  try { res.json(await query("SELECT * FROM produto")); }
  catch (err) { res.status(500).json({ erro: err.message }); }
});

app.get("/api/produtos/:sku", async (req, res) => {
  try {
    const rows = await query("SELECT * FROM produto WHERE SKU = ?", [req.params.sku]);
    if (!rows.length) return res.status(404).json({ erro: "Produto não encontrado" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.post("/api/produtos", async (req, res) => {
  const { SKU, nome, categoria } = req.body;
  try {
    await query("INSERT INTO produto (SKU, nome, categoria) VALUES (?, ?, ?)", [SKU, nome, categoria]);
    res.status(201).json({ SKU });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.put("/api/produtos/:sku", async (req, res) => {
  const { nome, categoria } = req.body;
  try {
    await query("UPDATE produto SET nome = ?, categoria = ? WHERE SKU = ?", [nome, categoria, req.params.sku]);
    res.json({ mensagem: "Produto atualizado" });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.delete("/api/produtos/:sku", async (req, res) => {
  try {
    await query("DELETE FROM produto WHERE SKU = ?", [req.params.sku]);
    res.json({ mensagem: "Produto removido" });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ══════════════════════════════════════════════════════════════
// VARIAÇÕES DE PRODUTO
// ══════════════════════════════════════════════════════════════
app.get("/api/variacoes", async (_req, res) => {
  try {
    res.json(await query(`
      SELECT v.*, p.nome AS nome_produto, p.categoria
      FROM variacoes_produto v
      JOIN produto p ON p.SKU = v.SKU
    `));
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});
app.post("/api/variacoes", (req, res) => {
  const { SKU, tamanho, cor, preco } = req.body;

  console.log("Recebido:", req.body);

  const sql = `
    INSERT INTO variacoes_produto
    (SKU, tamanho, cor, preco)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [SKU, tamanho, cor, preco], (err, result) => {
    if (err) {
      console.error("Erro SQL:", err);

      return res.status(500).json({
        erro: err.message
      });
    }

    return res.status(201).json({
      mensagem: "Variação criada com sucesso",
      id_var: result.insertId
    });
  });
});
// ══════════════════════════════════════════════════════════════
// ESTOQUE
// ══════════════════════════════════════════════════════════════
app.get("/api/estoque", async (_req, res) => {
  try {
    res.json(await query(`
      SELECT e.*, v.tamanho, v.cor, v.preco, p.nome AS nome_produto, p.SKU
      FROM estoque e
      JOIN variacoes_produto v ON v.id_var = e.id_var
      JOIN produto p ON p.SKU = v.SKU
    `));
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.get("/api/estoque/:id", async (req, res) => {
  try {
    const rows = await query("SELECT * FROM estoque WHERE id_Estoque = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ erro: "Estoque não encontrado" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.post("/api/estoque", async (req, res) => {
  const { id_var, localizacao, saldo_disponivel } = req.body;
  try {
    const result = await query(
      "INSERT INTO estoque (id_var, localizacao, saldo_disponivel) VALUES (?, ?, ?)",
      [id_var, localizacao, saldo_disponivel]
    );
    res.status(201).json({ id_Estoque: result.insertId });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.patch("/api/estoque/:id/saldo", async (req, res) => {
  const { saldo_disponivel } = req.body;
  try {
    await query("UPDATE estoque SET saldo_disponivel = ?, uptaded_at = NOW() WHERE id_Estoque = ?",
      [saldo_disponivel, req.params.id]);
    res.json({ mensagem: "Saldo atualizado" });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ══════════════════════════════════════════════════════════════
// CLIENTES
// ══════════════════════════════════════════════════════════════
app.get("/api/clientes", async (_req, res) => {
  try { res.json(await query("SELECT * FROM cliente")); }
  catch (err) { res.status(500).json({ erro: err.message }); }
});

app.get("/api/clientes/:id", async (req, res) => {
  try {
    const rows = await query("SELECT * FROM cliente WHERE id_cliente = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ erro: "Cliente não encontrado" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.post("/api/clientes", async (req, res) => {
  const { id_cliente, nome, email } = req.body;
  try {
    await query("INSERT INTO cliente (id_cliente, nome, email) VALUES (?, ?, ?)", [id_cliente, nome, email]);
    res.status(201).json({ id_cliente });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.put("/api/clientes/:id", async (req, res) => {
  const { nome, email } = req.body;
  try {
    await query("UPDATE cliente SET nome = ?, email = ? WHERE id_cliente = ?", [nome, email, req.params.id]);
    res.json({ mensagem: "Cliente atualizado" });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ══════════════════════════════════════════════════════════════
// USUÁRIOS
// ══════════════════════════════════════════════════════════════
app.get("/api/usuarios", async (_req, res) => {
  try {
    res.json(await query(
      "SELECT id_usuario, nome, email, tipo, provider, ativo, created_at FROM usuario"
    ));
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.get("/api/usuarios/:id", async (req, res) => {
  try {
    const rows = await query(
      "SELECT id_usuario, nome, email, tipo, provider, ativo, created_at FROM usuario WHERE id_usuario = ?",
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ erro: "Usuário não encontrado" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.post("/api/usuarios", async (req, res) => {
  const { nome, email, senha_hash, tipo, provider, ativo } = req.body;
  try {
    const result = await query(
      "INSERT INTO usuario (nome, email, senha_hash, tipo, provider, ativo) VALUES (?, ?, ?, ?, ?, ?)",
      [nome, email, senha_hash, tipo, provider, ativo ?? 1]
    );
    res.status(201).json({ id_usuario: result.insertId });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.put("/api/usuarios/:id", async (req, res) => {
  const { nome, email, tipo, ativo } = req.body;
  try {
    await query("UPDATE usuario SET nome = ?, email = ?, tipo = ?, ativo = ? WHERE id_usuario = ?",
      [nome, email, tipo, ativo, req.params.id]);
    res.json({ mensagem: "Usuário atualizado" });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ══════════════════════════════════════════════════════════════
// VENDAS
// ══════════════════════════════════════════════════════════════
app.get("/api/vendas", async (_req, res) => {
  try {
    res.json(await query(`
      SELECT v.*, c.nome AS nome_cliente
      FROM venda v
      LEFT JOIN cliente c ON c.id_cliente = v.id_cliente
      ORDER BY v.data_venda DESC
    `));
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.get("/api/vendas/:id", async (req, res) => {
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

app.post("/api/vendas", async (req, res) => {
  const { id_cliente, numero_pedido, canal, status, itens } = req.body;
  db.getConnection(async (err, conn) => {
    if (err) return res.status(500).json({ erro: err.message });
    const q = (sql, params) => new Promise((resolve, reject) =>
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
          await q("INSERT INTO item_venda (quantidade, preco, id_venda, id_var) VALUES (?, ?, ?, ?)",
            [item.quantidade, item.preco, id_venda, item.id_var]);
          await q("UPDATE estoque SET saldo_disponivel = saldo_disponivel - ? WHERE id_var = ?",
            [item.quantidade, item.id_var]);
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

app.put("/api/vendas/:id/status", async (req, res) => {
  const { status } = req.body;
  try {
    await query("UPDATE venda SET status = ? WHERE id_venda = ?", [status, req.params.id]);
    res.json({ mensagem: "Status atualizado" });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ══════════════════════════════════════════════════════════════
// ALERTAS
// ══════════════════════════════════════════════════════════════
app.get("/api/alertas", async (_req, res) => {
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

app.post("/api/alertas", async (req, res) => {
  const { dias_sem_v, status_alerta, id_var, id_estoque } = req.body;
  try {
    const result = await query(
      "INSERT INTO alerta_produto (dias_sem_v, status_alerta, id_var, id_estoque) VALUES (?, ?, ?, ?)",
      [dias_sem_v, status_alerta, id_var, id_estoque]
    );
    res.status(201).json({ id_alerta: result.insertId });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.put("/api/alertas/:id", async (req, res) => {
  const { status_alerta } = req.body;
  try {
    await query("UPDATE alerta_produto SET status_alerta = ? WHERE id_alerta = ?",
      [status_alerta, req.params.id]);
    res.json({ mensagem: "Alerta atualizado" });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ══════════════════════════════════════════════════════════════
// SUGESTÕES DE PROMOÇÃO
// ══════════════════════════════════════════════════════════════
app.get("/api/sugestoes", async (_req, res) => {
  try {
    res.json(await query(`
      SELECT s.*, u.nome AS nome_usuario
      FROM sugestao_promo s
      LEFT JOIN usuario u ON u.id_usuario = s.id_usuario
      ORDER BY s.data_geracao DESC
    `));
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.post("/api/sugestoes", async (req, res) => {
  const { desconto_sugerido, justificativa, score_confianca, status_decisao,
          data_geracao, data_decisao, id_alerta, id_usuario } = req.body;
  try {
    const result = await query(
      `INSERT INTO sugestao_promo
        (desconto_sugerido, justificativa, score_confianca, status_decisao,
         data_geracao, data_decisao, id_alerta, id_usuario)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [desconto_sugerido, justificativa, score_confianca, status_decisao,
       data_geracao, data_decisao, id_alerta, id_usuario]
    );
    res.status(201).json({ id_sugestao: result.insertId });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.patch("/api/sugestoes/:id/decisao", async (req, res) => {
  const { status_decisao, id_usuario } = req.body;
  try {
    await query(
      "UPDATE sugestao_promo SET status_decisao = ?, id_usuario = ?, data_decisao = NOW() WHERE id_sugestao = ?",
      [status_decisao, id_usuario, req.params.id]
    );
    res.json({ mensagem: "Decisão registrada" });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ══════════════════════════════════════════════════════════════
// PREVISÕES DE TENDÊNCIA
// ══════════════════════════════════════════════════════════════
app.get("/api/previsoes", async (_req, res) => {
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

app.post("/api/previsoes", async (req, res) => {
  const { periodo_ref, vendas_previstas, calc_mae, data_geracao, id_var } = req.body;
  try {
    const result = await query(
      "INSERT INTO previsao_tendencia (periodo_ref, vendas_previstas, calc_mae, data_geracao, id_var) VALUES (?, ?, ?, ?, ?)",
      [periodo_ref, vendas_previstas, calc_mae, data_geracao, id_var]
    );
    res.status(201).json({ id_previsao: result.insertId });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ══════════════════════════════════════════════════════════════
// NOTIFICAÇÕES
// ══════════════════════════════════════════════════════════════
app.get("/api/notificacoes", async (req, res) => {
  try {
    const { id_usuario } = req.query;
    const sql = id_usuario
      ? "SELECT * FROM notificacao WHERE id_usuario = ? ORDER BY data_criacao DESC"
      : "SELECT * FROM notificacao ORDER BY data_criacao DESC";
    res.json(await query(sql, id_usuario ? [id_usuario] : []));
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.post("/api/notificacoes", async (req, res) => {
  const { id_usuario, tipo, mensagem } = req.body;
  try {
    const result = await query(
      "INSERT INTO notificacao (id_usuario, tipo, mensagem) VALUES (?, ?, ?)",
      [id_usuario, tipo, mensagem]
    );
    res.status(201).json({ id_notificacao: result.insertId });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.patch("/api/notificacoes/:id/lida", async (req, res) => {
  try {
    await query("UPDATE notificacao SET lida = 1 WHERE id_notificacao = ?", [req.params.id]);
    res.json({ mensagem: "Notificação marcada como lida" });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ══════════════════════════════════════════════════════════════
// RELATÓRIOS IA
// ══════════════════════════════════════════════════════════════
app.get("/api/relatorios", async (_req, res) => {
  try {
    res.json(await query(`
      SELECT r.id_relatorio, r.data_geracao, r.id_usuario, u.nome AS nome_usuario
      FROM relatorio_ia r JOIN usuario u ON u.id_usuario = r.id_usuario
      ORDER BY r.data_geracao DESC
    `));
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.get("/api/relatorios/:id", async (req, res) => {
  try {
    const rows = await query("SELECT * FROM relatorio_ia WHERE id_relatorio = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ erro: "Relatório não encontrado" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.post("/api/relatorios", async (req, res) => {
  const { id_usuario, conteudo, data_geracao } = req.body;
  try {
    const result = await query(
      "INSERT INTO relatorio_ia (id_usuario, conteudo, data_geracao) VALUES (?, ?, ?)",
      [id_usuario, conteudo, data_geracao]
    );
    res.status(201).json({ id_relatorio: result.insertId });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ══════════════════════════════════════════════════════════════
// LOGS DE AUDITORIA
// ══════════════════════════════════════════════════════════════
app.get("/api/logs", async (_req, res) => {
  try {
    res.json(await query(`
      SELECT l.*, u.nome AS nome_usuario
      FROM log_auditoria l
      LEFT JOIN usuario u ON u.id_usuario = l.id_usuario
      ORDER BY l.created_at DESC
    `));
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.post("/api/logs", async (req, res) => {
  const { tipo_evento, id_referencia, score_confianca, motivo, contexto, id_usuario } = req.body;
  try {
    const result = await query(
      "INSERT INTO log_auditoria (tipo_evento, id_referencia, score_confianca, motivo, contexto, id_usuario) VALUES (?, ?, ?, ?, ?, ?)",
      [tipo_evento, id_referencia, score_confianca, motivo, contexto, id_usuario]
    );
    res.status(201).json({ id_log: result.insertId });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ══════════════════════════════════════════════════════════════
// BASE DE CONHECIMENTO
// ══════════════════════════════════════════════════════════════
app.get("/api/conhecimento", async (_req, res) => {
  try { res.json(await query("SELECT * FROM base_conhecimento ORDER BY updated_at DESC")); }
  catch (err) { res.status(500).json({ erro: err.message }); }
});

app.post("/api/conhecimento", async (req, res) => {
  const { tipo, titulo, conteudo } = req.body;
  try {
    const result = await query(
      "INSERT INTO base_conhecimento (tipo, titulo, conteudo) VALUES (?, ?, ?)",
      [tipo, titulo, conteudo]
    );
    res.status(201).json({ id_conhecimento: result.insertId });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.put("/api/conhecimento/:id", async (req, res) => {
  const { tipo, titulo, conteudo } = req.body;
  try {
    await query(
      "UPDATE base_conhecimento SET tipo = ?, titulo = ?, conteudo = ?, updated_at = NOW() WHERE id_conhecimento = ?",
      [tipo, titulo, conteudo, req.params.id]
    );
    res.json({ mensagem: "Conhecimento atualizado" });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.delete("/api/conhecimento/:id", async (req, res) => {
  try {
    await query("DELETE FROM base_conhecimento WHERE id_conhecimento = ?", [req.params.id]);
    res.json({ mensagem: "Registro removido" });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ── Inicialização ─────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));