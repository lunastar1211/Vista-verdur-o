import '../styles/style.css'

import Sidebar from '../components/Sidebar'
import Topo from '../components/Topo'
import Rodape from '../components/Rodape'

function Relatorio() {

  return (
    <div className="layout">

      <Sidebar />

      <main className="conteudo-principal">

        <Topo />

        <h2>Relatórios</h2>

        <p className="descricao-relatorio">
          Análises e insights para apoiar suas decisões.
        </p>

        {/* Indicadores */}
        <div className="indicadores-relatorio">

          <div className="indicador">
            <h4>Faturamento Total</h4>
            <p>R$ 248.750,30</p>
            <span>▲ 8,5%</span>
          </div>

          <div className="indicador">
            <h4>Total de Vendas</h4>
            <p>1.245</p>
            <span>▲ 12,4%</span>
          </div>

          <div className="indicador">
            <h4>Ticket Médio</h4>
            <p>R$ 103,22</p>
            <span>▲ 7,2%</span>
          </div>

          <div className="indicador">
            <h4>Novos Clientes</h4>
            <p>89</p>
            <span>▲ 15,8%</span>
          </div>

          <div className="indicador">
            <h4>Produtos Vendidos</h4>
            <p>3.421</p>
            <span>▲ 9,1%</span>
          </div>

        </div>

        {/* Faturamento */}
        <div className="grafico-faturamento">

          <h4>
            Faturamento ao Longo do Tempo
          </h4>

          <div className="valores-fatura">
            R$ 0 | R$ 10 mil | R$ 20 mil | R$ 30 mil
          </div>

          <div className="datas-fatura">
            01/05 06/05 11/05 16/05 21/05 26/05 31/05
          </div>

        </div>

        {/* Tabela */}
        <div className="card-tabela">

          <h4>Relatórios Disponíveis</h4>

          <table>

            <thead>

              <tr>
                <th>Relatório</th>
                <th>Descrição</th>
                <th>Período</th>
                <th>Gerado em</th>
                <th>Gerado por</th>
                <th>Formato</th>
                <th>Ações</th>
              </tr>

            </thead>

            <tbody>

              <tr>
                <td>Relatório de Vendas</td>
                <td>Detalhamento completo das vendas</td>
                <td>01/05/2025 - 31/05/2025</td>
                <td>31/05/2025 08:45</td>
                <td>Administrador</td>
                <td>PDF</td>

                <td>
                  <button className="btn-acao">
                    ↓
                  </button>
                </td>
              </tr>

              <tr>
                <td>Relatório de Estoque</td>
                <td>Situação atual do estoque</td>
                <td>01/05/2025 - 31/05/2025</td>
                <td>31/05/2025 08:30</td>
                <td>Administrador</td>
                <td>Excel</td>

                <td>
                  <button className="btn-acao">
                    ↓
                  </button>
                </td>
              </tr>

              <tr>
                <td>Relatório de Clientes</td>
                <td>Análise da base de clientes</td>
                <td>01/05/2025 - 31/05/2025</td>
                <td>31/05/2025 08:15</td>
                <td>Administrador</td>
                <td>PDF</td>

                <td>
                  <button className="btn-acao">
                    ↓
                  </button>
                </td>
              </tr>

              <tr>
                <td>Relatório de Produtos</td>
                <td>Performance de produtos</td>
                <td>01/05/2025 - 31/05/2025</td>
                <td>31/05/2025 08:00</td>
                <td>Administrador</td>
                <td>Excel</td>

                <td>
                  <button className="btn-acao">
                    ↓
                  </button>
                </td>
              </tr>

              <tr>
                <td>Relatório Financeiro</td>
                <td>Resumo financeiro e fluxo de caixa</td>
                <td>01/05/2025 - 31/05/2025</td>
                <td>31/05/2025 07:45</td>
                <td>Administrador</td>
                <td>PDF</td>

                <td>
                  <button className="btn-acao">
                    ↓
                  </button>
                </td>
              </tr>

            </tbody>

          </table>

          <p className="paginacao">
            Mostrando 1 a 5 de 10 relatórios
          </p>

        </div>

        <Rodape />

      </main>

    </div>
  )
}

export default Relatorio