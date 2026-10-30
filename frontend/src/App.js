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
import Login from "./components/Admin/Login/Login";
import isAuth from "./services/Auth";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// O painel só é baixado por quem entra nele, não por todo visitante. O login
// é pequeno e fica no pacote, para a tela dele não pular ao abrir.
const Admin = lazy(() => import("./components/Admin/Admin"));

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

// Mensagem de erro fica na tela até a pessoa fechar; as de sucesso somem sozinhas.
const avisoDeErro = toast.error;
toast.error = (mensagem, opcoes) =>
  avisoDeErro(mensagem, { autoClose: false, ...opcoes });

const AdminRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth() ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/login" }} />
        )
      }
    />
  );
};

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Router>
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
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/sobre" component={About} />
              <Route path="/documentos" exact component={Documents} />
              <Route path="/inscricoes" exact component={Subscription} />
              <Route path="/projetos" exact component={Projects} />
              <Route path="/projetos/:projeto" exact component={ProjetoPagina} />
              <Route path="/login" exact component={Login} />
              <Route path="/contato" exact component={Contact} />
              <AdminRoute path="/admin" exact component={Admin} />
              <Redirect from="/subscription" to="/inscricoes" />
              <Route component={NaoEncontrada} />
            </Switch>
          </Suspense>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
