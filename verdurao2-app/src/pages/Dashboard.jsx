import '../styles/style.css'

import Sidebar from '../components/Sidebar'
import Topo from '../components/Topo'
import Rodape from '../components/Rodape'

import { useApi } from '../hooks/useApi'
import { getDashboardResumo } from '../services/dashboard'

function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarData(dataISO) {
  if (!dataISO) return '—'
  return new Date(dataISO).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const CLASSE_STATUS = {
  concluido:  'status-concluido',
  cancelado:  'status-cancelado',
  pendente:   'status-pendente',
  processando:'status-processando',
}

function Dashboard() {
  const { data, loading, error } = useApi(getDashboardResumo)

  const ticketMedio = data?.ticket_medio   ?? 0
  const receita     = data?.receita_total  ?? 0
  const totalVendas = data?.total_vendas   ?? 0
  const alertas     = data?.alertas_ativos ?? 0
  const ultimas     = data?.ultimas_vendas ?? []

  return (
    <div className="layout">

      <Sidebar />

      <main className="conteudo-principal">

        <Topo />

        {loading && <p style={{ padding: '1rem' }}>Carregando dashboard...</p>}
        {error   && <p style={{ padding: '1rem', color: 'red' }}>Erro: {error}</p>}

        <section className="resumo-cards">

          <div className="card">
            <p>Receita Total</p>
            <h3>{formatarMoeda(receita)}</h3>
          </div>

          <div className="card">
            <p>Vendas</p>
            <h3>{Number(totalVendas).toLocaleString('pt-BR')}</h3>
          </div>

          <div className="card">
            <p>Ticket Médio</p>
            <h3>{formatarMoeda(ticketMedio)}</h3>
          </div>

          <div className="card">
            <p>Alertas Ativos</p>
            <h3 className={alertas > 0 ? 'texto-vermelho' : ''}>
              {alertas}
            </h3>
          </div>

        </section>

        <section className="tabela-vendas">

          <h2>Últimas Vendas</h2>

          <table>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Data</th>
                <th>Itens</th>
                <th>Total</th>
                <th>Status</th>
                <th>Canal</th>
              </tr>
            </thead>
            <tbody>
              {ultimas.map((v) => (
                <tr key={v.id_venda}>
                  <td>{v.numero_pedido || `#${v.id_venda}`}</td>
                  <td>{v.nome_cliente  || '—'}</td>
                  <td>{formatarData(v.data_venda)}</td>
                  <td>{v.qtd_itens} {v.qtd_itens === 1 ? 'item' : 'itens'}</td>
                  <td>{formatarMoeda(v.total)}</td>
                  <td className={CLASSE_STATUS[v.status?.toLowerCase()] || ''}>
                    {v.status}
                  </td>
                  <td>{v.canal}</td>
                </tr>
              ))}
              {!loading && ultimas.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '1rem' }}>
                    Nenhuma venda registrada ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </section>

        <Rodape />

      </main>

    </div>
  )
}

export default Dashboard