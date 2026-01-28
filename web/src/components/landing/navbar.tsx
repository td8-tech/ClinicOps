import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="border-b bg-white dark:bg-gray-950 sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Link href="/">ClinicOps</Link>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="#features" className="hover:text-primary">Funcionalidades</Link>
          <Link href="#pricing" className="hover:text-primary">Preços</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link href="/auth/register">
            <Button>Começar Agora</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
