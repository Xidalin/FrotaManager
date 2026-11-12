# Arquitetura

## Visão geral

Diagrama em `diagrams/arquitetura.mmd`.

O **FrotaManager** adota uma arquitetura cliente-servidor em três camadas (Apresentação, Aplicação/Domínio e Persistência), comunicando-se via API RESTful em formato JSON:

* **Frontend Web Responsivo:** Interface única adaptável para desktop (visão gerencial do Gestor da Frota) e dispositivos móveis (visão operacional do Motorista).
* **Backend (API REST):** Centraliza as regras de negócio de alocação, manutenção, ocorrências e consolidação de relatórios.
* **Banco de Dados Relacional (MySQL):** Garante a persistência transacional, integridade referencial e auditoria histórica da frota.

## Responsabilidades

| Parte | Sabe | Faz |
|---|---|---|
| Frontend | Apresentação visual, estado da interface e dados da sessão do usuário | Renderiza telas (Dashboard, Despacho, Manutenções, Relatórios e visão Mobile do Motorista), realiza verificações de apoio nos formulários e consome a API REST. |
| Backend | Regras do domínio (`RN-01` a `RN-04`), políticas de permissão por perfil e contratos da API | Valida conflitos de agendamento e bloqueios por manutenção, impede regressão de odômetro, consolida relatórios operacionais, registra logs (`HistoricoViagem`) e responde às requisições HTTP. |
| Banco | Esquema relacional (`MySQL`), restrições de unicidade, chaves estrangeiras e índices | Armazena e recupera dados de veículos, motoristas, viagens, manutenções e ocorrências, preserva histórico via apagamento lógico (`ativo = true`) e executa consultas agregadas otimizadas. |

## Onde cada parte roda

Diagrama em `diagrams/implantacao.mmd`.

* **Nó Cliente (Navegador Web):** Executa o Frontend no computador do Gestor da Frota (operações administrativas e relatórios) e no smartphone do Motorista (consulta de viagens e reporte rápido de ocorrências via navegador mobile).
* **Nó Servidor de Aplicação:** Hospeda os arquivos estáticos do Frontend e o serviço de Backend (API REST) responsável pelo processamento das regras de negócio.
* **Nó Servidor de Banco de Dados:** Hospeda a instância **MySQL** dedicada ao armazenamento persistente e execução das consultas relacionais do sistema.

## Contrato da API

Operações em `contrato/operacoes.md`, exemplos em `contrato/exemplos/`.

Principais recursos expostos pelo Backend para atender ao backlog do **FrotaManager**:

* `POST /viagens` e `GET /viagens` — Agendamento, alocação de frota (`UC-01`) e listagem filtrada por perfil (`RN-04`).
* `POST /manutencoes` e `PATCH /manutencoes/{id}/concluir` — Registro de manutenção preventiva/corretiva e liberação do veículo (`RF-02`, `RN-02`).
* `POST /viagens/{id}/ocorrencias` — Reporte de imprevistos em rota pelo motorista (`HU-01`, `CA-01.2`).
* `GET /relatorios/operacional` — Consolidação de viagens e quilometragem por veículo e período (`RF-03`).

## Verificações

| Verificação | Frontend | Backend |
|---|---|---|
| Prazo e intervalo de datas (`UC-01`, `RF-02`, `RF-03`) | Mostra alerta visual e impede envio se `data_fim < data_inicio` | Decide e bloqueia intervalos inválidos (`400 Bad Request`) |
| Conflito de alocação de veículo/motorista (`RN-01`) | Filtra opções disponíveis nos seletores e exibe alerta de conflito | Decide verificando sobreposição de horários no banco (`409 Conflict`) |
| Bloqueio por veículo em manutenção (`RN-02`) | Oculta veículos com status *Em Manutenção* e exibe badge indicativo | Decide bloqueando alocação se houver manutenção ativa no período (`409 Conflict`) |
| Não regressão de odômetro (`RN-03`) | Sugere valor mínimo baseado na última leitura exibida na tela | Decide rejeitando qualquer odômetro menor que o `odometro_atual` (`422 Unprocessable Entity`) |
| Restrição de visualização do motorista (`RN-04`) | Exibe apenas a lista de viagens atribuídas ao motorista logado | Decide filtrando consultas pelo usuário autenticado e negando acesso indevido (`403 Forbidden`) |

