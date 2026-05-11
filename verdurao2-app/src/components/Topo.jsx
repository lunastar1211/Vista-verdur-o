import menuIcon from '../assets/icons/menu.svg'
import lupaIcon from '../assets/icons/lupa.svg'
import notificIcon from '../assets/icons/notific.svg'
import setaIcon from '../assets/icons/seta.svg'

import avatar from '../assets/img/logo.jpg'

function Topo() {
  return (
    <header className="topo">

      <div className="busca-container">

        <button className="btn-menu" id="menuToggle">
          <img src={menuIcon} alt="Menu" />
        </button>

        <div className="campo-busca-wrapper">

          <img
            src={lupaIcon}
            alt="Buscar"
            className="lupa-icon"
          />

          <input
            type="text"
            placeholder="Buscar por produtos, clientes, pedidos..."
            className="campo-busca"
          />

        </div>

      </div>

      <div className="info-usuario">

        <button className="btn-notificacao">
          <img src={notificIcon} alt="Notificações" />
        </button>

        <div className="usuario-detalhes">

          <img
            src={avatar}
            className="avatar"
            alt="admin"
          />

          <div className="usuario-texto">
            <span className="nome-admin">
              Administrador
            </span>

            <span className="status-online">
              ● Online
            </span>
          </div>

        </div>

        <button className="btn-seta">
          <img src={setaIcon} alt="Opções" />
        </button>

      </div>

    </header>
  )
}

export default Topo