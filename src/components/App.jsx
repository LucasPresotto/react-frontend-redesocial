import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import BootstrapTest from "./BootstrapTest"
import Contador from "./Contador"
import Feed from "./Feed"
import FeedFiltravel from "./FeedFiltravel"
import NovoPost from "./NovoPost"
import Perfil from "./Perfil"
import Saudacao from "./Saudacao"

// src/App.jsx
const App = () => {
  return (
    <>
      <Perfil nome="Ester" bio="Apoixonada por React"/>
      <Saudacao nome="Ester" />
      <Contador />
      <Feed />
      <NovoPost />
      <FeedFiltravel />
      <BootstrapTest />
      
    </>
  )
}
export default App