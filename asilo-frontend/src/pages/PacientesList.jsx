import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../api/client";

export default function PacientesList() {
  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const cerrarSesion = () => {
    logout();
    navigate("/login");
  };

  const cargarPacientes = async () => {
    try {
      const res = await api.get("/pacientes");
      setPacientes(res.data);
    } catch {
      setError("Error al cargar pacientes");
    }
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  const filtrar = pacientes.filter((p) =>
    [p.nombre, p.apellido, p.id.toString()]
      .join(" ")
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-200 p-6 animate-fadeIn">

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-8 bg-white backdrop-blur-md shadow-lg p-4 rounded-xl border border-white/40">
        <h1 className="text-4xl font-extrabold text-slate-700 tracking-tight">
          Pacientes
        </h1>

        <div className="flex gap-3 items-center">
          {(user?.rol === "ADMIN" || user?.rol === "MEDICO") && (
            <Link
              to="/pacientes/nuevo"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
            >
              Nuevo Paciente
            </Link>
          )}

          <button
            onClick={cerrarSesion}
            className="bg-red-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-red-600 hover:scale-105 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-3xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Buscar paciente por nombre, apellido o ID..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full px-4 py-3 rounded-full shadow bg-white border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* MAIN CARD */}
      <div className="bg-white shadow-xl rounded-2xl p-6 border border-white/40 backdrop-blur-sm">

        {error && <p className="text-red-600 mb-4 font-semibold">{error}</p>}

        {/* TABLE */}
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Apellido</th>
              <th className="p-3">Edad</th>
              <th className="p-3">Sexo</th>
              <th className="p-3">Salud</th>
              {(user?.rol === "ADMIN" || user?.rol === "MEDICO") && (
                <th className="p-3">Acciones</th>
              )}
            </tr>
          </thead>

          <tbody>
            {filtrar.map((p) => (
              <tr
                key={p.id}
                className="border-t hover:bg-blue-50 transition duration-200"
              >
                <td className="p-3 text-center">{p.id}</td>
                <td className="p-3">{p.nombre}</td>
                <td className="p-3">{p.apellido}</td>
                <td className="p-3 text-center">{p.edad}</td>
                <td className="p-3 text-center">{p.sexo}</td>

                {/* BADGE DE SALUD */}
                <td className="p-3">
                  {p.estadoSalud === "Estable" && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      Estable
                    </span>
                  )}
                  {p.estadoSalud === "Saludable" && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      Saludable
                    </span>
                  )}
                  {p.estadoSalud === "Crítico" && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                      Crítico
                    </span>
                  )}
                  {p.estadoSalud == "Delicada" && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                      Delicada
                    </span>
                  )}
                  {p.estadoSalud == "Recuperación" && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                      Recuperación
                    </span>
                  )}
                  {p.estadoSalud == "Crónico" && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                      Crónico
                    </span>
                  )}
                </td>

                {(user?.rol === "ADMIN" || user?.rol === "MEDICO") && (
                  <td className="p-3 flex gap-4 justify-center">
                    <Link
                      to={`/pacientes/editar/${p.id}`}
                      className="text-blue-600 hover:text-blue-800 font-semibold transition"
                    >
                      Editar
                    </Link>

                    {user?.rol === "ADMIN" && (
                      <button
                        onClick={() => eliminar(p.id)}
                        className="text-red-600 hover:text-red-800 font-semibold transition"
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

        {/* NO RESULTS */}
        {filtrar.length === 0 && (
          <p className="text-gray-500 mt-4 text-center">
            No se encontraron pacientes.
          </p>
        )}
      </div>
    </div>
  );
}
