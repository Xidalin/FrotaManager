import { Bell, ChevronDown, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Cabeçalho fixo no topo de todas as páginas (protótipo: "Controle de manutenções").
export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b bg-card px-4 md:px-6">
      {/* Botão que abre/fecha o menu lateral (no celular, o menu vira uma gaveta) */}
      <SidebarTrigger className="-ml-1" />

      <div className="hidden leading-tight sm:block">
        <p className="text-sm font-bold text-foreground">FROTAMANAGER</p>
        <p className="text-xs text-muted-foreground">
          Sistema de acompanhamento de frota e controle de ativos
        </p>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Busca ainda sem função: entra quando a API de veículos estiver integrada */}
        <div className="relative hidden md:block">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Buscar veículo..."
            aria-label="Buscar veículo"
            className="w-64 bg-muted pl-9"
          />
        </div>

        <button
          type="button"
          className="relative rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Notificações"
        >
          <Bell className="size-5" aria-hidden="true" />
        </button>

        <Separator orientation="vertical" className="h-6" />

        {/* Usuário fixo até a autenticação existir (capítulo 13) */}
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
            UG
          </div>
          <span className="hidden text-sm font-medium text-foreground lg:inline">
            Usuário (Gestor)
          </span>
          <ChevronDown
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      </div>
    </header>
  );
}
