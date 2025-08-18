import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Resumo do Restaurante</h2>
        </CardHeader>
        <CardContent>
          <p>Informações rápidas aparecem aqui.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Últimas atividades</h2>
        </CardHeader>
        <CardContent>
          <p>Logs ou dados recentes.</p>
        </CardContent>
      </Card>
    </div>
  );
}
