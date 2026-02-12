import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [usuario, setUsuario] = useState("");
  const [cedula, setCedula] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    // Simular un pequeño delay
    setTimeout(() => {
      const resultado = login(usuario, cedula);

      if (resultado.success) {
        setCargando(false);
        navigate("/");
      } else {
        setError(resultado.mensaje);
        setCargando(false);
      }
    }, 500);
  };

  const handleDemoAdmin = () => {
    setCargando(true);
    setTimeout(() => {
      const resultado = login("NEOSAPP", "123456789");
      if (resultado.success) {
        setCargando(false);
        navigate("/");
      }
    }, 500);
  };

  const handleDemoCliente = () => {
    setCargando(true);
    setTimeout(() => {
      const resultado = login("Juan Pérez", "9876543210");
      if (resultado.success) {
        setCargando(false);
        navigate("/");
      }
    }, 500);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>NEOSAPP</h1>
          <p>Sistema de Gestión de Ventas</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="usuario">Usuario / Razón Social</label>
            <input
              id="usuario"
              type="text"
              placeholder="Ej: NEOSAPP"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              disabled={cargando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cedula">Contraseña (Cédula / NIT)</label>
            <input
              id="cedula"
              type="password"
              placeholder="Ej: 123456789"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              disabled={cargando}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="btn-login"
            disabled={cargando}
          >
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="divider">
          <span>Demo de prueba</span>
        </div>

        <div className="demo-buttons">
          <button
            type="button"
            className="btn-demo-admin"
            onClick={handleDemoAdmin}
            disabled={cargando}
          >
            👨‍💼 Admin Demo
          </button>
          <button
            type="button"
            className="btn-demo-cliente"
            onClick={handleDemoCliente}
            disabled={cargando}
          >
            👤 Cliente Demo
          </button>
        </div>

        <div className="login-info">
          <p>📌 <strong>Admin:</strong> Usuario: NEOSAPP | Contraseña: 123456789</p>
          <p>📌 <strong>Cliente:</strong> Ingresa cualquier usuario y contraseña</p>
        </div>
      </div>
    </div>
  );
}
