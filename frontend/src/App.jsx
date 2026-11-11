import React, { Suspense, lazy, useEffect, useRef } from "react";
import "./App.css";
import Footer from "./components/Footer/Footer";
import About from "./components/About/About";
import Subscription from "./components/Subscription/Subscription";
import Projects from "./components/Projects/Projects";
import ProjetoPagina from "./components/Projects/ProjetoPagina/ProjetoPagina";
import Contact from "./components/Contact/Contact";
import Documents from "./components/Documents/Documents";
import Home from "./components/Home/Home";
import Nav from "./components/Navbar/Nav";
import NaoEncontrada from "./components/NaoEncontrada/NaoEncontrada";
import Loader from "./components/Loader/Loader";
import Login from "./components/Login/Login";
import isAuth from "./services/Auth";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// O painel só é baixado por quem entra nele, não por todo visitante. O login
// é pequeno e fica no pacote, para a tela dele não pular ao abrir.
const Painel = lazy(() => import("./components/Painel/Painel"));

// Ao trocar de página, o foco vai para o conteúdo novo: sem isso ele ficava
// no link clicado (ou no body), e o leitor de tela não anunciava a página.
const FocoNaTroca = () => {
  const { pathname } = useLocation();
  const primeira = useRef(true);
  useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    document.querySelector("main").focus({ preventScroll: true });
  }, [pathname]);
  return null;
};

// O painel só para quem entrou; os outros vão ao login.
const SoLogado = ({ children }) =>
  isAuth() ? children : <Navigate to="/login" replace />;

// O site sem o roteador: no navegador ele vai dentro do BrowserRouter
// (main.jsx); no build, dentro do StaticRouter, para gerar o HTML de cada
// página já com o texto (entry-server.jsx).
function App() {
  return (
    <div className="App">
      <Nav />
      <FocoNaTroca />
      {/* Leitor de tela usa o <main> para pular direto ao conteúdo. */}
      <main className="conteudo" tabIndex={-1}>
        <Suspense
          fallback={
            <div className="divloader">
              <Loader />
            </div>
          }
        >
          {/* Rota exata e com maiúscula diferente: o React reconhece só os
              endereços que o servidor serve (os outros recebem o 404.html),
              senão a página "não encontrada" chegava e era trocada por outra.
              O /subscription antigo o servidor redireciona (serve.json). */}
          <Routes>
            <Route path="/" caseSensitive element={<Home />} />
            <Route path="/sobre" caseSensitive element={<About />} />
            <Route path="/documentos" caseSensitive element={<Documents />} />
            <Route path="/inscricoes" caseSensitive element={<Subscription />} />
            <Route path="/projetos" caseSensitive element={<Projects />} />
            <Route path="/projetos/:projeto" caseSensitive element={<ProjetoPagina />} />
            <Route path="/login" caseSensitive element={<Login />} />
            <Route path="/contato" caseSensitive element={<Contact />} />
            <Route path="/admin/*" caseSensitive element={<SoLogado><Painel /></SoLogado>} />
            <Route path="*" element={<NaoEncontrada />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
