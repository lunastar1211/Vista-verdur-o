import '../styles/style.css'

import Sidebar from '../components/Sidebar'
import Topo from '../components/Topo'
import Rodape from '../components/Rodape'

import { useApi } from '../hooks/useApi'
import { getDashboardResumo } from '../services/dashboard'
import { getRelatorios } from '../services/relatorios'

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

function Relatorio() {
  const { data: resumo, loading: loadingResumo } = useApi(getDashboardResumo)
  const { data: relatorios, loading: loadingRel, error } = useApi(getRelatorios)

  return (
    <div className="layout">

      <Sidebar />

      <main className="conteudo-principal">

        <Topo />

        <h2>Relatórios</h2>

        <p className="descricao-relatorio">
          Análises e insights para apoiar suas decisões.
        </p>

        {error && <p style={{ padding: '1rem', color: 'red' }}>Erro: {error}</p>}

        {/* Indicadores */}
        <div className="indicadores-relatorio">

          <div className="indicador">
            <h4>Faturamento Total</h4>
            <p>{loadingResumo ? '...' : formatarMoeda(resumo?.receita_total ?? 0)}</p>
          </div>

          <div className="indicador">
            <h4>Total de Vendas</h4>
            <p>{loadingResumo ? '...' : Number(resumo?.total_vendas ?? 0).toLocaleString('pt-BR')}</p>
          </div>

          <div className="indicador">
            <h4>Ticket Médio</h4>
            <p>{loadingResumo ? '...' : formatarMoeda(resumo?.ticket_medio ?? 0)}</p>
          </div>

          <div className="indicador">
            <h4>Total de Clientes</h4>
            <p>{loadingResumo ? '...' : Number(resumo?.total_clientes ?? 0).toLocaleString('pt-BR')}</p>
          </div>

          <div className="indicador">
            <h4>Produtos Vendidos</h4>
            <p>{loadingResumo ? '...' : Number(resumo?.produtos_vendidos ?? 0).toLocaleString('pt-BR')}</p>
          </div>

        </div>

        {/* Tabela de relatórios */}
        <div className="card-tabela">

          <h4>Relatórios Disponíveis</h4>

          <table>
            <thead>
              <tr>
                <th>Relatório</th>
                <th>Gerado em</th>
                <th>Gerado por</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loadingRel && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>
                    Carregando...
                  </td>
                </tr>
              )}
              {!loadingRel && relatorios?.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '1rem', color: '#888' }}>
                    Nenhum relatório gerado ainda.
                  </td>
                </tr>
              )}
              {relatorios?.map((r) => (
                <tr key={r.id_relatorio}>
                  <td>Relatório IA #{r.id_relatorio}</td>
                  <td>{formatarData(r.data_geracao)}</td>
                  <td>{r.nome_usuario ?? '—'}</td>
                  <td>
                    <button
                      className="btn-acao"
                      title="Ver conteúdo"
                      onClick={() => alert(r.conteudo ?? 'Sem conteúdo')}
                    >
                      ↓
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {relatorios?.length > 0 && (
            <p className="paginacao">
              Mostrando {relatorios.length} {relatorios.length === 1 ? 'relatório' : 'relatórios'}
            </p>
          )}

        </div>

        <Rodape />

      </main>

    </div>
  )
}

export default Relatorio