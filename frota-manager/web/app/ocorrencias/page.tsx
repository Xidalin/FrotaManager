import { EmConstrucao } from "@/components/em-construcao";
import { PageHeader } from "@/components/page-header";

export default function OcorrenciasPage() {
  return (
    <>
      <PageHeader
        titulo="Ocorrências"
        descricao="Imprevistos reportados pelos motoristas durante as viagens."
      />
      <EmConstrucao requisito="HU-01" />
    </>
  );
}
