import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../api/client";

export default function PacientesList() {
  const [pacientes, setPacientes] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const cargarPacientes = async () => {
    try {
      const res = await api.get("/pacientes");
      setPacientes(res.data);
    } catch (err) {
      setError("Error al cargar pacientes");
    }
  };

  const eliminar = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este paciente?")) return;
    try {
      await api.delete(`/pacientes/${id}`);
      cargarPacientes();
    } catch {
      alert("Error al eliminar");
    }
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Pacientes</h1>

        {(user?.rol === "ADMIN" || user?.rol === "MEDICO") && (
          <Link
            to="/pacientes/nuevo"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Nuevo Paciente
          </Link>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Apellido</th>
            <th className="p-2">Edad</th>
            <th className="p-2">Sexo</th>
            <th className="p-2">Salud</th>
            {(user?.rol === "ADMIN" || user?.rol === "MEDICO") && (
              <th className="p-2">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {pacientes.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2 text-center">{p.id}</td>
              <td className="p-2">{p.nombre}</td>
              <td className="p-2">{p.apellido}</td>
              <td className="p-2 text-center">{p.edad}</td>
              <td className="p-2 text-center">{p.sexo}</td>
              <td className="p-2">{p.estadoSalud}</td>

              {(user?.rol === "ADMIN" || user?.rol === "MEDICO") && (
                <td className="p-2 flex gap-2 justify-center">
                  <Link
                    to={`/pacientes/editar/${p.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </Link>

                  {user?.rol === "ADMIN" && (
                    <button
                      onClick={() => eliminar(p.id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {pacientes.length === 0 && (
        <p className="text-gray-500 mt-4 text-center">
          No hay pacientes registrados
        </p>
      )}
    </div>
  );
}
