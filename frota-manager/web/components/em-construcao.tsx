import { Construction } from "lucide-react";

type EmConstrucaoProps = {
  /** Requisito do REQUISITOS.md que esta tela vai atender, ex.: "RF-02". */
  requisito: string;
};

// Aviso provisório para as páginas que ainda não têm tela implementada.
export function EmConstrucao({ requisito }: EmConstrucaoProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-card px-6 py-16 text-center">
      <Construction
        className="size-8 text-muted-foreground"
        aria-hidden="true"
      />
      <p className="font-medium text-foreground">Tela em construção</p>
      <p className="max-w-md text-sm text-muted-foreground">
        Esta página vai atender ao requisito <strong>{requisito}</strong>. O
        layout segue o protótipo do Figma.
      </p>
    </div>
  );
}
