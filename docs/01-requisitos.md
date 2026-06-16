# Adopta — Requisitos

## 1. Definição do problema

No Brasil há aproximadamente 30 milhões de animais em situação de rua ou em abrigos saturados. ONGs e protetores enfrentam dificuldades pra **divulgar** os pets que precisam de adoção, **organizar** fichas de saúde e **filtrar** solicitações de pessoas interessadas. Do outro lado, adotantes em potencial não têm um canal único, acolhedor e organizado pra encontrar o pet certo pra sua realidade.

**Adopta** é uma plataforma web que conecta esses dois lados: ONGs/abrigos cadastram pets com ficha completa e adotantes navegam, favoritam e solicitam adoção.

## 2. Público-alvo

| Perfil | Perfil resumido |
|--------|-----------------|
| **Adotantes em potencial** | Pessoas (jovens adultas até idosas) interessadas em adotar um pet, com acesso a internet, dispostas a passar por um processo simples mas responsável de adoção. |
| **ONGs, abrigos e protetores individuais** | Pessoas/instituições que cuidam de pets resgatados e precisam divulgar pra adoção. |

## 3. Proposta de solução

Sistema web completo (Angular + Express + MySQL + Docker) com:
- Vitrine pública de pets disponíveis, com filtros, busca, página de detalhes e ficha de vacinação completa.
- Cadastro de adotantes para enviar solicitações de adoção.
- Painel administrativo (ONG/abrigo) com CRUD de pets, upload de fotos (base64) e gestão de solicitações.
- Estética acolhedora, animações intencionais, design baseado em Material Design 3 Expressive.

---

## 4. Requisitos funcionais

### Visitante (não autenticado)
- **RF01** — O sistema deve permitir listar pets disponíveis, com filtros por espécie, porte, sexo, cidade e status.
- **RF02** — O sistema deve permitir busca textual por nome ou raça do pet.
- **RF03** — O sistema deve exibir página de detalhes do pet com galeria de fotos, ficha completa (incluindo vacinação) e personalidade.
- **RF04** — O sistema deve permitir favoritar pets sem necessidade de cadastro (persistência local no navegador).
- **RF05** — O sistema deve exibir uma galeria pública de pets já adotados (histórias felizes).
- **RF06** — O sistema deve permitir cadastro de adotante (nome, e-mail, senha, telefone, cidade, estado).

### Adotante autenticado
- **RF07** — O sistema deve permitir login com e-mail e senha.
- **RF08** — O sistema deve permitir solicitar adoção de um pet disponível, mediante mensagem do adotante.
- **RF09** — O sistema deve permitir ao adotante visualizar suas solicitações com o respectivo status (pendente, aprovada, rejeitada, concluída).
- **RF10** — O sistema deve impedir o adotante de enviar mais de uma solicitação ativa para o mesmo pet.

### Admin (ONG / abrigo)
- **RF11** — O sistema deve permitir login de admin com permissões diferenciadas.
- **RF12** — O sistema deve permitir CRUD completo de pets (criar, ler, atualizar, deletar).
- **RF13** — O sistema deve permitir upload de múltiplas fotos por pet (armazenadas em base64 no banco).
- **RF14** — O sistema deve permitir cadastro de vacinas por pet (nome, data, próxima dose, observações).
- **RF15** — O sistema deve permitir associar tags de temperamento a cada pet.
- **RF16** — O sistema deve permitir listar todas as solicitações pendentes.
- **RF17** — O sistema deve permitir alterar o status de uma solicitação (aprovar, rejeitar, concluir) e enviar resposta ao adotante.
- **RF18** — O sistema deve atualizar automaticamente o status do pet conforme o ciclo da solicitação (disponível → em processo → adotado).
- **RF19** — O sistema deve exibir um painel com indicadores (pets disponíveis, em processo, adotados; solicitações pendentes).

---

## 5. Requisitos não funcionais

- **RNF01** — A aplicação deve ser responsiva (desktop e mobile, mínimo 360px de largura).
- **RNF02** — Tempo de resposta da API < 500ms para listagens com até 50 pets.
- **RNF03** — Senhas devem ser armazenadas com hash bcrypt (custo ≥ 10).
- **RNF04** — Autenticação via JWT (HS256), com expiração configurável (padrão 7 dias).
- **RNF05** — A aplicação deve ser executável via `docker compose up` após o clone, sem etapas manuais adicionais.
- **RNF06** — Suporte aos navegadores Chrome, Edge, Firefox e Safari nas duas últimas versões major.
- **RNF07** — Acessibilidade básica: contraste mínimo WCAG AA, navegação por teclado, labels em campos de formulário.
- **RNF08** — Respeito a `prefers-reduced-motion` (animações desligadas pra usuários com essa preferência).
- **RNF09** — Imagens de pets armazenadas em base64 no MySQL (campo LONGTEXT).
- **RNF10** — Toda a interface em português brasileiro.

---

## 6. Regras de negócio

- **RN01** — Um pet com status **adotado** não pode receber novas solicitações.
- **RN02** — Um adotante não pode ter mais de uma solicitação **ativa** (pendente ou aprovada) para o mesmo pet.
- **RN03** — Quando uma solicitação é **aprovada**, o pet correspondente é automaticamente movido para o status **em processo**.
- **RN04** — Quando uma solicitação é **concluída**, o pet é automaticamente movido para o status **adotado**.
- **RN05** — Quando uma solicitação é **rejeitada**, o sistema verifica se o pet possui outras solicitações ativas; se não, o pet volta para **disponível**.
- **RN06** — Apenas usuários com papel `admin` podem criar/editar/deletar pets e alterar status de solicitações.
- **RN07** — A mensagem de solicitação de adoção deve ter no mínimo 10 caracteres.
- **RN08** — Pets sem nome cadastrado são exibidos com placeholder ("Cachorro sem nome", "Gatinho sem nome").
- **RN09** — A ficha de vacinação é opcional, mas o pet exibe um aviso quando alguma vacina importante está faltando (V8/V10, antirrábica).
- **RN10** — Adoção é sempre gratuita; o sistema não processa pagamentos.
