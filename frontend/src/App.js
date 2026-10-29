import React from "react";
import "./App.css";
import Footer from "./components/Footer/Footer";
import About from "./components/About/About";
import Subscription from "./components/Subscription/Subscription";
import Projects from "./components/Projects/Projects";
import Contact from "./components/Contact/Contact";
import Admin from "./components/Admin/Admin";
import Documents from "./components/Documents/Documents";
import Home from "./components/Home/Home";
import Nav from "./components/Navbar/Nav";
import NaoEncontrada from "./components/NaoEncontrada/NaoEncontrada";
import isAuth from "./services/Auth";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Login from "./components/Admin/Login/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/sobre" component={About} />
          <Route path="/documentos" exact component={Documents} />
          <Route path="/inscricoes" exact component={Subscription} />
          <Route path="/projetos" exact component={Projects} />
          <Route path="/login" exact component={Login} />
          <Route path="/contato" exact component={Contact} />
          <AdminRoute path="/admin" exact component={Admin} />
          <Redirect from="/subscription" to="/inscricoes" />
          <Route component={NaoEncontrada} />
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
