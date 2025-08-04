import { Outlet } from "react-router-dom";
import { ThemeToggle } from "../shared/ThemeToggle";

const AuthLayout = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
