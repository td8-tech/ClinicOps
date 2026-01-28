import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "R$ 99",
    period: "/mês",
    description: "Ideal para consultórios individuais.",
    features: ["1 Profissional", "Até 500 pacientes", "Agenda básica", "Prontuário simples"],
    action: "Começar",
  },
  {
    name: "Pro",
    price: "R$ 299",
    period: "/mês",
    description: "Para clínicas em crescimento.",
    features: ["Até 5 Profissionais", "Pacientes ilimitados", "Financeiro completo", "Telemedicina", "Suporte prioritário"],
    featured: true,
    action: "Assinar Pro",
  },
  {
    name: "Enterprise",
    price: "Sob consulta",
    period: "",
    description: "Para grandes redes e hospitais.",
    features: ["Profissionais ilimitados", "API dedicada", "Gestor de conta", "Customização white-label", "SLA garantido"],
    action: "Fale Conosco",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Planos Flexíveis</h2>
        <p className="text-center text-muted-foreground mb-12">Escolha o plano ideal para o momento da sua clínica.</p>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`flex flex-col ${plan.featured ? 'border-primary shadow-xl scale-105' : ''}`}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.featured ? "default" : "outline"}>{plan.action}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
