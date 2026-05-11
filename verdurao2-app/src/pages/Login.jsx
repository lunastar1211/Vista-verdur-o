import '../styles/style.css'

import logo from '../assets/img/logo.jpg'
import catedral from '../assets/img/catedral.jpg'
import fundoLogin from '../assets/img/fundologin.jpg'
import googleIcon from '../assets/icons/google.png'

import { useNavigate } from 'react-router-dom'

function Login() {

  const navigate = useNavigate()

  function handleLogin(e) {
    e.preventDefault()

    navigate('/dashboard')
  }

  return (
    <div className="pagina-login">

      <div className="container-login">

        {/* Lado esquerdo */}
        <div
          className="lado-esquerdo"
          style={{
          backgroundImage: `url(${catedral})`
          }}
        >

          <div className="conteudo-esquerdo">

            <div className="logo-titulo">
              {/*
              <img
                src={logo}
                alt="Logo"
                className="logo-login"
              />
              */}

              <h1>Vista Verdurão</h1>
            </div>

            <div className="texto-slogan">
              <p className="slogan">
                Dados frescos, Decisões inteligentes.
              </p>

              <p className="subtitulo">
                Acompanhe seu negócio com clareza e eficiência
              </p>
            </div>

          </div>
        </div>

        {/* Lado direito */}
        <div
          className="lado-direito"
          style={{
            //backgroundImage: `url(${fundoLogin})`
          }}
        >

          <div className="formulario-login">

            <h2>Bem-vindo(a)!</h2>

            <p>
              Faça login para acessar sua conta
            </p>

            <form onSubmit={handleLogin}>

              <label htmlFor="email">
                Email
              </label>

              <input
                type="email"
                id="email"
                placeholder="seu@email.com"
                required
                defaultValue="admin@vistaverdurao.com"
              />

              <label htmlFor="senha">
                Senha
              </label>

              <input
                type="password"
                id="senha"
                placeholder="***********"
                required
              />

              <a href="#" className="link-esqueci">
                Esqueci minha senha
              </a>

              <button
                type="submit"
                className="botao-entrar"
              >
                Entrar
              </button>

              <div className="divisor">
                OU
              </div>

              <button
                type="button"
                className="botao-google"
              >

                <img
                  src={googleIcon}
                  alt="Google"
                  className="google-icon"
                />

                Entrar com Google

              </button>

            </form>

          </div>
        </div>

      </div>

    </div>
  )
}

export default Login