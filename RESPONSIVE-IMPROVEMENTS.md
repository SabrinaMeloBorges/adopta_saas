# 📱 Guia de Responsividade - Adopta Project

## ✅ Aplicado

- [x] `_layout.scss` - Sistema de breakpoints com mixins
- [x] `dashboard.scss` - Dashboard fully responsive (mobile-first)
- [x] `login.scss` - Início da otimização (continuar abaixo)

## 🔄 Próximas Telas para Otimizar

### 1. **Tela de Login** (continuar)
Adicionar ao `.form-auth`:
- Responsive gap
- Font-size: 1rem em inputs (previne zoom iOS)
- Melhor padding mobile

### 2. **Pet List** (`pets-lista.scss`)
- Grid 1 coluna em mobile
- Grid 2 colunas em tablet (640px)
- Grid 3-4 colunas em desktop (1024px)
- Sidebar lateral desaparece em mobile (<768px)

### 3. **Admin Pets CRUD** (`pets-crud.scss`)
- Tabela vira cards em mobile
- Botões de ação inline em desktop, stacked em mobile

### 4. **Pet Formulário** (`pet-formulario.scss`)
- Campos em full-width mobile
- Grid 2 colunas em tablet
- Inputs com min font 1rem (iOS)

### 5. **Home & Páginas Gerais**
- Tipografia responsiva com `clamp()`
- Padding e margin escalonado por breakpoint

---

## 📋 Breakpoints Usados

```scss
@mixin sm { @media (min-width: 480px) { @content; } }
@mixin md { @media (min-width: 640px) { @content; } }
@mixin lg { @media (min-width: 768px) { @content; } }
@mixin xl { @media (min-width: 1024px) { @content; } }
@mixin 2xl { @media (min-width: 1280px) { @content; } }
```

---

## 🎯 Padrões a Seguir

### Tipografia com clamp()
```scss
font-size: clamp(1.5rem, 5vw, var(--tamanho-3xl));
```

### Padding Responsivo
```scss
padding: var(--esp-4); // mobile
@include md { padding: var(--esp-6); } // tablet+
```

### Grid Responsivo
```scss
grid-template-columns: 1fr; // mobile
@include sm { grid-template-columns: repeat(2, 1fr); }
@include xl { grid-template-columns: repeat(4, 1fr); }
```

### Input Mobile-Safe
```scss
input {
  font-size: 1rem; // Previne zoom iOS
  box-sizing: border-box;
}
```

---

## 📝 Próxima Ação

Executar em `adopta/` ou `frontend/`:
```bash
git add .
git commit -m "feat: melhorar responsividade mobile-first"
git push
```

Depois aplicar mudanças nas próximas telas seguindo os padrões acima!
