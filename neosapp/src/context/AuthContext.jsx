import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

// Datos de prueba - Administrador
const ADMIN_DATA = {
  usuario: "NEOSAPP",
  cedula: "123456789"
};

// Datos de prueba - Repartidores
const REPARTIDORES_DATA = [
  { id: 1, usuario: "Carlos", cedula: "9876543210", nombre: "Carlos Rodríguez", zona: "Norte" },
  { id: 2, usuario: "David", cedula: "1122334455", nombre: "David García", zona: "Sur" },
  { id: 3, usuario: "Elena", cedula: "5544332211", nombre: "Elena Martínez", zona: "Oriente" }
];

// Datos de prueba - Vendedores
const VENDEDORES_DATA = [
  { id: 1, usuario: "vendedor1", cedula: "1111111111", nombre: "Carlos Rodríguez", zona: "Norte", clientesIds: [1] },
  { id: 2, usuario: "vendedor2", cedula: "2222222222", nombre: "María López", zona: "Sur", clientesIds: [2] },
  { id: 3, usuario: "vendedor3", cedula: "3333333333", nombre: "Juan Martínez", zona: "Oriente", clientesIds: [] },
  { id: 4, usuario: "vendedor4", cedula: "4444444444", nombre: "Sandra García", zona: "Occidente", clientesIds: [] }
];

export function AuthProvider({ children }) {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null); // "admin", "cliente", "repartidor" o "vendedor"
  const [usuarioData, setUsuarioData] = useState(null); // Datos adicionales del usuario autenticado

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
      setUsuarioData({ usuario });
      return { 
        success: true, 
        mensaje: "Bienvenido Administrador",
        tipoUsuario: "admin"
      };
    }

    // Verificar si es repartidor
    const repartidor = REPARTIDORES_DATA.find(r => r.usuario === usuario && r.cedula === cedula);
    if (repartidor) {
      setUsuarioAutenticado(usuario);
      setTipoUsuario("repartidor");
      setUsuarioData({ 
        id: repartidor.id,
        usuario: repartidor.usuario,
        nombre: repartidor.nombre,
        zona: repartidor.zona 
      });
      return { 
        success: true, 
        mensaje: `Bienvenido ${repartidor.nombre}`,
        tipoUsuario: "repartidor"
      };
    }

    // Verificar si es vendedor
    const vendedor = VENDEDORES_DATA.find(v => v.usuario === usuario && v.cedula === cedula);
    if (vendedor) {
      setUsuarioAutenticado(usuario);
      setTipoUsuario("vendedor");
      setUsuarioData({ 
        id: vendedor.id,
        usuario: vendedor.usuario,
        nombre: vendedor.nombre,
        zona: vendedor.zona,
        clientesIds: vendedor.clientesIds
      });
      return { 
        success: true, 
        mensaje: `Bienvenido ${vendedor.nombre}`,
        tipoUsuario: "vendedor"
      };
    }

    // Si no es admin, repartidor ni vendedor, es cliente (permite cualquier usuario/contraseña válidos)
    if (usuario.trim() && cedula.trim()) {
      setUsuarioAutenticado(usuario);
      setTipoUsuario("cliente");
      setUsuarioData({ usuario });
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
    setUsuarioData(null);
  };

  /**
   * Verifica si el usuario actual es administrador
   * @returns {boolean}
   */
  const esAdmin = () => tipoUsuario === "admin";

  /**
   * Verifica si el usuario actual es repartidor
   * @returns {boolean}
   */
  const esRepartidor = () => tipoUsuario === "repartidor";

  /**
   * Verifica si el usuario actual es vendedor
   * @returns {boolean}
   */
  const esVendedor = () => tipoUsuario === "vendedor";

  /**
   * Obtiene el usuario actual
   * @returns {string|null}
   */
  const obtenerUsuario = () => usuarioAutenticado;

  /**
   * Obtiene los datos adicionales del usuario (nombre, zona, etc)
   * @returns {object|null}
   */
  const obtenerDatosUsuario = () => usuarioData;

  return (
    <AuthContext.Provider
      value={{
        usuarioAutenticado,
        tipoUsuario,
        login,
        logout,
        esAdmin,
        esRepartidor,
        esVendedor,
        obtenerUsuario,
        obtenerDatosUsuario
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
