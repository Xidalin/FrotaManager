# Requisitos do Sistema

## Glossário do domínio
| Termo | Definição | Fonte |
|---|---|---|
| Frota | Conjunto de veículos pertencentes ou gerenciados pela empresa para transporte e logística. | N1 |
| Alocação | Ato de vincular/associar um veículo e um motorista a uma determinada rota ou viagem. | N3 |
| Conflito de Alocação | Tentativa de alocar um veículo ou motorista que já possui outra viagem agendada para o mesmo período ou que está indisponível (ex.: em manutenção). | N3 |
| Manutenção Preventiva | Revisão ou conserto agendado previamente para evitar falhas no veículo. | N4 |
| Manutenção Corretiva | Reparo realizado após a identificação de um problema, falha ou avaria no veículo. | N4 |
| Ocorrência | Evento atípico reportado pelo motorista durante a viagem (ex.: pneu furado, imprevisto na pista, acidente). | N5 |
| Odômetro / Quilometragem | Registro da distância percorrida pelo veículo em quilômetros (km). | N6 |

---

## Backlog ordenado
| Ordem | Item | Tipo | Origem | MoSCoW | Risco | Depende de |
|---:|---|---|---|---|---|---|
| 1 | RF-01 Cadastro de Veículos e Motoristas | Req. Funcional | N1 | Obrigatório | Médio | — |
| 2 | UC-01 Agendar Viagem e Alocar Frota | Caso de Uso | N2, N3 | Obrigatório | Alto | RF-01 |
| 3 | HU-01 Visualização e Reporte pelo Motorista | História de Usuário | N5 | Obrigatório | Baixo | UC-01 |
| 4 | RF-02 Controle e Registro de Manutenções | Req. Funcional | N4 | Obrigatório | Médio | RF-01 |
| 5 | RF-03 Consolidação de Relatórios Operacionais | Req. Funcional | N6 | Desejável | Baixo | UC-01, RF-02 |

---

## Requisitos Funcionais (RF)

### RF-01 Cadastro de Veículos e Motoristas
- **Descrição:** O sistema deve permitir o cadastramento, edição e inativação de veículos (placa, modelo, marca, ano, quilometragem inicial) e de motoristas (nome, CPF, CNH, categoria e status).
- **Entradas:** Dados cadastrais do ativo ou motorista.
- **Saídas:** Confirmação do cadastro ou erro por duplicidade de Placa/CNH.
- **Critério de Aceitação:** Não permitir cadastro de placas ou CNHs duplicadas na base de dados.
- *[Origem: N1]*

### RF-02 Controle e Registro de Manutenções
- **Descrição:** O sistema deve registrar manutenções preventivas e corretivas, atualizando a situação operacional do veículo.
- **Entradas:** Placa do veículo, tipo de manutenção (preventiva/corretiva), data de início, previsão de término e observações.
- **Saídas:** Atualização automática do status do veículo para "Em Manutenção" durante o período e alteração para "Disponível" após a conclusão.
- *[Origem: N4]*

### RF-03 Consolidação de Relatórios Operacionais
- **Descrição:** O sistema deve gerar relatórios parametrizados por período (data início e data fim) e por veículo, consolidando a quilometragem total percorrida e a quantidade de viagens realizadas.
- **Entradas:** Filtro de período e seleção de veículo.
- **Saídas:** Relatório operacional em tela.
- *[Origem: N6]*

---

## Histórias de Usuário (HU) e Critérios de Aceitação

### HU-01 Visualização de Viagens e Reporte de Ocorrências pelo Motorista
**Como** Motorista (Roberto),  
**Quero** visualizar minhas viagens agendadas no celular e registrar ocorrências diretamente no sistema,  
**Para** informar a gestão de forma rápida sobre imprevistos na rota sem burocracia.  
*[Origem: N5]*

- **CA-01.1 (Visualização Simplificada):**  
  **Dado** que o motorista faz login pelo celular,  
  **Quando** acessar a tela principal,  
  **Então** deve visualizar apenas a lista das suas viagens (agendadas, em andamento e concluídas).

- **CA-01.2 (Envio de Ocorrência):**  
  **Dado** que o motorista está em uma viagem ativa,  
  **Quando** selecionar "Reportar Ocorrência", preencher o tipo e a descrição e clicar em "Enviar",  
  **Então** o sistema deve registrar a ocorrência vinculada à viagem e sinalizar para o gestor.

---

## Casos de Uso (UC)

