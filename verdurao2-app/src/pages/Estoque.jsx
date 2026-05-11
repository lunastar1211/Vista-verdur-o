import '../styles/style.css'

import Sidebar from '../components/Sidebar'
import Topo from '../components/Topo'
import Rodape from '../components/Rodape'

function Estoque() {

  return (
    <div className="layout">

      <Sidebar />

      <main className="conteudo-principal">

        <Topo />

        {/* KPIs Estoque */}
        <div className="kpi-estoque">

          <div className="kpi">
            <p>Valor Total em Estoque</p>
            <h3>R$ 248.750,30</h3>
            <span className="positivo">
              ▲ 8,5% vs último mês
            </span>
          </div>

          <div className="kpi">
            <p>Produtos Cadastrados</p>
            <h3>5</h3>
            <span>— 0,0%</span>
          </div>

          <div className="kpi">
            <p>Itens em Estoque</p>
            <h3>2.341</h3>
            <span>▲ 5,2%</span>
          </div>

          <div className="kpi">
            <p>Itens com Estoque Baixo</p>

            <h3 className="texto-vermelho">
              23
            </h3>

            <span className="negativo">
              ▲ 15,0%
            </span>
          </div>

        </div>

        {/* Gráfico */}
        <div className="card">

          <h4>
            Nível de Estoque (Quantidade de Itens)
          </h4>

          <div className="simulador-linha">
            3.000 2.500 2.000 1.500 1.000 500 0
          </div>

          <div className="datas-estoque">
            01/05 06/05 11/05 16/05 21/05 26/05 31/05
          </div>

        </div>

        {/* Categorias e status */}
        <div className="estoque-categoria-status">

          <div className="card categoria-valor">

            <h4>Estoque por Categoria</h4>

            <ul>
              <li>Camisetas: 40%</li>
              <li>Calças: 25%</li>
              <li>Tênis: 20%</li>
              <li>Bonés: 10%</li>
              <li>Shirts: 5%</li>
            </ul>

          </div>

          <div className="card status-geral">

            <h4>Status do Estoque</h4>

            <p>
              <span>Normal:</span> 133 itens
            </p>

            <p>
              <span>Atenção:</span> 18 itens
            </p>

            <p>
              <span>Crítico:</span> 5 itens
            </p>

          </div>

        </div>

        {/* Tabela */}
        <div className="card-tabela">

          <h4>
            Produtos com Estoque Crítico/Atenção
          </h4>

          <table className="tabela-estoque-baixo">

            <thead>

              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Estoque Atual</th>
                <th>Estoque Mínimo</th>
                <th>Status</th>
                <th>Valor Unitário</th>
                <th>Valor Total</th>
              </tr>

            </thead>

            <tbody>

              <tr>
                <td>Camiseta Oversized Preta</td>
                <td>Camisetas</td>
                <td>8 unid.</td>
                <td>20 unid.</td>

                <td className="status-critico">
                  Crítico
                </td>

                <td>R$ 59,90</td>
                <td>R$ 479,20</td>
              </tr>

              <tr>
                <td>Shot Vista Verdurão</td>
                <td>Shirts</td>
                <td>15 unid.</td>
                <td>30 unid.</td>

                <td className="status-atencao">
                  Atenção
                </td>

                <td>R$ 14,90</td>
                <td>R$ 223,50</td>
              </tr>

              <tr>
                <td>Calça Cargo Bege</td>
                <td>Calças</td>
                <td>10 unid.</td>
                <td>25 unid.</td>

                <td className="status-atencao">
                  Atenção
                </td>

                <td>R$ 129,90</td>
                <td>R$ 1.299,00</td>
              </tr>

              <tr>
                <td>Tênis Street Preto</td>
                <td>Tênis</td>
                <td>5 pares</td>
                <td>15 pares</td>

                <td className="status-critico">
                  Crítico
                </td>

                <td>R$ 299,90</td>
                <td>R$ 1.499,50</td>
              </tr>

              <tr>
                <td>Boné Logo Bordado</td>
                <td>Boné</td>
                <td>12 unid.</td>
                <td>25 unid.</td>

                <td className="status-atencao">
                  Atenção
                </td>

                <td>R$ 49,90</td>
                <td>R$ 598,80</td>
              </tr>

            </tbody>

          </table>

        </div>

        <Rodape />

      </main>

    </div>
  )
}

export default Estoque