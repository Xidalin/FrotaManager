# Descoberta do problema

## Problema
Empresas que dependem de transporte logístico podem ter dificuldade para acompanhar e alocar seus recursos automotivos e humanos de forma centralizada. As informações descentralizadas levam a conflitos na alocação de veículos e podem encarecer a operação.

O problema identificado é a necessidade que as empresas têm de controlar veículos, motoristas e rotas de forma centralizada, garantindo o registro adequado do uso da frota e a redução de custos operacionais.

## Partes interessadas
| Parte Interessada | Interesse no projeto | Poder de decisão | Contato |
|---|---|---|---|
| Gestores | Cadastrar veículos e motoristas, acompanhar disponibilidade da frota, registrar manutenções e monitorar o uso | Alto | A definir |
| Motoristas | Visualizar suas viagens e reportar ocorrências | Baixo | A definir |
| Equipe de desenvolvimento | Desenvolver o sistema aplicando boas práticas de organização e versionamento | Alto | Repositório no GitHub |
| Professor da disciplina | Avaliar o desenvolvimento do projeto na disciplina de Engenharia de Software | Alto | A definir |

## Personas
### Carlos, Gestor de Frota
- **Contexto:** 45 anos, trabalha em uma transportadora e é responsável por controlar toda a logística diária.
- **Objetivo:** Facilitar o controle da frota, acompanhar motoristas/viagens e garantir o registro de manutenções preventivas e corretivas.
- **Dificuldade atual:** Lida com conflitos frequentes na alocação de veículos e planilhas desatualizadas que geram custos operacionais extras.
- **Condição de uso:** Acessa o sistema principalmente pelo computador do escritório durante o planejamento operacional.
- **O que ele não precisa:** Ferramentas complexas de mecânica automotiva profunda.

### Roberto, Motorista
- **Contexto:** 38 anos, funcionário ativo que realiza rotas de entrega diariamente.
- **Objetivo:** Ter um meio fácil para visualizar suas viagens e conseguir reportar ocorrências rapidamente.
- **Dificuldade atual:** Comunicação descentralizada com a gestão da empresa, dificultando o relato rápido sobre problemas no veículo.
- **Condição de uso:** Acessa o sistema principalmente pelo celular.
- **O que ele não precisa:** Acesso a recursos administrativos, relatórios de custo geral ou controle de manutenções.

## Fontes consultadas
---------------------
## Necessidades levantadas
| id | Necessidade | Parte | Fonte | Situação |
|---|---|---|---|---|
| N1 | Cadastrar veículos e motoristas na plataforma | Gestores | E1 | Confirmada |
| N2 | Cadastrar rotas e viagens a serem realizadas | Gestores | E2 | Confirmada |
| N3 | Controlar a disponibilidade da frota para evitar conflitos na alocação | Gestores | E1 | Confirmada |
| N4 | Registrar manutenções preventivas e corretivas | Gestores | E1 | Confirmada |
| N5 | Visualizar as próprias viagens e reportar ocorrências | Motoristas | E2 | Confirmada |
| N6 | Acessar relatório de uso e quilometragem por veículo para reduzir custos | Gestores | E1 | Confirmada |

## Escopo
### **Cadastro de frota e equipe**
O sistema permitirá o registro estruturado dos ativos logísticos da empresa.

**Inclui:**
- Cadastro de veículos;
- Cadastro de motoristas.
  
### **Gestão de rotas e viagens**
A plataforma permitirá a organização das jornadas de trabalho.

**Inclui:**
- Cadastro de rotas e viagens;
- Visualização de viagens pelos motoristas.
  
### **Controle de disponibilidade**
O sistema exibirá a situação de cada ativo para otimizar as operações da empresa.

**Inclui:**
- Controle centralizado de veículos e motoristas;
- Acompanhamento da disponibilidade da frota para evitar conflitos de alocação.
 
### **Registro de Manutenções e Ocorrências**
O sistema fornecerá meios para manter o bom estado da frota e comunicação ágil de problemas.

**Inclui:**
- Registro de manutenções preventivas;
- Registro de manutenções corretivas;
- Reporte de ocorrências relatadas pelos motoristas.
  
### **Relatórios Operacionais**
O sistema apresentará uma visão geral sobre a utilização dos ativos logísticos.

**Inclui:**
- Monitoramento do uso de cada veículo;
- Relatório de uso;
- Relatório de quilometragem por veículo.

## Fora de escopo nesta versão
### **Rastreamento via Satélite em Tempo Real (GPS)**
O sistema não monitorará ativamente os veículos em um mapa em tempo real.
**Motivo da exclusão:** O projeto tem como foco inicial apenas as funcionalidades de gerenciamento e relatórios do MVP. Integrações com geolocalização e hardwares embarcados elevariam a complexidade técnica e fugiriam do escopo inicial.

### **Módulo Financeiro e Faturamento**
O sistema não realizará o cálculo de pedágios, folha de pagamento de motoristas ou emissão de faturamento de fretes.
**Motivo da exclusão:** O foco central do projeto é o controle de veículos, manutenções e redução de custos operacionais por meio da correta alocação, e não a criação de um software contábil/financeiro.

### **Aplicativo Mobile Nativo**
Não será desenvolvido um aplicativo nativo para Android (Kotlin/Java) ou iOS (Swift).
**Motivo da exclusão:** A tecnologia proposta inicialmente foca em Frontend utilizando HTML, CSS e JavaScript. Criar aplicativos nativos demandaria alto esforço e tecnologias adicionais nesta fase.

## Produto mínimo viável
O Produto Mínimo Viável (MVP) do Sistema de Gerenciamento de Frota contemplará as funcionalidades iniciais propostas, garantindo um controle básico e essencial das operações logísticas.

A definição das funcionalidades foca em resolver o problema central: controlar a frota de forma centralizada e registrar seu histórico e manutenções. 

### **Funcionalidades incluídas no MVP**
Conforme a definição inicial, o MVP será composto pelas seguintes funcionalidades:
| ID | Funcionalidade | Descrição |
|---|---|---|
| F1 | Cadastros base | Cadastro de veículos e motoristas. |
| F2 | Operação | Cadastro de rotas e viagens. |
| F3 | Alocação | Controle de disponibilidade da frota para evitar conflitos. |
| F4 | Conservação | Registro de manutenções preventivas e corretivas. |
| F5 | Análise | Geração de relatório de uso e quilometragem por veículo. |

## Riscos iniciais
### **R1** 
- **Risco:** Adaptação da equipe às tecnologias escolhidas para a stack (Backend em Node.js e Banco de Dados MySQL). 
- **Probabilidade:** média 
- **Impacto:** alto 
- **Resposta:** mitigar 
- **Ação e responsável:** Realizar nivelamento técnico da equipe através do desenvolvimento iterativo e incremental; responsável: Equipe de Desenvolvimento.

### **R2** 
- **Risco:** O projeto sofrer alterações ao longo do desenvolvimento e do refinamento dos requisitos.
- **Probabilidade:** alta 
- **Impacto:** médio 
- **Resposta:** aceitar 
- **Ação e responsável:** Utilizar versionamento (Git e GitHub) e evolução incremental para absorver as alterações de forma organizada; responsável: Equipe de Desenvolvimento.

## Histórico de revisão
- 2026-09-03: Versão inicial documentada a partir do escopo básico (MVP) do projeto.