import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";


export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(correo, password);
      navigate("/pacientes");
    } catch (err) {
      setError(err?.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <div className="bg-white font-sans h-screen">
      <div
        className="grid min-h-screen w-full grid-cols-12 overflow-hidden 
                  bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: "url('/login-background.jpg')",
          boxShadow: "inset 0 0 0 1000px rgba(0, 0, 0, 0.4)",
        }}
      > 

        {/* LEFT SECTION */}
        <div className="col-span-7 flex p-32 text-white">
          <div className="w-full flex flex-col justify-between">
            <div>
              <img
                src="/logo.png"
                alt="logo"
                className="h-16 w-auto mb-8"
              />
            </div>

            <div>
              <h1 className="my-8 text-7xl leading-tight font-bold text-indigo-50">
                Bienvenidos al Asilo San Ignacio
              </h1>
              <p className="mb-2 text-xl">Cuidado y Responsabilidad</p>
            </div>
          </div>
        </div>
        

        {/* RIGHT SECTION */}
        <div className="relative col-span-5 flex bg-white rounded-tl-[44px]">
          <div
            className="absolute top-4 right-0 -left-4 z-20 h-full w-full"
            style={{
              background: "rgba(255,255,255,0.5)",
              borderTopLeftRadius: "44px",
            }}
          ></div>

          <div className="relative z-30 w-full">
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-20 max-w-sm bg-white p-4 sm:p-10 lg:max-w-lg xl:max-w-xl"
            >
              <h2 className="mb-10 text-4xl font-bold text-slate-600">
                Iniciar Sesión
              </h2>

              {error && (
                <p className="text-red-600 mb-4 font-semibold bg-red-100 p-2 rounded">
                  {error}
                </p>
              )}

              {/* EMAIL */}
              <input
                type="email"
                placeholder="Correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="mb-6 w-full border-b border-gray-300 px-4 py-5 text-lg font-medium text-slate-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />

              {/* PASSWORD */}
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-6 w-full border-b border-gray-300 px-4 py-5 text-lg font-medium text-slate-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />

              {/* LOGIN BUTTON */}
              <button className="mb-6 w-full transform rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 font-bold text-white hover:-translate-y-1 hover:shadow-lg">
                Ingresar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
