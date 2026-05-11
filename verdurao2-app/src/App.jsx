import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Configuracoes from './pages/Configuracoes'
import Estoque from './pages/Estoque'
import Relatorio from './pages/Relatorio'
import Vendas from './pages/Vendas'

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="/configuracoes"
          element={<Configuracoes />}
        />
        <Route
          path="/estoque"
          element={<Estoque />}
        />
        <Route
          path="/relatorio"
          element={<Relatorio />}
        />
        <Route
          path="/vendas"
          element={<Vendas />}
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App