import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";

const TABS = ["Social", "Medico", "Psicologico", "Fisico", "Enfermeria"];

const tabToArea = (tab) => tab.toLowerCase(); // Social -> social

export default function PacienteDocumentos() {
  const { id } = useParams();

  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [tabActiva, setTabActiva] = useState("Social");

  const [docs, setDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  const [subiendo, setSubiendo] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [titulo, setTitulo] = useState("");

  // URL base para abrir archivos (/uploads)
  const FILES_BASE_URL = useMemo(() => {
    const base = api?.defaults?.baseURL || "";
    return base.endsWith("/api") ? base.replace(/\/api$/, "") : "http://localhost:3001";
  }, []);

  const cargarPaciente = async () => {
    try {
      const res = await api.get(`/pacientes/${id}`);
      setPaciente(res.data);
    } catch (err) {
      setError("No se pudo cargar la información del paciente");
    } finally {
      setLoading(false);
    }
  };

  const cargarDocs = async (tab = tabActiva) => {
    const area = tabToArea(tab);
    setLoadingDocs(true);
    try {
      const res = await api.get(`/documentos/${area}/${id}`);
      setDocs(res.data);
    } catch (err) {
      console.error(err);
      setDocs([]);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    cargarPaciente();
    // cargar docs del tab inicial
    cargarDocs("Social");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const cambiarTab = async (tab) => {
    setTabActiva(tab);
    setArchivo(null);
    setTitulo("");
    await cargarDocs(tab);
  };

  const subirPDF = async (e) => {
    e.preventDefault();

    const area = tabToArea(tabActiva);

    if (!archivo) {
      alert("Selecciona un archivo PDF.");
      return;
    }

    if (archivo.type !== "application/pdf") {
      alert("Solo se permiten archivos PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("archivo", archivo);
    if (titulo.trim()) formData.append("titulo", titulo.trim());

    setSubiendo(true);
    try {
      await api.post(`/documentos/${area}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setArchivo(null);
      setTitulo("");
      await cargarDocs(tabActiva);
      alert("Documento subido correctamente.");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Error al subir documento";
      alert(msg);
    } finally {
      setSubiendo(false);
    }
  };

  const renderContenido = () => {
    return (
      <div className="mt-4 bg-white/70 rounded-xl p-4 shadow-inner border border-purple-100">
        <h2 className="text-xl font-semibold text-slate-700 mb-2">
          Área {tabActiva}
        </h2>

        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          Sube y consulta documentos del área{" "}
          <span className="font-semibold">{tabActiva}</span>.
        </p>

        {/* SUBIR PDF */}
        <form
          onSubmit={subirPDF}
          className="bg-white rounded-xl p-4 shadow border border-purple-100"
        >
          <div className="grid md:grid-cols-3 gap-3 items-end">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Título (opcional)
              </label>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder={`Ej: Documento ${tabActiva}`}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-300 focus:outline-none text-sm"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Archivo PDF
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                className="w-full text-sm"
              />
            </div>

            <div className="md:col-span-1">
              <button
                type="submit"
                disabled={subiendo}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition disabled:opacity-60"
              >
                {subiendo ? "Subiendo..." : "Subir PDF"}
              </button>
            </div>
          </div>
        </form>

        {/* LISTA */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-700">
              Documentos ({tabActiva})
            </h3>
            {loadingDocs && (
              <span className="text-xs text-slate-500 animate-pulse">
                Cargando...
              </span>
            )}
          </div>

          {!loadingDocs && docs.length === 0 ? (
            <p className="text-sm text-slate-500">
              No hay documentos en esta sección aún.
            </p>
          ) : (
            <ul className="space-y-2">
              {docs.map((d) => (
                <li
                  key={d.id}
                  className="bg-white rounded-xl p-3 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-2 border border-purple-50"
                >
                  <div>
                    <p className="font-semibold text-slate-700">
                      {d.titulo || `Documento ${tabActiva}`}
                    </p>
                    <p className="text-xs text-slate-500">
                      {d.nombreOriginal} •{" "}
                      {(d.tamanoBytes / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <a
                    href={`${FILES_BASE_URL}/${d.rutaArchivo}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-700 font-semibold hover:underline"
                  >
                    Abrir PDF
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-purple-200">
        <p className="text-slate-600 text-lg animate-pulse">
          Cargando información del paciente...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-red-200">
        <p className="text-red-700 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-200 p-6 animate-fadeIn">
      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-slate-700 tracking-tight">
          Documentos del Paciente
        </h1>

        <Link
          to="/pacientes"
          className="px-4 py-2 rounded-full bg-slate-700 text-white text-sm shadow hover:bg-slate-800 transition"
        >
          Volver a la lista
        </Link>
      </div>

      {/* CARD PACIENTE */}
      <div className="bg-white/90 shadow-xl rounded-2xl p-6 border border-white/60 backdrop-blur-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Paciente</p>
            <h2 className="text-2xl font-bold text-slate-800">
              {paciente?.nombre} {paciente?.apellido}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              ID: <span className="font-semibold">{paciente?.id}</span> • Edad:{" "}
              <span className="font-semibold">{paciente?.edad}</span> años • Sexo:{" "}
              <span className="font-semibold">{paciente?.sexo}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
              Estado de salud: {paciente?.estadoSalud || "Sin registro"}
            </span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white/80 rounded-2xl p-4 shadow border border-purple-100">
        <p className="text-sm text-slate-600 mb-3">
          Selecciona el área para visualizar o registrar la información correspondiente del paciente.
        </p>

        <div className="flex flex-wrap gap-3">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => cambiarTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition transform hover:-translate-y-0.5
              ${
                tabActiva === tab
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-purple-50 text-purple-700 hover:bg-purple-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* CONTENIDO */}
        {renderContenido()}
      </div>
    </div>
  );
}
