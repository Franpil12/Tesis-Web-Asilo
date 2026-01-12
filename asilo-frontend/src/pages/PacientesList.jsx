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

  // ✅ Modal eliminar
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pacienteAEliminar, setPacienteAEliminar] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  // ✅ abrir modal
  const pedirConfirmEliminar = (paciente) => {
    setPacienteAEliminar(paciente);
    setConfirmOpen(true);
  };

  // ✅ cerrar modal
  const cerrarModal = () => {
    if (deleting) return;
    setConfirmOpen(false);
    setPacienteAEliminar(null);
  };

  // ✅ eliminar real (sin confirm)
  const eliminarConfirmado = async () => {
    if (!pacienteAEliminar?.id) return;

    try {
      setDeleting(true);
      await api.delete(`/pacientes/${pacienteAEliminar.id}`);
      cerrarModal();
      cargarPacientes();
    } catch {
      setError("Error al eliminar paciente");
      setConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  const filtrar = pacientes.filter((p) =>
    [p.nombre, p.apellido, p.cedula]
      .join(" ")
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const estadoSaludStyles = {
    Estable: "bg-blue-100 text-blue-700",
    Saludable: "bg-green-100 text-green-700",
    Delicada: "bg-yellow-100 text-yellow-700",
    Crítico: "bg-red-100 text-red-700",
    Recuperación: "bg-purple-100 text-purple-700",
    Crónico: "bg-gray-100 text-gray-700",
  };

  const pacientesOrdenados = [...filtrar].sort((a, b) => {
    const apellidoA = a.apellido?.toLowerCase() || "";
    const apellidoB = b.apellido?.toLowerCase() || "";

    if (apellidoA < apellidoB) return -1;
    if (apellidoA > apellidoB) return 1;

    const nombreA = a.nombre?.toLowerCase() || "";
    const nombreB = b.nombre?.toLowerCase() || "";

    return nombreA.localeCompare(nombreB);
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-200 p-6 animate-fadeIn">
      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-8 bg-white backdrop-blur-md shadow-lg p-4 rounded-xl border border-white/40">
        <h1 className="text-4xl font-extrabold text-slate-700 tracking-tight">
          Pacientes
        </h1>

        {(user?.rol === "ADMIN" || user?.rol === "MEDICO") && (
          <Link
            to="/pacientes/nuevo"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
          >
            Nuevo Paciente
          </Link>
        )}
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-3xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Buscar paciente por nombre, apellido o cédula..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full px-4 py-3 rounded-full shadow bg-white border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* MAIN CARD */}
      <div className="bg-white shadow-xl rounded-2xl p-6 border border-white/40 backdrop-blur-sm">
        {error && (
          <p className="text-red-600 mb-4 font-semibold">{error}</p>
        )}

        {/* TABLE */}
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
            <tr>
              <th className="p-3">Cédula</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Apellido</th>
              <th className="p-3">Edad</th>
              <th className="p-3">Sexo</th>
              <th className="p-3">Salud</th>
              <th className="p-3">Documentos</th>
              {(user?.rol === "ADMIN" || user?.rol === "MEDICO") && (
                <th className="p-3">Acciones</th>
              )}
            </tr>
          </thead>

          <tbody>
            {pacientesOrdenados.map((p) => (
              <tr
                key={p.id}
                className="border-t hover:bg-blue-50 transition duration-200"
              >
                <td className="p-3 text-center">{p.cedula}</td>
                <td className="p-3">{p.nombre}</td>
                <td className="p-3">{p.apellido}</td>
                <td className="p-3 text-center">{p.edadCalculada ?? "—"}</td>
                <td className="p-3 text-center">{p.sexo}</td>

                {/* ESTADO DE SALUD */}
                <td className="p-3 text-center">
                  {p.estadoSalud ? (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold
                        ${
                          estadoSaludStyles[p.estadoSalud] ||
                          "bg-slate-100 text-slate-700"
                        }
                      `}
                    >
                      {p.estadoSalud}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>

                {/* DOCUMENTOS (MEJORADO) */}
                <td className="p-3 text-center">
                  <Link
                    to={`/pacientes/documentos/${p.id}`}
                    className="
                      inline-flex items-center justify-center gap-2
                      px-4 py-2
                      rounded-full
                      text-sm font-bold
                      text-white
                      bg-gradient-to-r from-purple-600 to-indigo-600
                      shadow-md
                      hover:shadow-lg hover:scale-[1.03]
                      active:scale-[0.98]
                      transition
                      focus:outline-none focus:ring-2 focus:ring-purple-300
                    "
                    title="Ver documentos del paciente"
                  >
                    <span className="text-base">📄</span>
                    <span>Documentos</span>
                  </Link>
                </td>

                {/* ACCIONES */}
                {(user?.rol === "ADMIN" || user?.rol === "MEDICO") && (
                  <td className="p-3 flex gap-4 justify-center">
                    <Link
                      to={`/pacientes/editar/${p.id}`}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold hover:bg-blue-200 transition"
                    >
                      Editar
                    </Link>

                    {user?.rol === "ADMIN" && (
                      <button
                        onClick={() => pedirConfirmEliminar(p)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold hover:bg-red-200 transition"
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

        {filtrar.length === 0 && (
          <p className="text-gray-500 mt-4 text-center">
            No se encontraron pacientes.
          </p>
        )}
      </div>

      {/* CERRAR SESIÓN */}
      <button
        onClick={cerrarSesion}
        className="
          fixed bottom-6 left-6
          bg-red-500 hover:bg-red-600
          text-white px-4 py-2
          rounded-lg text-sm
          transition shadow-sm
        "
      >
        Salir
      </button>

      {/* MODAL CONFIRMAR ELIMINACIÓN */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={cerrarModal}
          />

          {/* modal */}
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-white/60 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-red-500 to-rose-600" />

            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center text-lg">
                  ⚠️
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800">
                    ¿Eliminar paciente?
                  </h3>
                  <p className="text-slate-600 mt-1">
                    Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-sm text-slate-700">
                  <span className="font-bold">Paciente:</span>{" "}
                  {pacienteAEliminar
                    ? `${pacienteAEliminar.nombre} ${pacienteAEliminar.apellido}`
                    : "—"}
                </p>
                <p className="text-sm text-slate-700 mt-1">
                  <span className="font-bold">Cédula:</span>{" "}
                  {pacienteAEliminar?.cedula || "—"}
                </p>
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={cerrarModal}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition disabled:opacity-60"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={eliminarConfirmado}
                  disabled={deleting}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {deleting ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