### UC-01 Agendar Viagem e Alocar Frota
- **Ator principal:** Gestor de Frota (Carlos)
- **Pré-condições:** Veículo e Motorista cadastrados e com status "Disponível".
- **Pós-condições:** Viagem salva no sistema e recursos vinculados à rota.

#### Fluxo Principal
1. O Gestor acessa a tela de agendamento de viagens.
2. O Gestor preenche origem, destino, data/hora de saída e previsão de chegada.
4. O Gestor confirma a alocação.
5. O sistema valida se não há conflitos de horário (RN-01) ou manutenção (RN-02).
6. O sistema salva a viagem e confirma a operação.

#### Fluxos Alternativos
- **FA-01 (Conflito de Horário):** No passo 5, se o veículo ou motorista já estiver alocado em outra viagem no mesmo horário, o sistema exibe alerta de conflito e exige a troca do recurso.
- **FA-02 (Veículo em Manutenção):** No passo 5, se o veículo estiver em manutenção no período selecionado, o sistema impede a alocação e solicita a seleção de outro veículo disponível.

---

## Requisitos Não Funcionais (RNF)

| ID | Requisito | Critério de Aceitação / Medição |
|---|---|---|
| **RNF-01** | **Responsividade Web** | O layout deve se adaptar a telas de desktop e smartphones. Em dispositivos móveis (3G/4G), o tempo de carregamento inicial não deve ultrapassar 2 segundos. |

| **RNF-02** | **Desempenho de Consultas** | As buscas de disponibilidade e relatórios devem responder em menos de 1,5 segundo para bases com até 10.000 viagens. |
| **RNF-03** | **Usabilidade Mobile** | O fluxo de reporte de ocorrências pelo motorista deve ser concluído em no máximo 3 toques a partir da tela inicial. |
| **RNF-04** | **Compatibilidade** | A aplicação deve funcionar perfeitamente nos navegadores Chrome, Firefox, Edge e Safari em suas versões atuais. |

---


## Restrições (RE) e Regras de Negócio (RN)

### Restrições (RE)
- **RE-01:** O backend deve ser desenvolvido utilizando **Node.js** e o banco de dados relational **MySQL**. [Origem: Risco R1]
- **RE-02:** O frontend deve ser construído em **HTML, CSS e JavaScript** padrão (Web Responsivo), sem o desenvolvimento de aplicativos nativos (iOS/Android) nesta fase. [Origem: Fora de Escopo]
- **RE-03:** O sistema não possuirá rastreamento GPS em tempo real nem rotinas de cálculo financeiro/contábil nesta versão. [Origem: Fora de Escopo]

### Regras de Negócio (RN)
- **RN-01 (Bloqueio de Conflito de Alocação):** Um veículo ou motorista não pode estar associado a mais de uma viagem no mesmo intervalo de data e horário. [Origem: N3]
- **RN-02 (Indisponibilidade por Manutenção):** Veículos com registros de manutenção pendentes ou em andamento não podem ser alocados em novas viagens. [Origem: N4]
- **RN-03 (Consistência de Odômetro):** A quilometragem informada ao fim de uma viagem ou manutenção nunca pode ser menor do que o último valor registrado no veículo. [Origem: N6 / Validação V1]
- **RN-04 (Privilégio de Acesso por Perfil):** O perfil "Motorista" possui permissão restrita para visualizar apenas as suas próprias viagens e registrar ocorrências, sem acesso a dados da frota completa ou relatórios. [Origem: N5]

---

## Validações realizadas
### V1 — 2026-09-01, com equipe de Engenharia e Gestão Logística (perfil de Carlos e Roberto)
| Achado | Efeito | Item alterado |
|---|---|---|
| Identificada a necessidade de travar o odômetro para evitar valores incorretos inseridos por engano. | Adicionada regra de validação que impede odômetro menor que o atual. | **RN-03** incluída nas Regras de Negócio. |
| Motoristas relataram necessidade de usabilidade simples no celular sem funções desnecessárias. | Ajustado escopo de acesso do perfil motorista e restringido fluxo de navegação a poucos toques. | **HU-01**, **RNF-03** e **RN-04** ajustados. |
| Confirmado que a checagem de sobreposição de horários é a maior causadora de custos na operação atual. | Detalhado o fluxo de alocação no caso de uso principal. | **UC-01** criado com fluxos alternativos detalhados. |

---

## Histórico de revisão
- **2026-09-03:** Linha de base do marco 1 criada a partir da reestruturação e diversificação do escopo técnico.
