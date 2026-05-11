import '../styles/style.css'

import Sidebar from '../components/Sidebar'
import Topo from '../components/Topo'
import Rodape from '../components/Rodape'

function Vendas() {

  return (
    <div className="layout">

      <Sidebar />

      <main className="conteudo-principal">

        <Topo />

        <h2 className="titulo-pagina">
          Evolução das Vendas
        </h2>

        {/* Gráfico */}
        <div className="grafico-linha">

          <div className="barras-simuladas">
            <span>R$ 20 mil</span>
            <span>R$ 15 mil</span>
            <span>R$ 10 mil</span>
            <span>R$ 5 mil</span>
            <span>R$ 0</span>
          </div>

          <div className="datas">
            01/05 06/05 11/05 16/05 21/05 26/05 31/05
          </div>

        </div>

        {/* Painéis */}
        <div className="dois-paineis">

          <div className="card-categoria">

            <h3>Vendas por Categoria</h3>

            <ul>

              <li>
                <span>Hortaliças</span>
                <span>45%</span>
              </li>

              <li>
                <span>Frutas</span>
                <span>25%</span>
              </li>

              <li>
                <span>Folhagens</span>
                <span>15%</span>
              </li>

              <li>
                <span>Temperos</span>
                <span>10%</span>
              </li>

              <li>
                <span>Outros</span>
                <span>5%</span>
              </li>

            </ul>

          </div>

          <div className="card-canal">

            <h3>Vendas por Canal</h3>

            <div className="barras-canal">
              <span>R$ 80 mil</span>
              <span>R$ 60 mil</span>
              <span>R$ 40 mil</span>
              <span>R$ 20 mil</span>
              <span>R$ 0</span>
            </div>

            <div className="canais">
              Loja Física | Site | WhatsApp |
              Marketplace | Outros
            </div>

          </div>

        </div>

        <Rodape />

      </main>

    </div>
  )
}

export default Vendas