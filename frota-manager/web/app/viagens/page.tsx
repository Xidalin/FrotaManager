import { EmConstrucao } from "@/components/em-construcao";
import { PageHeader } from "@/components/page-header";

export default function ViagensPage() {
  return (
    <>
      <PageHeader
        titulo="Viagens"
        descricao="Agendamento de viagens com alocação de veículo e motorista."
      />
      <EmConstrucao requisito="UC-01" />
    </>
  );
}
