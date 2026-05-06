import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./login.css";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("cliente");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setExito("");
    setCargando(true);

    // Validar campos
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Todos los campos son requeridos");
      setCargando(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setCargando(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setCargando(false);
      return;
    }

    try {
      const result = await register(email, password, role);

      if (!result.success) {
        setError(result.error);
        setCargando(false);
        return;
      }

      setExito("¡Cuenta creada exitosamente! Revisa tu email para confirmar la cuenta. Redirigiendo al login...");
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (err) {
      setError("Error al procesar el registro: " + err.message);
    }

    setCargando(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>NEOSAPP</h1>
          <p>Crear Nueva Cuenta</p>
        </div>

        <form onSubmit={handleRegister} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Ej: usuario@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={cargando}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={cargando}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={cargando}
              required
            />
          </div>

          <div className="form-group">
            <label>Tipo de Usuario</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={cargando}
            >
              <option value="cliente">Cliente</option>
              <option value="vendedor">Vendedor</option>
              <option value="repartidor">Repartidor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}
          {exito && <div className="success-message">{exito}</div>}

          <button type="submit" className="btn-login" disabled={cargando}>
            {cargando ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p style={{ color: "#aaa", fontSize: "14px" }}>
            ¿Ya tienes cuenta?{" "}
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "none",
                border: "none",
                color: "#c8a951",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "14px",
              }}
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
