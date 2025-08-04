import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    // Esta div centraliza o conteúdo na tela, ideal para um formulário de login.
    <div className="flex items-center justify-center min-h-screen w-auto bg-gray-100 dark:bg-gray-900">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
