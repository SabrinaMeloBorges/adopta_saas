# Adopta — User Stories

Exigência: mínimo de 5 user stories. Entregamos 12, cobrindo os principais fluxos.

---

## Visitante (não autenticado)

**US01 — Filtrar pets por porte e cidade**
> Como visitante, quero filtrar pets por porte e cidade pra ver apenas os que cabem na minha realidade.
**Critério de aceite:** os filtros são aplicados em tempo real (debounce de 250ms); a quantidade total de resultados é exibida; a URL pode ser compartilhada.

**US02 — Buscar por nome ou raça**
> Como visitante, quero buscar por nome ou raça quando já vi o pet em outro lugar.
**Critério de aceite:** campo de busca aceita texto livre; a busca é case-insensitive; resultados são atualizados automaticamente.

**US03 — Favoritar sem criar conta**
> Como visitante, quero favoritar pets sem precisar criar conta pra não perder os que gostei.
**Critério de aceite:** o estado de favorito é salvo no navegador (localStorage); a página de favoritos exibe todos os salvos; é possível esvaziar a lista.

**US04 — Ver ficha de vacinação completa**
> Como visitante, quero ver a ficha de vacinação completa pra entender o estado de saúde do pet.
**Critério de aceite:** a tabela exibe nome da vacina, data de aplicação, próxima dose e observações; pets sem vacinação registrada exibem aviso.

**US05 — Ver pets já adotados (histórias felizes)**
> Como visitante, quero ver histórias de pets já adotados pra me sentir confiante com o projeto.
**Critério de aceite:** página "/adotados" lista pets com status="adotado"; cartões mantém a estética acolhedora.

**US06 — Acompanhar histórias adotadas na home**
> Como visitante, quero ver uma seção de histórias felizes na home pra ser apresentado ao projeto.
**Critério de aceite:** a home exibe até 3 pets adotados quando há histórias disponíveis.

---

## Adotante autenticado

**US07 — Solicitar adoção com mensagem personalizada**
> Como adotante cadastrado, quero solicitar adoção e contar sobre minha realidade pra aumentar a chance de ser escolhido.
**Critério de aceite:** o formulário valida mínimo de 10 caracteres; impede dupla solicitação ativa; envia confirmação visual.

**US08 — Acompanhar status das solicitações**
> Como adotante, quero acompanhar o status das minhas solicitações pra saber em que pé está.
**Critério de aceite:** página "/minhas-solicitacoes" lista todas com status (pendente, aprovada, rejeitada, concluída) e a resposta do admin quando houver.

**US09 — Receber resposta personalizada do admin**
> Como adotante, quero ler a resposta do admin sobre minha solicitação pra entender por que foi aprovada ou recusada.
**Critério de aceite:** resposta exibida em destaque, com formatação clara, dentro do card da solicitação.

---

## Admin (ONG / abrigo)

**US10 — Cadastrar pet com múltiplas fotos**
> Como admin, quero cadastrar pets com várias fotos e ficha completa pra atrair mais interessados.
**Critério de aceite:** upload de N imagens, armazenadas em base64; preview de cada foto; possibilidade de remover antes de salvar.

**US11 — Gerenciar solicitações em fluxo único**
> Como admin, quero ver todas as solicitações pendentes em destaque pra responder rápido.
**Critério de aceite:** página "/admin/solicitacoes" com filtro por status; ações de aprovar/rejeitar/concluir com resposta opcional; ao aprovar, o pet vai pra "em processo" automaticamente.

**US12 — Visualizar indicadores do dia**
> Como admin, quero ver indicadores rápidos no dashboard pra saber onde focar.
**Critério de aceite:** o dashboard exibe contadores de pets por status e quantidade de solicitações pendentes/aprovadas; cada card é clicável e leva pra listagem correspondente.
