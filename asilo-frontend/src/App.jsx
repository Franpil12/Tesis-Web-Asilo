import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import PacientesList from "./pages/PacientesList";
import PacienteForm from "./pages/PacienteForm";
import PacienteEdit from "./pages/PacienteEdit";
import PrivateRoute from "./auth/PrivateRoute";
import UsuariosList from "./pages/UsuariosList";
import UsuarioForm from "./pages/UsuarioForm";
import RoleRoute from "./auth/RoleRoute";
import PacienteDocumentos from "./pages/PacienteDocumentos";

export default function App() {
  return (
    <Routes>
      {/* Redirección por defecto */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      {/* Todos los usuarios autenticados pueden ver la lista */}
      <Route
        path="/pacientes"
        element={
          <PrivateRoute>
            <PacientesList />
          </PrivateRoute>
        }
      />

      {/* Solo ADMIN o MÉDICO pueden crear */}
      <Route
        path="/pacientes/nuevo"
        element={
          <RoleRoute roles={["ADMIN", "MEDICO"]}>
            <PacienteForm />
          </RoleRoute>
        }
      />

      {/* Solo ADMIN o MÉDICO pueden editar */}
      <Route
        path="/pacientes/editar/:id"
        element={
          <RoleRoute roles={["ADMIN", "MEDICO"]}>
            <PacienteEdit />
          </RoleRoute>
        }
      />

      {/* Solo ADMIN puede gestionar usuarios */}
      <Route
        path="/usuarios"
        element={
          <RoleRoute roles={["ADMIN"]}>
            <UsuariosList />
          </RoleRoute>
        }
      />

      <Route
        path="/pacientes/documentos/:id"
        element={
          <PrivateRoute>
            <PacienteDocumentos />
          </PrivateRoute>
        }
      />

      <Route
        path="/usuarios/nuevo"
        element={
          <RoleRoute roles={["ADMIN"]}>
            <UsuarioForm />
          </RoleRoute>
        }
      />

      {/* Página de error */}
      <Route
        path="*"
        element={<div className="p-8 text-center">Página no encontrada</div>}
      />
    </Routes>
  );
}
