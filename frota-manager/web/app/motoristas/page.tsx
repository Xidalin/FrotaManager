import { EmConstrucao } from "@/components/em-construcao";
import { PageHeader } from "@/components/page-header";

export default function MotoristasPage() {
  return (
    <>
      <PageHeader
        titulo="Motoristas"
        descricao="Cadastro, edição e inativação dos motoristas."
      />
      <EmConstrucao requisito="RF-01" />
    </>
  );
}
