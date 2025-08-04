import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md text-center p-4">
        <CardHeader>
          <CardTitle className="text-8xl font-bold text-primary">404</CardTitle>
          <CardDescription className="text-2xl mt-4 font-semibold">
            Página Não Encontrada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Oops! A página que você está procurando não existe ou foi movida.
          </p>
          <Button asChild>
            <Link to="/">Voltar para a Página Inicial</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;
