import { EmConstrucao } from "@/components/em-construcao";
import { PageHeader } from "@/components/page-header";

export default function RelatoriosPage() {
  return (
    <>
      <PageHeader
        titulo="Relatórios"
        descricao="Quilometragem e quantidade de viagens por veículo e período."
      />
      <EmConstrucao requisito="RF-03" />
    </>
  );
}
