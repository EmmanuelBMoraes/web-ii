import { Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../shared/ThemeToggle";
import { LogOut, Users, BookCopy, LayoutDashboard } from "lucide-react";

const MainLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Sidebar - Menu de Navegação */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-primary">Painel</h2>
          </div>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link to="/">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link to="/alunos">
              <Users className="mr-2 h-4 w-4" /> Alunos
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link to="/disciplinas">
              <BookCopy className="mr-2 h-4 w-4" /> Disciplinas
            </Link>
          </Button>
        </nav>

        {/* Botão de Logout posicionado no final da sidebar */}
        <div className="mt-auto p-4">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Conteúdo Principal (Header + Main) */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 justify-end">
          <ThemeToggle />
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {/* O Outlet renderiza o componente da rota atual (Dashboard, Alunos, etc.) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
