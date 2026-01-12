import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";

const toDateInputValue = (iso) => {
  if (!iso) return "";
  return String(iso).slice(0, 10); // YYYY-MM-DD
};

const SALUD_OPTIONS = [
  { value: "", label: "Seleccionar..." },
  { value: "Estable", label: "Estable", badge: "bg-blue-100 text-blue-700 ring-blue-200" },
  { value: "Saludable", label: "Saludable", badge: "bg-green-100 text-green-700 ring-green-200" },
  { value: "Delicada", label: "Delicada", badge: "bg-yellow-100 text-yellow-700 ring-yellow-200" },
  { value: "Crítico", label: "Crítico", badge: "bg-red-100 text-red-700 ring-red-200" },
  { value: "Recuperación", label: "Recuperación", badge: "bg-purple-100 text-purple-700 ring-purple-200" },
  { value: "Crónico", label: "Crónico", badge: "bg-gray-100 text-gray-700 ring-gray-200" },
];

function getSaludBadgeClass(value) {
  return (
    SALUD_OPTIONS.find((o) => o.value === value)?.badge ||
    "bg-slate-100 text-slate-700 ring-slate-200"
  );
}

export default function PacienteEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    cedula: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    sexo: "",
    estadoSalud: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/pacientes/${id}`)
      .then((res) => {
        const p = res.data;
        setForm({
          cedula: p.cedula || "",
          nombre: p.nombre || "",
          apellido: p.apellido || "",
          fechaNacimiento: toDateInputValue(p.fechaNacimiento),
          sexo: p.sexo || "",
          estadoSalud: p.estadoSalud || "",
        });
      })
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ✅ solo números en cédula
    if (name === "cedula") {
      const onlyDigits = value.replace(/\D/g, "");
      setForm({ ...form, cedula: onlyDigits });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Validaciones mínimas
    if (!form.cedula || !/^\d{10}$/.test(form.cedula)) {
      setError("La cédula debe tener exactamente 10 dígitos.");
      return;
    }

    if (!form.nombre.trim() || !form.apellido.trim()) {
      setError("Nombre y apellido son obligatorios.");
      return;
    }

    if (!form.sexo) {
      setError("Debe seleccionar el sexo del paciente.");
      return;
    }

    if (!form.fechaNacimiento) {
      setError("Debe seleccionar la fecha de nacimiento.");
      return;
    }

    try {
      setSaving(true);

      const data = {
        cedula: form.cedula,
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        fechaNacimiento: form.fechaNacimiento || null,
        sexo: form.sexo,
        estadoSalud: form.estadoSalud?.trim() || null,
      };

      await api.put(`/pacientes/${id}`, data);
      navigate("/pacientes");
    } catch (err) {
      console.error(err);

      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Error al actualizar paciente";

      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-200 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800">
              Editar paciente
            </h1>
            <p className="text-slate-600 mt-1">
              Estás modificando un registro existente. Guarda los cambios cuando termines.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/pacientes")}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/70 hover:bg-white text-slate-700 border border-white/60 shadow-sm transition"
          >
            ← Volver
          </button>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-md border border-white/50 shadow-xl rounded-2xl overflow-hidden">
          {/* Accent (verde) */}
          <div className="h-2 bg-gradient-to-r from-green-600 to-emerald-600" />

          <div className="p-6 sm:p-8">
            {/* Loading */}
            {loading && (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-slate-700 font-semibold">Cargando datos…</p>
                <p className="text-sm text-slate-500 mt-1">Por favor espera un momento.</p>
              </div>
            )}

            {!loading && (
              <>
                {/* Error */}
                {error && (
                  <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-red-700 font-semibold">Ocurrió un problema</p>
                    <p className="text-red-700/90 text-sm mt-1">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Sección: Identificación */}
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Identificación</h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Edita con cuidado los datos de identificación.
                    </p>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Cédula */}
                      <div className="sm:col-span-1">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Cédula
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            #
                          </span>
                          <input
                            type="text"
                            name="cedula"
                            value={form.cedula}
                            onChange={handleChange}
                            maxLength={10}
                            placeholder="1724793481"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Solo números.</p>
                      </div>

                      {/* Nombre */}
                      <div className="sm:col-span-1">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Nombre
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            👤
                          </span>
                          <input
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
                          />
                        </div>
                      </div>

                      {/* Apellido */}
                      <div className="sm:col-span-1">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Apellido
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            🪪
                          </span>
                          <input
                            type="text"
                            name="apellido"
                            value={form.apellido}
                            onChange={handleChange}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sección: Datos personales */}
                  <div className="pt-2">
                    <h2 className="text-lg font-bold text-slate-800">Datos personales</h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Fecha de nacimiento y sexo del paciente.
                    </p>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Fecha nacimiento */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Fecha de nacimiento
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            📅
                          </span>
                          <input
                            type="date"
                            name="fechaNacimiento"
                            value={form.fechaNacimiento}
                            onChange={handleChange}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
                          />
                        </div>
                      </div>

                      {/* Sexo */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Sexo
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            ⚥
                          </span>
                          <select
                            name="sexo"
                            value={form.sexo}
                            onChange={handleChange}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
                          >
                            <option value="">Seleccionar...</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sección: Salud */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold text-slate-800">Estado de salud</h2>
                        <p className="text-sm text-slate-500 mt-1">
                          Mantener estados estandarizados ayuda a reportes.
                        </p>
                      </div>

                      {/* Badge preview */}
                      <span
                        className={`shrink-0 px-3 py-1 rounded-full text-sm font-semibold ring-1 ${getSaludBadgeClass(
                          form.estadoSalud
                        )}`}
                        title="Vista previa"
                      >
                        {form.estadoSalud ? form.estadoSalud : "Sin estado"}
                      </span>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Estado
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          ❤️
                        </span>
                        <select
                          name="estadoSalud"
                          value={form.estadoSalud}
                          onChange={handleChange}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
                        >
                          {SALUD_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        Si no aplica, puedes dejarlo en “Seleccionar...”.
                      </p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="pt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => navigate("/pacientes")}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-white transition
                        ${
                          saving
                            ? "bg-slate-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 shadow-sm"
                        }`}
                    >
                      {saving ? "Actualizando..." : "Actualizar paciente"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6 opacity-80">
          © 2024 AsiloApp. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
