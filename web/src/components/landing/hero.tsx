import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Gestão Inteligente para <span className="text-primary">Clínicas Modernas</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Otimize agendamentos, prontuários e faturamento em uma única plataforma. 
          Segurança, conformidade e eficiência para você focar no paciente.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/auth/register">
            <Button size="lg" className="h-12 px-8 text-lg">Teste Grátis</Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg">Saiba Mais</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
