import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function UsuariosList() {
  const { user } = useAuth(); // mostrará nombre/rol si quieres
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");

  const cargar = async () => {
    try {
      const { data } = await api.get("/usuarios");
      setUsuarios(data);
    } catch (err) {
      setError(err?.response?.data?.error || "Error al cargar usuarios");
    }
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      await api.delete(`/usuarios/${id}`);
      cargar();
    } catch (err) {
      alert(err?.response?.data?.error || "No se pudo eliminar");
    }
  };

  useEffect(() => { cargar(); }, []);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <Link
          to="/usuarios/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Nuevo usuario
        </Link>
      </div>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Correo</th>
              <th className="p-2 text-left">Rol</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.id}</td>
                <td className="p-2">{u.nombre}</td>
                <td className="p-2">{u.correo}</td>
                <td className="p-2">{u.rol}</td>
                <td className="p-2 text-center">
                  {/* Si luego agregas edición: <Link to={`/usuarios/editar/${u.id}`} className="text-blue-600 mr-3">Editar</Link> */}
                  <button
                    onClick={() => eliminar(u.id)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={5}>
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
