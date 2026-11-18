import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center bg-muted p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>FrotaManager</CardTitle>
          <CardDescription>
            Sistema de acompanhamento de frota e controle de ativos.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Base do frontend pronta: Next.js, Tailwind e shadcn/ui. As telas
            entram nos próximos PRs.
          </p>
          <Button>Nova Manutenção</Button>
        </CardContent>
      </Card>
    </main>
  );
}