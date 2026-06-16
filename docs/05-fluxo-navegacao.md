# Adopta — Fluxo de Navegação

## Mapa do site

```
/ (Home)
├── /pets ............................ Listagem com filtros
│   └── /pets/:id .................... Detalhe do pet
│       └── (CTA "Quero adotar") ..... Solicitar adoção (autenticado)
├── /favoritos ...................... Favoritos do navegador
├── /adotados ....................... Histórias felizes
├── /sobre .......................... Sobre o projeto
├── /login .......................... Entrar
├── /registrar ...................... Cadastro de adotante
├── /minhas-solicitacoes ............ (autenticado) Solicitações próprias
└── /admin .......................... (admin) Painel
    ├── /admin/pets ................. CRUD de pets
    ├── /admin/pets/novo ............ Cadastrar pet
    ├── /admin/pets/:id/editar ...... Editar pet
    └── /admin/solicitacoes ......... Gestão de solicitações
```

---

## Fluxos principais

### Fluxo 1 — Adotar um pet (visitante → adotante)

```
[Home] ──► [/pets] ──► (filtra) ──► [/pets/:id]
                                       │
                                       ├──► (Favoritar) ──► localStorage
                                       │
                                       └──► (Quero adotar)
                                              │
                                              ├──► (não logado) ──► [/login] ──► [/registrar]?
                                              │                       │
                                              │                       └──► auto-volta pra [/pets/:id]
                                              │
                                              └──► (logado) ──► formulário ──► POST /solicitacoes
                                                                                  │
                                                                                  └──► [/minhas-solicitacoes]
```

### Fluxo 2 — Cadastrar um pet (admin)

```
[/admin] ──► [/admin/pets] ──► (botão "Novo pet") ──► [/admin/pets/novo]
                                                          │
                                                          ├── preenche dados
                                                          ├── upload de fotos (base64)
                                                          ├── adiciona vacinas
                                                          ├── adiciona tags
                                                          │
                                                          └──► POST /pets ──► [/admin/pets]
```

### Fluxo 3 — Responder uma solicitação (admin)

```
[/admin] ──► [/admin/solicitacoes] ──► (filtra "pendentes") ──► card de solicitação
                                                                   │
                                                                   ├──► (Aprovar) ──► PATCH status=aprovada
                                                                   │                        │
                                                                   │                        └──► pet vira "em_processo"
                                                                   │
                                                                   ├──► (Rejeitar) ──► PATCH status=rejeitada
                                                                   │                        │
                                                                   │                        └──► (se única ativa) pet volta a "disponivel"
                                                                   │
                                                                   └──► (Concluir) ──► PATCH status=concluida
                                                                                            │
                                                                                            └──► pet vira "adotado"
```

---

## Estados do pet

```
┌──────────────┐    aprovar       ┌──────────────┐    concluir    ┌──────────┐
│  disponivel  │ ───────────────► │ em_processo  │ ─────────────► │ adotado  │
└──────────────┘                  └──────────────┘                └──────────┘
        ▲                                │
        │                                │
        └────────────────────────────────┘
              rejeitar (se única ativa)
```

---

## Decisões de UX importantes

- **Favoritos sem login**: reduz fricção. Persistido em `localStorage`.
- **Autenticação só para solicitação de adoção**: ninguém precisa criar conta só pra olhar.
- **Loading com microcopy**: animação de patinha + frases ("Trazendo os bichinhos…").
- **Empty states acolhedores**: "Ainda sem favoritos" em vez de "Sem resultados".
- **Confirmação destrutiva**: deletar pet ou esvaziar lista pedem confirmação via `confirm()`.
- **View Transitions** entre rotas: fade + subida discreta, respeitando preferência de movimento reduzido.
