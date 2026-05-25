import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { supabase } from "../context/supabaseClient";
import "./login.css";

export default function Register() {
  const navigate = useNavigate();
  const { crearCliente } = useStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setExito("");
    setCargando(true);

    // Validar campos
    if (!email.trim() || !password.trim() || !confirmPassword.trim() || !nombre.trim() || !cedula.trim() || !direccion.trim()) {
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
      // Usar crearCliente que maneja: Auth, usuarios table y clientes table
      const resultado = await crearCliente(
        nombre,
        cedula,
        direccion,
        telefono,
        email,  // correo
        null,   // vendedor_id
        password
      );

      if (resultado.error) {
        setError(resultado.error);
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
    <div className="login-container register-container">
      <div className="login-box register-box">
        <div className="login-header">
          <h1>NEOSAPP</h1>
          <p>Crear Nueva Cuenta</p>
        </div>

        <form onSubmit={handleRegister} className="login-form register-form">
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
            <label>Nombre Completo</label>
            <input
              type="text"
              placeholder="Tu nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={cargando}
              required
            />
          </div>

          <div className="form-group">
            <label>Cédula</label>
            <input
              type="text"
              placeholder="Número de cédula"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              disabled={cargando}
              required
            />
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              placeholder="Tu dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              disabled={cargando}
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              placeholder="Número de teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              disabled={cargando}
            />
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
