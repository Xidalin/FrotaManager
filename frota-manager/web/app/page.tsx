import { EmConstrucao } from "@/components/em-construcao";
import { PageHeader } from "@/components/page-header";

// Dashboard Executivo. Pela decisão da equipe, mostra só o que o sistema calcula:
// total da frota, disponíveis, em viagem e em manutenção.
export default function DashboardPage() {
  return (
    <>
      <PageHeader
        titulo="Dashboard Executivo"
        descricao="Visão consolidada da frota e da disponibilidade dos veículos."
      />
      <EmConstrucao requisito="RF-03" />
    </>
  );
}
