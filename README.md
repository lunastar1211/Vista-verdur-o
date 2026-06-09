# Vista Verdurão — Sistema de Gestão de Estoque

Sistema de gestão desenvolvido para apoiar decisões estratégicas de estoque e vendas da Vista Verdurão, com análises automáticas de produtos parados, giro de estoque e curva ABC.

---

## 🚀 Tecnologias

**Frontend**
- React 19 + Vite
- React Router DOM
- Axios

**Backend**
- Node.js + Express
- MySQL2
- dotenv

**Banco de Dados**
- MySQL 8

---

## 📁 Estrutura do Projeto

```
Vista-verdur-o/
├── server/                  # Backend (API REST)
│   ├── routes/              # Rotas separadas por recurso
│   │   ├── analises.js      # Produtos parados, giro, curva ABC, sugestões
│   │   ├── dashboard.js     # Resumo para o dashboard
│   │   ├── estoque.js
│   │   ├── vendas.js
│   │   ├── produtos.js
│   │   ├── clientes.js
│   │   ├── usuarios.js
│   │   ├── totvs.js         # Integração com TOTVS Moda
│   │   └── ...
│   ├── services/
│   │   └── totvs.js         # Serviço de comunicação com a API TOTVS
│   ├── db.js                # Conexão com o banco de dados
│   ├── index.js             # Entrada do servidor
│   └── .env                 # Variáveis de ambiente (não versionado)
│
└── verdurao2-app/           # Frontend (React)
    └── src/
        ├── pages/           # Páginas da aplicação
        │   ├── Dashboard.jsx
        │   ├── Estoque.jsx
        │   ├── Vendas.jsx
        │   ├── Relatorio.jsx
        │   ├── Configuracoes.jsx
        │   └── Login.jsx
        ├── services/        # Camada de comunicação com a API
        │   ├── api.js       # Instância base do Axios
        │   ├── analises.js
        │   ├── dashboard.js
        │   ├── estoque.js
        │   ├── vendas.js
        │   └── ...
        ├── hooks/
        │   └── useApi.js    # Hook genérico para chamadas à API
        └── components/
            ├── Sidebar.jsx
            ├── Topo.jsx
            └── Rodape.jsx
```

---

## ⚙️ Como rodar localmente

### Pré-requisitos
- Node.js 18+
- MySQL 8
- npm

### 1. Clone o repositório
```bash
git clone https://github.com/lunastar1211/Vista-verdur-o.git
cd Vista-verdur-o
git checkout New-Branch-Developer
```

### 2. Configure o banco de dados
```bash
# Crie o banco no MySQL
mysql -u root -p < vista_verdurao_db.sql

# Insira os dados de teste
mysql -u root -p db_vv < seed.sql
```

### 3. Configure o backend
```bash
cd server
npm install
```

Crie o arquivo `server/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=db_vv
PORT=3001
TOTVS_URL=https://www30.bhan.com.br:9443
TOTVS_TOKEN=seu_token_aqui
```

### 4. Configure o frontend
```bash
cd verdurao2-app
npm install
```

Crie o arquivo `verdurao2-app/.env`:
```env
VITE_API_URL=http://localhost:3001
```

### 5. Rode os dois servidores

**Terminal 1 — Backend:**
```bash
cd server
npx nodemon index.js
```

**Terminal 2 — Frontend:**
```bash
cd verdurao2-app
npm run dev
```

Acesse: `http://localhost:5173`

---

## 🔌 Integração TOTVS

O sistema se integra com a API TOTVS Moda para sincronizar produtos, estoque e preços reais da empresa.

**Testar conexão:**
```
GET http://localhost:3001/api/totvs/status
```

**Sincronizar dados:**
```
POST http://localhost:3001/api/totvs/sincronizar
```

---

## 📊 Funcionalidades

| Página | Funcionalidade |
|---|---|
| **Dashboard** | Receita total, vendas, ticket médio e alertas ativos |
| **Estoque** | KPIs, status por categoria e itens críticos/atenção |
| **Vendas** | Evolução por dia, por categoria e por canal |
| **Relatório → Indicadores** | Faturamento, clientes e produtos vendidos |
| **Relatório → Produtos Parados** | Itens sem venda ≥ 91 dias com saldo > 0 |
| **Relatório → Giro de Estoque** | Velocidade de saída por produto (unid/mês) |
| **Relatório → Curva ABC** | Classificação por impacto na receita |
| **Relatório → Sugestões** | Descontos progressivos automáticos por regra |
| **Configurações** | Dados do usuário e preferências |

### Regra de desconto automático

| Dias parado | Desconto sugerido |
|---|---|
| 91 a 120 dias | 10% |
| 121 a 180 dias | 20% |
| Mais de 180 dias | 30% |

---

## 🗄️ Banco de Dados

Principais tabelas:

| Tabela | Descrição |
|---|---|
| `produto` | Cadastro de produtos (SKU, nome, categoria) |
| `variacoes_produto` | Variações por tamanho, cor e preço |
| `estoque` | Saldo disponível por variação |
| `venda` | Cabeçalho das vendas |
| `item_venda` | Itens de cada venda |
| `alerta_produto` | Alertas de produtos parados |
| `sugestao_promo` | Sugestões de desconto geradas |
| `usuario` | Usuários do sistema |
| `log_auditoria` | Registro de ações |

---

## 👥 Squad

Desenvolvido pelo Squad 23 — Projeto Vista Verdurão  
Curso de Ciência da Computação.

---

## 📄 Licença

Projeto acadêmico — todos os direitos reservados.
