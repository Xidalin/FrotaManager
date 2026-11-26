import { EmConstrucao } from "@/components/em-construcao";
import { PageHeader } from "@/components/page-header";

export default function ManutencoesPage() {
  return (
    <>
      <PageHeader
        titulo="Gestão e Controle de Manutenções"
        descricao="Ordens de serviço, bloqueio temporário do veículo e histórico de revisões."
      />
      <EmConstrucao requisito="RF-02" />
    </>
  );
}
