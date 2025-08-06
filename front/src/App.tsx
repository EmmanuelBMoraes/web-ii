import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

// Layouts
import AuthLayout from "./components/layouts/AuthLayout";

// Componentes de Rota
import ProtectedRoute from "./components/shared/ProtectedRoute";
import PublicRoute from "./components/shared/PublicRoute";

// Páginas
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotFoundPage from "./pages/NotFound";
import MainLayout from "./components/layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <>
      <Routes>
        {/* Rota para as páginas de autenticação (ex: Login, Registro) */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>

        {/* Rotas Protegidas que usam o layout principal (com Navbar, Sidebar, etc.) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
          </Route>
        </Route>
        {/* Rota para página não encontrada (404) */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
