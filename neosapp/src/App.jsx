import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pedidos from "./pages/Pedidos";
import Repartidores from "./pages/Repartidores";
import Vendedores from "./pages/Vendedores";
import Mapa from "./pages/Mapa";
import Clientes from "./pages/Clientes";
import AdminClientes from "./pages/AdminClientes";
import "./styles/global.css";
import "./styles/variables.css";
import Productos from "./pages/Producto";


export default function App() {
  const { usuarioAutenticado } = useAuth();

  // Si no está autenticado, mostrar login
  if (!usuarioAutenticado) {
    return <Login />;
  }

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
            <Route path="/vendedores" element={<Vendedores />} />
            <Route path="/mapa" element={<Mapa />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/admin-clientes" element={<AdminClientes />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
