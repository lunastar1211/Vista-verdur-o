import logo from '../assets/img/logo.jpg'

import dashboardIcon from '../assets/icons/dashboard.svg'
import vendasIcon from '../assets/icons/vendas.svg'
import estoqueIcon from '../assets/icons/estoque.svg'
import relatorioIcon from '../assets/icons/relatorio.svg'
import configIcon from '../assets/icons/config.svg'

import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="logo-sidebar">
        <img src={logo} alt="V" />
        <span>VERDURÃO</span>
      </div>

      <nav>

        <Link to="/dashboard">
          <img src={dashboardIcon} className="nav-icon" alt="" />
          Dashboard
        </Link>

        <Link to="/vendas">
          <img src={vendasIcon} className="nav-icon" alt="" />
          Vendas
        </Link>

        <Link to="/estoque">
          <img src={estoqueIcon} className="nav-icon" alt="" />
          Estoque
        </Link>

        <Link to="/relatorio">
          <img src={relatorioIcon} className="nav-icon" alt="" />
          Relatório
        </Link>

        <Link to="/configuracoes">
          <img src={configIcon} className="nav-icon" alt="" />
          Configurações
        </Link>

      </nav>

    </aside>
  )
}

export default Sidebar