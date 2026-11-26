import { EmConstrucao } from "@/components/em-construcao";
import { PageHeader } from "@/components/page-header";

export default function VeiculosPage() {
  return (
    <>
      <PageHeader
        titulo="Frota e Veículos"
        descricao="Cadastro, edição e inativação dos veículos da frota."
      />
      <EmConstrucao requisito="RF-01" />
    </>
  );
}
