const express = require("express");
const cors    = require("cors");
require("dotenv").config();

// Importa a conexão (apenas para inicializar o pool na startup)
require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// ── Health check ──────────────────────────────────────────────
app.get("/", (_req, res) => res.send("Servidor funcionando!"));
app.get("/api/health", (_req, res) => res.json({ status: "ok", timestamp: new Date() }));

// ── Rotas ─────────────────────────────────────────────────────
app.use("/api/produtos",      require("./routes/produtos"));
app.use("/api/variacoes",     require("./routes/variacoes"));
app.use("/api/estoque",       require("./routes/estoque"));
app.use("/api/clientes",      require("./routes/clientes"));
app.use("/api/usuarios",      require("./routes/usuarios"));
app.use("/api/vendas",        require("./routes/vendas"));
app.use("/api/alertas",       require("./routes/alertas"));
app.use("/api/sugestoes",     require("./routes/sugestoes"));
app.use("/api/previsoes",     require("./routes/previsoes"));
app.use("/api/notificacoes",  require("./routes/notificacoes"));
app.use("/api/relatorios",    require("./routes/relatorios"));
app.use("/api/logs",          require("./routes/logs"));
app.use("/api/conhecimento",  require("./routes/conhecimento"));
app.use("/api/dashboard", require("./routes/dashboard"));

// ── Inicialização ─────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));