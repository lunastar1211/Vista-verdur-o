import '../styles/style.css'

import Sidebar from '../components/Sidebar'
import Topo from '../components/Topo'
import Rodape from '../components/Rodape'

function Dashboard() {

  return (
    <div className="layout">

      <Sidebar />

      <main className="conteudo-principal">

        <Topo />

        <section className="resumo-cards">

          <div className="card">
            <p>Receita Total</p>
            <h3>R$ 128.450,00</h3>
            <span>↑ 18,6% vs últimos 30 dias</span>
          </div>

          <div className="card">
            <p>Vendas</p>
            <h3>1.245</h3>
            <span>↑ 12,4%</span>
          </div>

          <div className="card">
            <p>Ticket Médio</p>
            <h3>R$ 103,22</h3>
            <span>↑ 7,2%</span>
          </div>

          <div className="card">
            <p>Lucro Líquido</p>
            <h3>R$ 28.650,00</h3>
            <span>↑ 15,8%</span>
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
                <th>Produtos</th>
                <th>Total</th>
                <th>Status</th>
                <th>Canal</th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td>#V250531-001</td>
                <td>João Silva</td>
                <td>31/05/2025 10:23</td>
                <td>5 itens</td>
                <td>R$ 185,50</td>
                <td className="status-concluido">
                  Concluído
                </td>
                <td>Loja Física</td>
              </tr>

            </tbody>

          </table>

        </section>

        <Rodape />

      </main>

    </div>
  )
}

export default Dashboard