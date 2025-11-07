import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import PrivateRoute from "./auth/PrivateRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/pacientes"
        element={
          <PrivateRoute>
            <div className="p-8 text-center text-xl font-semibold text-green-700">
              Bienvenido al panel de pacientes 👨‍⚕️
            </div>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<div className="p-8">Página no encontrada</div>} />
    </Routes>
  );
}