## Qualidades e custos

| Qualidade | Requisito | Decisão | Custo aceito |
|---|---|---|---|
| Desempenho | `RNF-02`: Gerar relatórios consolidados em menos de 1,5s para bases com até 10.000 viagens | Criação de índices compostos em `Viagem` (`veiculo_id`, `data_saida`, `status`) e agregação direta via SQL no MySQL | Maior consumo de espaço em disco e leve sobrecarga nas operações de escrita (`INSERT`/`UPDATE`). |
| Usabilidade Mobile | `RNF-03`: Permitir que o motorista reporte uma ocorrência em no máximo 3 toques no celular | Adoção de Frontend Web Responsivo (*mobile-first*) com atalho direto no card da viagem ativa, dispensando aplicativo nativo | Necessidade de manter e testar layouts adaptáveis para diferentes resoluções dentro da mesma base de código web. |
| Manutenibilidade | Isolar regras críticas de disponibilidade sujeitas a evolução (`RN-01`, `RN-02`) | Encapsulamento da verificação de conflitos e bloqueios em uma camada de serviço dedicada no Backend (critério de Parnas) | Camada extra de indireção entre os controladores HTTP e o acesso ao banco de dados. |
| Auditabilidade | Preservar histórico legal de viagens, ocorrências e evolução do odômetro (`RN-03`) | Apagamento lógico (`ativo = false`) em todas as tabelas e registro de auditoria na tabela `HistoricoViagem` | Obrigatoriedade de incluir o filtro `WHERE ativo = true` em todas as consultas padrão e crescimento contínuo da base. |

## Decisões

| Id | Decisão | Motivo | Consequência aceita | Situação |
|---|---|---|---|---|
| D-01 | Validar conflitos de alocação (`RN-01`) e manutenção (`RN-02`) em módulo de serviço dedicado no Backend | Isolar regras de negócio críticas em um único ponto, facilitando manutenção e testes | Uma indireção a mais entre a rota/controlador e a camada de persistência | Aceita |
| D-02 | Implementar apagamento lógico (`ativo = false`) em todas as tabelas do MySQL | Preservar histórico operacional, logs de odômetro e comprovantes de viagens | Exige filtro `WHERE ativo = true` nas consultas de registros ativos | Aceita |
| D-03 | Bloquear estritamente qualquer regressão de odômetro no Backend (`RN-03`) | Garantir confiabilidade nos relatórios consolidados (`RF-03`) e evitar adulterações | Correções de erro de digitação exigem procedimento administrativo específico | Aceita |
| D-04 | Estruturar `Funcionario` e `Motorista` no banco usando tabela por subclasse | Evitar colunas nulas e permitir extensão futura para outros perfis (ex.: Gestor, Mecânico) | Exige junção (`JOIN`) para recuperar dados cadastrais completos do motorista | Aceita |
| D-05 | Adotar API RESTful desacoplada consumida por Frontend Web Responsivo | Atender tanto o Gestor (desktop) quanto o Motorista (celular) sobre o mesmo núcleo de domínio | Exige configuração de CORS, serialização JSON e tratamento de estados de rede no cliente | Aceita |

## Pontos em aberto

* Local de armazenamento dos arquivos e comprovantes enviados (ex.: anexos de ocorrências ou notas de manutenção): Capítulo 14.
* Identificação, autenticação e permissão nas operações (controle de sessão/token e diferenciação entre perfis Gestor e Motorista conforme `RN-04`): Capítulo 13.

## Histórico de revisão

* **2026-09-17:** Primeira versão, encontro 7.
* **2026-11-12:** Atualização completa com os dados do **FrotaManager** (responsabilidades, mapa de verificações `RN-01` a `RN-04`, requisitos de qualidade `RNF-02`/`RNF-03` e decisões `D-01` a `D-05`).