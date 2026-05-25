import '../styles/style.css'

import Sidebar from '../components/Sidebar'
import Topo from '../components/Topo'
import Rodape from '../components/Rodape'

import { useApi } from '../hooks/useApi'
import { getVendasStats } from '../services/vendas'

function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarData(dataISO) {
  if (!dataISO) return '—'
  return new Date(dataISO).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

// Converte lista [{categoria, total}] em porcentagens
function calcularPorcentagens(lista) {
  const soma = lista.reduce((acc, i) => acc + Number(i.total), 0)
  if (soma === 0) return lista.map(i => ({ ...i, pct: 0 }))
  return lista.map(i => ({ ...i, pct: Math.round((Number(i.total) / soma) * 100) }))
}

function BarraHorizontal({ label, pct, valor }) {
  return (
    <li style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
        <span>{label}</span>
        <span>{pct}% · {formatarMoeda(valor)}</span>
      </div>
      <div style={{ background: '#eee', borderRadius: 4, height: 8 }}>
        <div style={{ width: `${pct}%`, background: '#2e7d32', height: 8, borderRadius: 4, transition: 'width 0.4s' }} />
      </div>
    </li>
  )
}

function Vendas() {
  const { data, loading, error } = useApi(getVendasStats)

  const categorias = data ? calcularPorcentagens(data.porCategoria) : []
  const canais     = data ? calcularPorcentagens(data.porCanal)     : []
  const porDia     = data?.porDia ?? []

  // Maior valor do dia para escalar o gráfico
  const maxDia = porDia.length ? Math.max(...porDia.map(d => Number(d.total))) : 1

  return (
    <div className="layout">

      <Sidebar />

      <main className="conteudo-principal">

        <Topo />

        {loading && <p style={{ padding: '1rem' }}>Carregando vendas...</p>}
        {error   && <p style={{ padding: '1rem', color: 'red' }}>Erro: {error}</p>}

        <h2 className="titulo-pagina">Evolução das Vendas</h2>

        {/* Gráfico de barras por dia */}
        <div className="grafico-linha" style={{ overflowX: 'auto' }}>
          {porDia.length === 0 && !loading ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
              Nenhuma venda nos últimos 30 dias.
            </p>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, minHeight: 120, padding: '1rem 0.5rem 0.5rem' }}>
              {porDia.map((d) => {
                const altura = Math.max(8, (Number(d.total) / maxDia) * 100)
                return (
                  <div key={d.dia} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 32 }}>
                    <span style={{ fontSize: '0.65rem', color: '#555', marginBottom: 4 }}>
                      {formatarMoeda(d.total)}
                    </span>
                    <div
                      title={`${formatarData(d.dia)}: ${formatarMoeda(d.total)}`}
                      style={{ width: '100%', height: altura, background: '#2e7d32', borderRadius: '3px 3px 0 0' }}
                    />
                    <span style={{ fontSize: '0.65rem', color: '#888', marginTop: 4 }}>
                      {formatarData(d.dia)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Painéis */}
        <div className="dois-paineis">

          <div className="card-categoria">
            <h3>Vendas por Categoria</h3>
            {categorias.length === 0 && !loading
              ? <p style={{ color: '#888' }}>Sem dados.</p>
              : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {categorias.map((c) => (
                    <BarraHorizontal key={c.categoria} label={c.categoria} pct={c.pct} valor={c.total} />
                  ))}
                </ul>
              )
            }
          </div>

          <div className="card-canal">
            <h3>Vendas por Canal</h3>
            {canais.length === 0 && !loading
              ? <p style={{ color: '#888' }}>Sem dados.</p>
              : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {canais.map((c) => (
                    <BarraHorizontal key={c.canal} label={c.canal} pct={c.pct} valor={c.total} />
                  ))}
                </ul>
              )
            }
          </div>

        </div>

        <Rodape />

      </main>

    </div>
  )
}

export default Vendas