import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl text-center text-red-600">Erro de Autenticação</CardTitle>
          <CardDescription className="text-center">
            Não foi possível validar seu acesso.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            O link que você usou pode ter expirado ou já ter sido utilizado.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Link href="/auth/login">
            <Button>Voltar ao Login</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
