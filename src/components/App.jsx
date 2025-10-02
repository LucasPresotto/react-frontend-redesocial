import BootstrapTest from "./BootstrapTest"
import Contador from "./Contador"
import Feed from "./Feed"
import FeedFiltravel from "./FeedFiltravel"
import NovoPost from "./NovoPost"
import Perfil from "./Perfil"
import Saudacao from "./Saudacao"
import { useState } from "react";
import Sobre from "/src/pages/Sobre";
import Contato from "/src/pages/Contato";

// src/App.jsx
const PaginaHome = () => (
    <>
      <Perfil nome="Ester" bio="Apaixonada por React"/>
      <hr/>
      <Saudacao nome="Ester" />
      <hr/>
      <Contador />
      <hr/>
      <Feed />
      <hr/>
      <NovoPost />
      <hr/>
      <FeedFiltravel />
      <hr/>
      <BootstrapTest />
    </>
);

const App = () => {
  const [pagina, setPagina] = useState('home');

  const renderizarPagina = () => {
    if (pagina === 'sobre') {
      return <Sobre />;
    }
    if (pagina === 'contato') {
      return <Contato />;
    }
    return <PaginaHome />;
  }

  return (
    <>
      <nav>
        <button onClick={() => setPagina('home')}>Home</button>
        <button onClick={() => setPagina('sobre')}>Sobre</button>
        <button onClick={() => setPagina('contato')}>Contato</button>
      </nav>
      <hr/>
      {renderizarPagina()}
    </>
  )
}
export default App