"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  FileChartColumn,
  LayoutGrid,
  Route,
  TriangleExclamationPoint,
  Truck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type ItemMenu = {
  titulo: string;
  href: string;
  icone: LucideIcon;
};

type GrupoMenu = {
  rotulo: string;
  itens: ItemMenu[];
};

// Itens do menu, na ordem do protótipo (Figma).
// Cada página aponta para o requisito que a justifica (REQUISITOS.md).
const grupos: GrupoMenu[] = [
  {
    rotulo: "Visão geral",
    itens: [{ titulo: "Dashboard Executivo", href: "/", icone: LayoutGrid }],
  },
  {
    rotulo: "Operação e cadastro",
    itens: [
      { titulo: "Frota e Veículos", href: "/veiculos", icone: Car }, // RF-01
      { titulo: "Motoristas", href: "/motoristas", icone: Users }, // RF-01
      { titulo: "Viagens", href: "/viagens", icone: Route }, // UC-01
    ],
  },
  {
    rotulo: "Serviços e manutenção",
    itens: [
      { titulo: "Manutenções", href: "/manutencoes", icone: Wrench }, // RF-02
      {
        titulo: "Ocorrências",
        href: "/ocorrencias",
        icone: TriangleExclamationPoint,
      }, // HU-01
      { titulo: "Relatórios", href: "/relatorios", icone: FileChartColumn }, // RF-03
    ],
  },
];

// O endereço da página pode vir com ou sem barra no final ("/veiculos" ou "/veiculos/").
function estaAtivo(pathname: string, href: string) {
  const atual = pathname.replace(/\/$/, "") || "/";
  return atual === href;
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Truck className="size-5" aria-hidden="true" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-foreground">FROTAMANAGER</p>
            <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
              Gestão de frotas
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        {grupos.map((grupo) => (
          <SidebarGroup key={grupo.rotulo}>
            <SidebarGroupLabel className="text-[11px] tracking-wide uppercase">
              {grupo.rotulo}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {grupo.itens.map((item) => {
                  const ativo = estaAtivo(pathname, item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        className={
                          ativo
                            ? "bg-sidebar-primary font-medium text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground"
                            : undefined
                        }
                      >
                        <Link
                          href={item.href}
                          aria-current={ativo ? "page" : undefined}
                        >
                          <item.icone aria-hidden="true" />
                          <span>{item.titulo}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {/* Usuário fixo até a autenticação existir (capítulo 13) */}
        <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            GF
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium text-foreground">
              Gestor da Frota
            </p>
            <p className="truncate text-xs text-muted-foreground">
              gestao@empresa.com
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
