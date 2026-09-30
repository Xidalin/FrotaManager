# Como Contribuir

Este guia reúne as práticas que a equipe adota para manter o repositório limpo, rastreável e fácil de acompanhar. Leia antes de enviar qualquer alteração.

## 0. Configuração inicial (uma vez por máquina)

O nome e o e-mail abaixo são os que aparecem no histórico. Use sempre os mesmos, em todas as máquinas:

```bash
git config --global user.name "Seu Nome Completo"
git config --global user.email "seu.email@mail.uft.edu.br"
```

## 1. Fluxo de uma contribuição

1. Todo trabalho nasce de um item do backlog (`REQUISITOS.md`) registrado como **issue** no GitHub.
2. Crie um ramo a partir do `main` atualizado.
3. Faça commits pequenos e coerentes.
4. Abra um **pull request** vinculado à issue.
5. Outro integrante revisa e aprova.
6. O autor integra no `main` e remove o ramo.

**O `main` não recebe commits diretos**, nem pelo editor web do GitHub. Se o `main` quebrar, corrigir isso tem prioridade sobre qualquer outra tarefa.

## 2. Ramos

Crie sempre a partir do `main` atualizado, com um prefixo por tipo de trabalho:

| Prefixo | Uso | Exemplo |
|---|---|---|
| `feature/` | Funcionalidade nova | `feature/cadastro-de-veiculos` |
| `fix/` | Correção de defeito | `fix/validacao-de-placa` |
| `docs/` | Documentação e diagramas | `docs/caso-de-uso-uc02` |
| `chore/` | Configuração e manutenção do repositório | `chore/gitignore` |

```bash
git switch main
git pull
git switch -c feature/nome-da-funcionalidade
```

Ramos devem durar **dias, não semanas**. Quanto mais tempo separado do `main`, mais difícil a integração.

## 3. Commits

Adotamos o [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/):

```
tipo(escopo): resumo no imperativo

Corpo opcional explicando POR QUE a mudança foi feita,
quando isso não for óbvio pelo código.

Refs #12
```

- **Tipos:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.
- **Resumo:** curto, no imperativo, sem ponto final. Ex.: `feat(viagem): bloquear alocação de veículo em manutenção`.
- **Referência à issue:** `Refs #n` em commits intermediários; `Closes #n` no commit ou PR que conclui o item.
- **Um commit, uma mudança:** não misture correção, funcionalidade e ajuste de formatação no mesmo commit.
- Evite mensagens como `Update README.md`, `ajustes`, `wip` ou `Add files via upload`.

## 4. Pull requests

**Antes de abrir:**
- O ramo está atualizado com o `main` (`git pull origin main`) e sem conflitos.
- O PR trata de **um único item de backlog** e é pequeno o bastante para ser revisado em 15–20 minutos.

**Na descrição do PR:**
- Qual issue/item de backlog atende (`Closes #n`).
- O que muda e como verificar (como testar ou onde olhar).

**Revisão:**
- Pelo menos **1 integrante diferente do autor** revisa e aprova.
- Prazo esperado para a primeira revisão: **até 24 horas**.
- O revisor comenta ao menos um ponto antes de aprovar.
- Discussões técnicas ficam registradas **no PR**, não apenas no grupo de mensagens.

**Integração:**
- Após a aprovação, o **autor** faz o merge e apaga o ramo.

## 5. Divergência técnica

Discordar de uma decisão técnica é normal. Quando a discussão no PR não chegar a acordo em **dois turnos de comentários**:

- Decide **<nome do integrante responsável pela decisão técnica>**.
- A decisão e o motivo ficam registrados como comentário no próprio PR.

## 6. O que não entra no repositório

- Dependências e artefatos gerados (`node_modules/`, `build/`, `dist/`).
- Configuração local da máquina.
- **Segredos**: senhas, tokens, chaves de API, credenciais do MySQL. Eles ficam no arquivo `.env`, que é ignorado pelo Git. O arquivo `.env.example`, **sem valores reais**, documenta quais variáveis existem.

Se um segredo for enviado ao repositório por engano, **troque a credencial imediatamente** e avise a equipe. Apagar o arquivo em outro commit não resolve: ele continua no histórico.

## 7. Versões

- Cada entrega relevante recebe uma **tag anotada** no formato `vMAJOR.MINOR.PATCH` (versionamento semântico).
- Antes de criar a tag, o `CHANGELOG.md` é atualizado e integrado ao `main` por PR.
- Tags publicadas não são movidas nem apagadas; se algo mudar, cria-se uma nova versão.

```bash
git switch main
git pull
git tag -a v0.2.0 -m "Descrição da versão"
git push origin v0.2.0
```

## 8. Definição de pronto

Um item só é considerado concluído quando:

- O critério de aceitação do item foi atendido.
- O PR foi revisado e aprovado por outro integrante e integrado ao `main`.
- A issue foi fechada e está vinculada ao PR.

Esta lista cresce ao longo do semestre (testes automatizados, verificação de estilo) e deve ser mantida igual à do [`PROCESSO.md`](PROCESSO.md).
