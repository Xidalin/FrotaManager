# Projeto

## Modelo de domínio

Diagrama em `diagrams/dominio.mmd`.

| Classe | Origem no REQUISITOS.md | Observação |
|---|---|---|
| Funcionario | Extensão | Superclasse para abarcar os colaboradores da empresa. |
| Motorista | RF-01, HU-01 | Especialização de Funcionario (herda cpf, nome). |
| Veiculo | RF-01 | Mantém o status `disponivel` para evitar conflito na alocação. |
| Viagem | UC-01 | Contém o `ENUM_SITUACAO` e as datas para validar a RN-01. |
| Manutencao | RF-02 | Afeta a disponibilidade do Veiculo durante o período ativo. |
| Ocorrencia | HU-01.2 | Eventos reportados pelo Motorista durante a Viagem. |
| HistoricoViagem | Extensão | Log de acompanhamento das alterações de status da Viagem. |

## Modelo de dados

Diagrama em `diagrams/dados.mmd`.

* **Estratégia de identidade:** Chave artificial (`id_pk`) em todas as tabelas, mantendo as chaves naturais (CPF, CNH, Placa, Email) apenas como restrição de unicidade (UK) para evitar acoplamento do banco com regras externas.
* **Apagamento:** Lógico, implementado através da coluna `ativo boolean` em todas as tabelas, pois cadastros e históricos de viagem servem de prova operacional e não podem ser apagados em cascata.
* **Tempo:** Utilização de `timestamp` para controle exato de horários nas viagens e logs, e `date` para início de contratos e manutenções, visando suportar a validação de conflitos de alocação (RN-01).
* **Generalização:** A separação entre Funcionario e Motorista adota a estratégia de *uma tabela por subclasse*, evitando colunas nulas no banco e centralizando os dados comuns na tabela genérica.

## Histórico de revisão
2026-09-23: Criação inicial do modelo de domínio e de dados.
