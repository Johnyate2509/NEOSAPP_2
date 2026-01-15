import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Pedidos from "./pages/Pedidos";
import Repartidores from "./pages/Repartidores";
import Mapa from "./pages/Mapa";
import "./styles/global.css";
import "./styles/variables.css";
import Productos from "./pages/Producto";


export default function App() {
  return (
    <div className="app">
      <Sidebar />

      <div className="main">
        <Header />

        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/repartidores" element={<Repartidores />} />
            <Route path="/mapa" element={<Mapa />} />
            <Route path="/productos" element={<Productos />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
