# Konsi Design System

Documentação estática do Design System da Konsi — tokens, componentes e padrões para produtos Flutter.

## Visão Geral

O Konsi DS é a fonte de verdade visual para os produtos da Konsi. Ele reúne em um único lugar todos os fundamentos de design, componentes reutilizáveis, diretrizes de marca e padrões de conteúdo utilizados no desenvolvimento dos aplicativos Flutter.

## Estrutura

```
konsi-design-system/
├── index.html       # Aplicação principal (SPA estática)
├── css/
│   └── styles.css   # Tokens e estilos do DS
├── js/
│   └── app.js       # Navegação e interações
└── package.json
```

## Seções

| Seção | Conteúdo |
|---|---|
| **Fundamentos** | Cores, Tipografia, Espaçamento, Elevação & Sombras, Design Tokens |
| **Componentes** | Botões, Inputs & Formulários, Cards, Badges & Tags, Feedback & Alertas |
| **Padrões** | Acessibilidade, Princípios |
| **Brand** | Identidade Visual, Paleta da Marca, Tom de Voz |
| **Conteúdo** | Diretrizes de Escrita, Microcopy |
| **Recursos** | Arquivos Figma e referências |

## Design Tokens

O sistema conta com **113 tokens** organizados em categorias:

- `greenKonsi` — paleta primária da marca (`--gk-50` a `--gk-900`)
- `Gray` — escala de cinzas neutros
- `BlueGray` — cinzas com tom azulado para interfaces
- `System` — cores de feedback (error, success, warning)
- `Semantic` — tokens de uso contextual (`--color-primary`, `--color-screen-bg`, etc.)
- `Spacing` — espaçamentos padronizados (`xsm`, `sm`, `md`, `lg`, `xlg`)

## Como rodar localmente

```bash
npm install
npm run dev
```

Acesse em `http://localhost:4200`.

## Tecnologias

- HTML, CSS e JavaScript puros (sem frameworks)
- Fonte [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts
- Servido com [`serve`](https://github.com/vercel/serve)

## Versão

`v1.0` · Focado em Flutter · 2026
