import '../styles/style.css'

import Sidebar from '../components/Sidebar'
import Topo from '../components/Topo'
import Rodape from '../components/Rodape'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi, useMutation } from '../hooks/useApi'
import { getUsuarios, updateUsuario } from '../services/configuracoes'

function Configuracoes() {
  const navigate  = useNavigate()
  const { data: usuarios, loading, error } = useApi(getUsuarios)

  // Pega o primeiro admin — trocar por ID real quando o login estiver pronto
  const usuario = usuarios?.find(u => u.tipo === 'admin') ?? usuarios?.[0] ?? null

  const [notificacoes, setNotificacoes] = useState(false)
  const [modoEscuro,   setModoEscuro]   = useState(false)
  const [salvo,        setSalvo]        = useState(false)

  const { mutate: salvar, loading: salvando } = useMutation(
    (dados) => updateUsuario(usuario.id_usuario, dados)
  )

  async function handleSalvar() {
    if (!usuario) return
    try {
      await salvar({ nome: usuario.nome, email: usuario.email, tipo: usuario.tipo, ativo: usuario.ativo })
      setSalvo(true)
      setTimeout(() => setSalvo(false), 3000)
    } catch (e) {
      alert('Erro ao salvar: ' + e.message)
    }
  }

  function sairSistema() {
    navigate('/')
  }

  return (
    <div className="layout">

      <Sidebar />

      <main className="conteudo-principal">

        <Topo />

        {loading && <p style={{ padding: '1rem' }}>Carregando configurações...</p>}
        {error   && <p style={{ padding: '1rem', color: 'red' }}>Erro: {error}</p>}

        <div className="config-wrapper">
          <div className="config-container">

            <div className="perfil-admin">
              <h2>{usuario?.nome ?? '—'}</h2>
              <p className="email-admin">{usuario?.email ?? '—'}</p>
              <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>
                Perfil: {usuario?.tipo ?? '—'} · {usuario?.ativo ? 'Ativo' : 'Inativo'}
              </p>
              <button className="botao-sair" onClick={sairSistema}>
                Sair do sistema →
              </button>
            </div>

            <div className="opcoes-gerais">
              <h3>Preferências</h3>

              <label>
                <input
                  type="checkbox"
                  checked={notificacoes}
                  onChange={e => setNotificacoes(e.target.checked)}
                />
                {' '}Notificações por email
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={modoEscuro}
                  onChange={e => setModoEscuro(e.target.checked)}
                />
                {' '}Modo escuro
              </label>

              <button
                className="salvar-config"
                onClick={handleSalvar}
                disabled={salvando || !usuario}
              >
                {salvando ? 'Salvando...' : salvo ? '✓ Salvo!' : 'Salvar alterações'}
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