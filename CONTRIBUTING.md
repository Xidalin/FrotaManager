# Como Contribuir

Este guia reúne as práticas que a equipe adota para manter o repositório limpo e fácil de acompanhar. Leia antes de enviar qualquer alteração.

## 1. Criando branches

Cada tarefa deve ser desenvolvida em uma branch separada, criada a partir da `main` atualizada. Nomeie a branch assim:

```
feature/nome-da-funcionalidade
```

Passo a passo:

```bash
git checkout main
git pull
git checkout -b feature/nome-da-funcionalidade
```

## 2. Escrevendo commits

Prefira mensagens curtas e objetivas, que deixem claro o que foi feito. Use o verbo no presente.

Exemplo: `adiciona filtro de busca na listagem`

## 3. Enviando alterações com Pull Request

- A `main` não recebe commits diretos. Toda mudança chega até ela por meio de um Pull Request.
- No PR, indique qual item do backlog está sendo atendido.
- Antes do merge, pelo menos 1 outro integrante da equipe precisa revisar e aprovar o PR. Esse requisito faz parte da Definição de Pronto, descrita no [`PROCESSO.md`](PROCESSO.md).
