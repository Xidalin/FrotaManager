import type { ReactNode } from "react";

type PageHeaderProps = {
  titulo: string;
  descricao: string;
  /** Botões à direita do título, como "Atualizar" e "Nova Manutenção". */
  acoes?: ReactNode;
};

// Título + descrição que abre cada página (mesmo padrão em todas as telas).
export function PageHeader({ titulo, descricao, acoes }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {titulo}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{descricao}</p>
      </div>
      {acoes ? <div className="flex items-center gap-2">{acoes}</div> : null}
    </div>
  );
}
