import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

// Fonte do protótipo (Figma). A variável --font-inter é usada no globals.css.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FrotaManager",
  description: "Sistema de acompanhamento de frota e controle de ativos",
};

// Moldura comum a todas as páginas: menu lateral + cabeçalho + conteúdo.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full`}>
      <body className="min-h-full antialiased">
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <AppHeader />
              <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
