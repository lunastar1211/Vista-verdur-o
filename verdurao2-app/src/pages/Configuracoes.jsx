import '../styles/style.css'

import Sidebar from '../components/Sidebar'
import Topo from '../components/Topo'
import Rodape from '../components/Rodape'

import { useNavigate } from 'react-router-dom'

function Configuracoes() {

  const navigate = useNavigate()

  function sairSistema() {
    navigate('/')
  }

  return (
    <div className="layout">

      <Sidebar />

      <main className="conteudo-principal">

        <Topo />

        <div className="config-wrapper">

          <div className="config-container">

            <div className="perfil-admin">

              <h2>Administrador</h2>

              <p className="email-admin">
                admin@vistaverdurao.com
              </p>

              <button
                className="botao-sair"
                onClick={sairSistema}
              >
                Sair do sistema →
              </button>

            </div>

            <div className="opcoes-gerais">

              <h3>Preferências</h3>

              <label>
                <input type="checkbox" />
                {' '}
                Notificações por email
              </label>

              <label>
                <input type="checkbox" />
                {' '}
                Modo escuro
              </label>

              <button className="salvar-config">
                Salvar alterações
              </button>

            </div>

          </div>

        </div>

        <Rodape />

      </main>

    </div>
  )
}

export default Configuracoes