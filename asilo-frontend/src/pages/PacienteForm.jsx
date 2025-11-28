import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function PacienteForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    sexo: "",
    estadoSalud: "",
  });
  const [error, setError] = useState("");
  const [isCooldown, setIsCooldown] = useState(false);
  
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
      // Evitar spam del botón → activar cooldown
    

    if (!form.sexo) {
        setError("Debe seleccionar el sexo del paciente");
        return;
    }

    try {
        const data = { ...form, edad: parseInt(form.edad) || null };
        setIsCooldown(true);
        setTimeout(() => {
          setIsCooldown(false);
        }, 2000);
        await api.post("/pacientes", data);
        navigate("/pacientes");
    } catch (err) {
        console.error(err);
        setError("Error al registrar paciente");
    }
 };

  return (
    <div className="max-w-md mx-auto bg-white mt-10 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">
        Registrar Paciente
      </h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Apellido</label>
          <input
            type="text"
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Edad</label>
            <input
              type="number"
              name="edad"
              value={form.edad}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Sexo</label>
            <select
              name="sexo"
              value={form.sexo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Seleccionar...</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Estado de salud</label>
          <input
            type="text"
            name="estadoSalud"
            value={form.estadoSalud}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <button
        type="submit"
        disabled={isCooldown}
        className={`w-full text-white py-2 rounded-lg 
          ${isCooldown ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
        `}
      >
        {isCooldown ? "Espera..." : "Guardar"}
        </button>
      </form>
    </div>
  );
}

// Arreglar el boton de ingresar paciente por que si se presiona repetridamente manda mas d euna notificacion al sistema
