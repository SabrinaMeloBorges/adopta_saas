# Adopta — Design System

## 1. Princípios de design

1. **Acolher antes de tudo.** Cada decisão de UI privilegia tom humano, copy em primeira pessoa do pet quando possível, e estética que lembra revista, não app corporativo.
2. **Material Design 3 Expressive como base.** Aproveitamos M3 (tokens de sistema, componentes Angular Material) mas variamos formas dos cards, usamos springs em animações e tipografia mista.
3. **Sem cara de site gerado por IA.** Evitamos gradientes mesh, blobs sem propósito, copy genérica, três-cards-de-features. Privilegiamos foto grande, layout assimétrico, microcopy escrita.
4. **Responsividade real.** Mobile-first em todos os componentes, breakpoints alinhados ao conteúdo (não ao device).
5. **Acessibilidade não é checklist.** Contraste sempre AA, navegação por teclado, `prefers-reduced-motion`.

---

## 2. Paleta de cores

### Cores primárias (warm)
| Token | Hex | Uso |
|-------|-----|-----|
| `--cor-vermelho` | `#FA5C5C` | Botão primário, links, destaque |
| `--cor-laranja` | `#FD8A6B` | Acento secundário, ícones |
| `--cor-pessego` | `#FEC288` | Backgrounds quentes, hover states |
| `--cor-amarelo` | `#FBEF76` | Highlights, seleção de texto |

### Neutros quentes
| Token | Hex | Uso |
|-------|-----|-----|
| `--cor-fundo` | `#FFF8F0` | Background principal |
| `--cor-fundo-alt` | `#FBEFE0` | Seções alternadas, inputs |
| `--cor-superficie` | `#FFFFFF` | Cards |
| `--cor-texto` | `#2B1810` | Texto principal (marrom-café) |
| `--cor-texto-sec` | `#7A5C4E` | Texto secundário |
| `--cor-borda` | `#F0E0D0` | Bordas sutis |

### Semânticas
| Token | Hex | Significado |
|-------|-----|-------------|
| `--cor-sucesso` | `#A8C97A` | Adotado, aprovado |
| `--cor-aviso` | `#F0B040` | Em processo, pendente |
| `--cor-erro` | `#E04848` | Erro, rejeição |
| `--cor-info` | `#6B9BCC` | Informacional, concluído |

---

## 3. Tipografia

- **Display / títulos / nomes de pets**: `Fraunces` (serifa moderna, variável)
- **UI / corpo**: `Inter` (sans-serif neutra, com excelente legibilidade)
- Hierarquia de tamanhos: 0.75rem → 4rem em uma escala personalizada (`--tamanho-xs` a `--tamanho-4xl`)
- Pesos: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- Altura de linha: 1.15 (apertada — títulos), 1.5 (normal), 1.75 (solta — leitura corrida)

---

## 4. Espaçamento

Escala de 4px, exposta como variáveis CSS (`--esp-1` a `--esp-9`).

| Token | Pixels |
|-------|--------|
| `--esp-1` | 4px |
| `--esp-2` | 8px |
| `--esp-3` | 12px |
| `--esp-4` | 16px |
| `--esp-5` | 24px |
| `--esp-6` | 32px |
| `--esp-7` | 48px |
| `--esp-8` | 64px |
| `--esp-9` | 96px |

---

## 5. Raios e formas (M3 Expressive)

A variedade de cantos é proposital — M3 Expressive joga com formas variadas pra criar ritmo visual.

| Token | Valor | Uso |
|-------|-------|-----|
| `--raio-sm` | 8px | Inputs pequenos |
| `--raio-md` | 16px | Cards padrão |
| `--raio-lg` | 24px | Cards destaque |
| `--raio-xl` | 32px | Cards hero |
| `--raio-pill` | 999px | Chips, botões, avatares |

Cards de pet rotacionam entre 4 variantes de canto (atributo `data-variante`) pra evitar uniformidade.

---

## 6. Movimento

### Easings
| Token | Função | Uso |
|-------|--------|-----|
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Entradas alegres, hover de cards |
| `--ease-suave` | `cubic-bezier(0.4, 0, 0.2, 1)` | Transições padrão M3 |
| `--ease-saida` | `cubic-bezier(0.4, 0, 1, 1)` | Saídas |
| `--ease-entrada` | `cubic-bezier(0, 0, 0.2, 1)` | Entradas |

### Durações
- Rápida: 150ms (hover, focus)
- Média: 280ms (entrada de elementos, transição entre rotas)
- Longa: 450ms (springs, micro-celebrações)

### View Transitions API
Transições entre rotas usam `provideRouter(routes, withViewTransitions())` pra fade + subida discreta. Respeitam `prefers-reduced-motion`.

---

## 7. Componentes principais

| Componente | Variações |
|------------|-----------|
| **Botão** | Primário (vermelho), Secundário (pêssego), Fantasma (outline) — em tamanhos normal e pequeno |
| **Cartão de pet** | 4 variantes de forma (cantos diferentes), com foto, badge de status, tags, ações |
| **Badge de status** | disponível (verde), em processo (amarelo), adotado (azul) |
| **Chips de filtro** | Toggle visual com estado ativo |
| **Inputs** | Background warm, borda discreta, focus ring com `--sombra-foco` |
| **Tag** | Pill arredondado, variantes vermelho/laranja/pessego/amarelo/semânticas |

---

## 8. Componentes não-óbvios

- **Sublinhado manual** (`.sublinhado-manual`): SVG inline com linha torcida desenhada à mão, aplicada em palavras-chave de hero. Evita "linha reta de IA".
- **Pegadas no hero**: SVG decorativo com pegadas em padrão diagonal, anima entrada da direita pra esquerda.
- **Empty states**: ícone + título + frase + CTA, sempre acolhedores ("Ainda sem favoritos" em vez de "Sem resultados").
- **Microcopy do pet**: nomes podem incluir frases (ex: "Cachorro sem nome", "Tô esperando há 3 meses").

---

## 9. Layout responsivo

| Breakpoint | Comportamento |
|-----------|---------------|
| ≥ 1200px | Container central de 1200px |
| 900–1199px | Container fluido, 2 colunas no detalhe |
| 768–899px | 1 coluna na maioria; menu hamburger entra |
| < 768px | Mobile, stacking total, sticky filters desligado |

---

## 10. Implementação

Tudo está em `frontend/src/styles/`:
- `_tokens.scss` — variáveis CSS (carregadas em `:root`)
- `_typography.scss` — imports de fontes + classes base
- `_animations.scss` — keyframes globais
- `_layout.scss` — helpers (container, secao, botao, tag, estado-vazio)
- `styles.scss` — entrada, importa tudo, define o tema Material M3 com paleta warm

Os componentes Angular **não usam cores hardcoded**: tudo passa pelas variáveis CSS. Isso permite ajuste centralizado e potencial dark mode futuro.
