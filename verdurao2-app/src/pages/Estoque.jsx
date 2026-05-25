import '../styles/style.css'

import Sidebar from '../components/Sidebar'
import Topo from '../components/Topo'
import Rodape from '../components/Rodape'

import { useApi } from '../hooks/useApi'
import { getEstoque } from '../services/estoque'

// Limites para classificar status (ajuste conforme sua regra de negócio)
const LIMITE_CRITICO  = 10
const LIMITE_ATENCAO  = 25

function classificarStatus(saldo) {
  if (saldo <= LIMITE_CRITICO) return 'Crítico'
  if (saldo <= LIMITE_ATENCAO) return 'Atenção'
  return 'Normal'
}

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function Estoque() {
  const { data: itens, loading, error } = useApi(getEstoque)

  // ── KPIs calculados a partir dos dados reais ──────────────
  const valorTotal      = itens ? itens.reduce((acc, i) => acc + i.saldo_disponivel * i.preco, 0) : 0
  const totalItens      = itens ? itens.reduce((acc, i) => acc + i.saldo_disponivel, 0) : 0
  const produtosCadast  = itens ? new Set(itens.map(i => i.SKU)).size : 0
  const itensBaixo      = itens ? itens.filter(i => classificarStatus(i.saldo_disponivel) !== 'Normal').length : 0

  // ── Contagem de status ────────────────────────────────────
  const qtdNormal   = itens ? itens.filter(i => classificarStatus(i.saldo_disponivel) === 'Normal').length   : 0
  const qtdAtencao  = itens ? itens.filter(i => classificarStatus(i.saldo_disponivel) === 'Atenção').length  : 0
  const qtdCritico  = itens ? itens.filter(i => classificarStatus(i.saldo_disponivel) === 'Crítico').length  : 0

  // ── Estoque por categoria ─────────────────────────────────
  const porCategoria = itens
    ? itens.reduce((acc, i) => {
        acc[i.categoria] = (acc[i.categoria] || 0) + i.saldo_disponivel
        return acc
      }, {})
    : {}

  // ── Itens críticos/atenção para a tabela ──────────────────
  const itensCriticos = itens
    ? itens
        .filter(i => classificarStatus(i.saldo_disponivel) !== 'Normal')
        .sort((a, b) => a.saldo_disponivel - b.saldo_disponivel)
    : []

  return (
    <div className="layout">

      <Sidebar />

      <main className="conteudo-principal">

        <Topo />

        {/* Loading / Erro */}
        {loading && <p style={{ padding: '1rem' }}>Carregando estoque...</p>}
        {error   && <p style={{ padding: '1rem', color: 'red' }}>Erro ao carregar: {error}</p>}

        {/* KPIs Estoque */}
        <div className="kpi-estoque">

          <div className="kpi">
            <p>Valor Total em Estoque</p>
            <h3>{formatarMoeda(valorTotal)}</h3>
          </div>

          <div className="kpi">
            <p>Produtos Cadastrados</p>
            <h3>{produtosCadast}</h3>
          </div>

          <div className="kpi">
            <p>Itens em Estoque</p>
            <h3>{totalItens.toLocaleString('pt-BR')}</h3>
          </div>

          <div className="kpi">
            <p>Itens com Estoque Baixo</p>
            <h3 className="texto-vermelho">{itensBaixo}</h3>
          </div>

        </div>

        {/* Categorias e status */}
        <div className="estoque-categoria-status">

          <div className="card categoria-valor">
            <h4>Estoque por Categoria</h4>
            <ul>
              {Object.entries(porCategoria).map(([cat, qtd]) => (
                <li key={cat}>{cat}: {qtd} unid.</li>
              ))}
              {!loading && Object.keys(porCategoria).length === 0 && (
                <li>Nenhuma categoria encontrada</li>
              )}
            </ul>
          </div>

          <div className="card status-geral">
            <h4>Status do Estoque</h4>
            <p><span>Normal:</span>  {qtdNormal}  {qtdNormal  === 1 ? 'item' : 'itens'}</p>
            <p><span>Atenção:</span> {qtdAtencao} {qtdAtencao === 1 ? 'item' : 'itens'}</p>
            <p><span>Crítico:</span> {qtdCritico} {qtdCritico === 1 ? 'item' : 'itens'}</p>
          </div>

        </div>

        {/* Tabela */}
        <div className="card-tabela">

          <h4>Produtos com Estoque Crítico/Atenção</h4>

          <table className="tabela-estoque-baixo">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Cor</th>
                <th>Tamanho</th>
                <th>Categoria</th>
                <th>Estoque Atual</th>
                <th>Status</th>
                <th>Valor Unitário</th>
                <th>Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {itensCriticos.map((item) => {
                const status = classificarStatus(item.saldo_disponivel)
                return (
                  <tr key={item.id_Estoque}>
                    <td>{item.nome_produto}</td>
                    <td>{item.cor}</td>
                    <td>{item.tamanho}</td>
                    <td>{item.categoria}</td>
                    <td>{item.saldo_disponivel} unid.</td>
                    <td className={status === 'Crítico' ? 'status-critico' : 'status-atencao'}>
                      {status}
                    </td>
                    <td>{formatarMoeda(item.preco)}</td>
                    <td>{formatarMoeda(item.saldo_disponivel * item.preco)}</td>
                  </tr>
                )
              })}
              {!loading && itensCriticos.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '1rem' }}>
                    Nenhum item em situação crítica ou de atenção 🎉
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>

        <Rodape />

      </main>

    </div>
  )
}

export default Estoque