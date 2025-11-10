import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function UsuarioForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    rol: "ENFERMERA",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/usuarios", form);
      navigate("/usuarios");
    } catch {
      setError("Error al crear usuario");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white mt-10 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">
        Crear Usuario
      </h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={form.correo}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
        <select
          name="rol"
          value={form.rol}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="ADMIN">Administrador</option>
          <option value="MEDICO">Médico</option>
          <option value="ENFERMERA">Enfermera</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
