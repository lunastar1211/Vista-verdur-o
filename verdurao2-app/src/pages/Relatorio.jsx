import '../styles/style.css'

import Sidebar from '../components/Sidebar'
import Topo from '../components/Topo'
import Rodape from '../components/Rodape'

import { useState } from 'react'
import { useApi, useMutation } from '../hooks/useApi'
import { getDashboardResumo } from '../services/dashboard'
import {
  getProdutosParados, getGiroEstoque, getCurvaAbc,
  getSugestoesPendentes, gerarSugestoes,
} from '../services/analises'

function formatarMoeda(v) {
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const ABAS = ['Indicadores', 'Produtos Parados', 'Giro de Estoque', 'Curva ABC', 'Sugestões de Promoção']

function Relatorio() {
  const [aba, setAba] = useState('Indicadores')

  const { data: resumo } = useApi(getDashboardResumo)
  const { data: parados,  loading: loadParados } = useApi(getProdutosParados)
  const { data: giro,     loading: loadGiro }    = useApi(getGiroEstoque)
  const { data: curva,    loading: loadCurva }   = useApi(getCurvaAbc)
  const { data: sugestoes, loading: loadSug, refetch: refetchSug } = useApi(getSugestoesPendentes)

  const { mutate: gerarSug, loading: gerando } = useMutation(() => gerarSugestoes(1))

  async function handleGerar() {
    try {
      const r = await gerarSug()
      alert(r.mensagem)
      refetchSug()
    } catch (e) { alert('Erro: ' + e.message) }
  }

  const estiloAba = (a) => ({
    padding: '0.5rem 1rem', borderRadius: 8, border: 'none', cursor: 'pointer',
    background: aba === a ? '#2e7d32' : '#eee',
    color: aba === a ? '#fff' : '#333',
    fontWeight: aba === a ? 600 : 400,
  })

  return (
    <div className="layout">
      <Sidebar />
      <main className="conteudo-principal">
        <Topo />

        <h2>Relatórios e Análises</h2>
        <p className="descricao-relatorio">Análises e insights para apoiar suas decisões.</p>

        <div style={{ display: 'flex', gap: '0.5rem', margin: '1.5rem 0', flexWrap: 'wrap' }}>
          {ABAS.map(a => <button key={a} onClick={() => setAba(a)} style={estiloAba(a)}>{a}</button>)}
        </div>

        {aba === 'Indicadores' && (
          <div className="indicadores-relatorio">
            <div className="indicador"><h4>Faturamento Total</h4><p>{formatarMoeda(resumo?.receita_total ?? 0)}</p></div>
            <div className="indicador"><h4>Total de Vendas</h4><p>{Number(resumo?.total_vendas ?? 0).toLocaleString('pt-BR')}</p></div>
            <div className="indicador"><h4>Ticket Médio</h4><p>{formatarMoeda(resumo?.ticket_medio ?? 0)}</p></div>
            <div className="indicador"><h4>Total de Clientes</h4><p>{Number(resumo?.total_clientes ?? 0).toLocaleString('pt-BR')}</p></div>
            <div className="indicador"><h4>Produtos Vendidos</h4><p>{Number(resumo?.produtos_vendidos ?? 0).toLocaleString('pt-BR')}</p></div>
          </div>
        )}

        {aba === 'Produtos Parados' && (
          <div className="card-tabela">
            <h4>Produtos parados há mais de 91 dias com saldo {'>'} 0</h4>
            {loadParados ? <p>Carregando...</p> : (
              <table>
                <thead>
                  <tr>
                    <th>Produto</th><th>Cor</th><th>Tamanho</th><th>Categoria</th>
                    <th>Saldo</th><th>Última Venda</th><th>Dias Parado</th><th>Desconto Sugerido</th>
                  </tr>
                </thead>
                <tbody>
                  {parados?.length === 0 && (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: '1rem' }}>Nenhum produto parado 🎉</td></tr>
                  )}
                  {parados?.map(p => (
                    <tr key={p.id_var}>
                      <td>{p.nome_produto}</td><td>{p.cor}</td><td>{p.tamanho}</td><td>{p.categoria}</td>
                      <td>{p.saldo_disponivel} unid.</td>
                      <td>{p.ultima_venda ? new Date(p.ultima_venda).toLocaleDateString('pt-BR') : 'Nunca vendeu'}</td>
                      <td style={{ color: '#c62828', fontWeight: 600 }}>{p.dias_parado ?? '> 91'} dias</td>
                      <td style={{ color: '#f57c00', fontWeight: 700 }}>{p.desconto_sugerido}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {aba === 'Giro de Estoque' && (
          <div className="card-tabela">
            <h4>Giro de Estoque — unidades vendidas por mês</h4>
            {loadGiro ? <p>Carregando...</p> : (
              <table>
                <thead>
                  <tr>
                    <th>Produto</th><th>Cor</th><th>Tamanho</th>
                    <th>Total Vendido</th><th>Giro/Mês</th><th>Saldo Atual</th><th>Última Venda</th>
                  </tr>
                </thead>
                <tbody>
                  {giro?.map(g => (
                    <tr key={g.id_var}>
                      <td>{g.nome_produto}</td><td>{g.cor}</td><td>{g.tamanho}</td>
                      <td>{g.total_vendido} unid.</td>
                      <td style={{ fontWeight: 600, color: g.giro_mensal > 0 ? '#2e7d32' : '#c62828' }}>{g.giro_mensal}</td>
                      <td>{g.saldo_disponivel} unid.</td>
                      <td>{g.ultima_venda ? new Date(g.ultima_venda).toLocaleDateString('pt-BR') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {aba === 'Curva ABC' && (
          <div className="card-tabela">
            <h4>Curva ABC — classificação por receita</h4>
            <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1rem' }}>
              Classifica produtos pelo impacto na receita total:
              <strong style={{ color: '#2e7d32' }}> A</strong> = primeiros 80% da receita,
              <strong style={{ color: '#f57c00' }}> B</strong> = próximos 15%,
              <strong style={{ color: '#c62828' }}> C</strong> = últimos 5%. Produtos C são candidatos a promoção.
            </p>
            {loadCurva ? <p>Carregando...</p> : (
              <table>
                <thead>
                  <tr>
                    <th>Produto</th><th>Categoria</th><th>Receita Total</th>
                    <th>Qtd Vendida</th><th>% Acumulado</th><th>Curva</th>
                  </tr>
                </thead>
                <tbody>
                  {curva?.map(c => (
                    <tr key={c.SKU}>
                      <td>{c.nome_produto}</td><td>{c.categoria}</td>
                      <td>{formatarMoeda(c.receita_total)}</td><td>{c.qtd_vendida}</td>
                      <td>{c.pct_acumulado}%</td>
                      <td style={{ fontWeight: 700, color: c.curva === 'A' ? '#2e7d32' : c.curva === 'B' ? '#f57c00' : '#c62828' }}>{c.curva}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {aba === 'Sugestões de Promoção' && (
          <div className="card-tabela">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0 }}>Sugestões de promoção geradas automaticamente</h4>
              <button onClick={handleGerar} disabled={gerando} style={{
                padding: '0.5rem 1.2rem', background: '#2e7d32', color: '#fff',
                border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
              }}>
                {gerando ? 'Gerando...' : '✦ Gerar Sugestões'}
              </button>
            </div>
            {loadSug ? <p>Carregando...</p> : (
              <table>
                <thead>
                  <tr>
                    <th>Produto</th><th>Cor</th><th>Tamanho</th><th>Saldo</th>
                    <th>Dias Parado</th><th>Preço Atual</th><th>Desconto Sugerido</th>
                    <th>Preço com Desconto</th><th>Justificativa</th>
                  </tr>
                </thead>
                <tbody>
                  {sugestoes?.length === 0 && (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '1rem', color: '#888' }}>
                        Nenhuma sugestão gerada. Clique em "Gerar Sugestões".
                      </td>
                    </tr>
                  )}
                  {sugestoes?.map(s => {
                    const precoComDesconto = s.preco - (s.preco * s.desconto_sugerido / 100)
                    return (
                      <tr key={s.id_sugestao}>
                        <td>{s.nome_produto}</td>
                        <td>{s.cor}</td>
                        <td>{s.tamanho}</td>
                        <td>{s.saldo_disponivel} unid.</td>
                        <td>{s.dias_sem_v} dias</td>
                        <td>{formatarMoeda(s.preco)}</td>
                        <td style={{ fontWeight: 700, color: '#f57c00' }}>{s.desconto_sugerido}%</td>
                        <td style={{ fontWeight: 700, color: '#2e7d32' }}>{formatarMoeda(precoComDesconto)}</td>
                        <td style={{ maxWidth: 250, fontSize: '0.85rem' }}>{s.justificativa}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        <Rodape />
      </main>
    </div>
  )
}

export default Relatorio