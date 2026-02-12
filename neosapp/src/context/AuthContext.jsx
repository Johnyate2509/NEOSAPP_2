import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

// Datos de prueba - Administrador
const ADMIN_DATA = {
  usuario: "NEOSAPP",
  cedula: "123456789"
};

export function AuthProvider({ children }) {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null); // "admin" o "cliente"

  /**
   * Realiza el login del usuario
   * @param {string} usuario - Nombre de usuario o razón social
   * @param {string} cedula - Cédula o NIT (contraseña)
   * @returns {object} {success: boolean, mensaje: string, tipoUsuario: string}
   */
  const login = (usuario, cedula) => {
    if (!usuario || !cedula) {
      return { success: false, mensaje: "Usuario y contraseña son requeridos" };
    }

    // Verificar si es administrador
    if (usuario === ADMIN_DATA.usuario && cedula === ADMIN_DATA.cedula) {
      setUsuarioAutenticado(usuario);
      setTipoUsuario("admin");
      return { 
        success: true, 
        mensaje: "Bienvenido Administrador",
        tipoUsuario: "admin"
      };
    }

    // Si no es admin, es cliente (permite cualquier usuario/contraseña válidos)
    if (usuario.trim() && cedula.trim()) {
      setUsuarioAutenticado(usuario);
      setTipoUsuario("cliente");
      return { 
        success: true, 
        mensaje: `Bienvenido ${usuario}`,
        tipoUsuario: "cliente"
      };
    }

    return { success: false, mensaje: "Credenciales inválidas" };
  };

  /**
   * Realiza el logout del usuario
   */
  const logout = () => {
    setUsuarioAutenticado(null);
    setTipoUsuario(null);
  };

  /**
   * Verifica si el usuario actual es administrador
   * @returns {boolean}
   */
  const esAdmin = () => tipoUsuario === "admin";

  /**
   * Obtiene el usuario actual
   * @returns {string|null}
   */
  const obtenerUsuario = () => usuarioAutenticado;

  return (
    <AuthContext.Provider
      value={{
        usuarioAutenticado,
        tipoUsuario,
        login,
        logout,
        esAdmin,
        obtenerUsuario
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
