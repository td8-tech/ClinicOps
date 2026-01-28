import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Shield, FileText, Activity, Lock } from "lucide-react";

const features = [
  {
    title: "Agendamento Inteligente",
    description: "Gestão completa de agenda com confirmações automáticas.",
    icon: Calendar,
  },
  {
    title: "Prontuário Eletrônico",
    description: "Histórico completo do paciente, acessível e seguro.",
    icon: FileText,
  },
  {
    title: "Multi-tenant Seguro",
    description: "Dados isolados e protegidos com tecnologia RLS.",
    icon: Shield,
  },
  {
    title: "Gestão Financeira",
    description: "Controle de faturamento, convênios e repasses.",
    icon: Activity,
  },
  {
    title: "Controle de Acesso",
    description: "Perfis de acesso granulares para cada membro da equipe.",
    icon: Users,
  },
  {
    title: "Conformidade LGPD",
    description: "Auditoria completa e proteção de dados sensíveis.",
    icon: Lock,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Tudo que sua clínica precisa</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
