# 📅 Planejador de Ausência

Um sistema inteligente e moderno para planejamento e compensação de ausências com análise detalhada, relatórios avançados e interface responsiva.

![Status](https://img.shields.io/badge/Status-Ativo-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8)

---

## 🎯 Visão Geral

O **Planejador de Ausência** é uma aplicação web desenvolvida para facilitar o planejamento de períodos de ausência e calcular automaticamente os dias de compensação necessários.  
Com uma interface moderna e intuitiva, o sistema oferece análises detalhadas, visualizações interativas e relatórios exportáveis em múltiplos formatos.

### ✨ Principais Funcionalidades

- 📊 **Visualização de Calendário**: Visualize todos os dias do período de ausência com detalhes completos  
- 🔢 **Cálculo de Compensação**: Calcule automaticamente os dias de compensação necessários  
- 📈 **Análise Avançada**: Relatórios com insights detalhados e métricas de impacto  
- 📱 **Interface Responsiva**: Design otimizado para desktop, tablet e mobile  
- 🎨 **Animações Fluidas**: Transições suaves e animações otimizadas para performance  
- 📄 **Exportação de Relatórios**: Exporte dados em formatos TXT, CSV e JSON  
- 🌐 **Localização pt-BR**: Interface e formatação completamente em português brasileiro  
- ♿ **Acessibilidade**: Suporte completo para leitores de tela e navegação por teclado  

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- [Next.js 14](https://nextjs.org/)
- [React 18](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

### UI&nbsp;/&nbsp;UX
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide React](https://lucide.dev/)
- [date-fns](https://date-fns.org/)

### Desenvolvimento
- [ESLint](https://eslint.org/)
- [PostCSS](https://postcss.org/)
- [Autoprefixer](https://autoprefixer.github.io/)

---

## 🚀 Instalação

### Pré-requisitos
- **Node.js 18.0** ou superior  
- **npm**, **yarn** ou **pnpm** (recomendado)

### Passos de Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/TeusDev/timeoff-planner.git
   cd timeoff-planner
   ```
   
2. **Instale as dependências**

   ```bash
   # Com pnpm (recomendado)
   pnpm install
   ```
   ```bash
   # Com npm
   npm install
   ```
   ```bash
   # Com yarn
   yarn install
   ```

3. **Execute o projeto em modo de desenvolvimento**

   ```bash
   # Com pnpm (recomendado)
   pnpm dev
   ```
   ```bash
   # Com npm
   npm run dev
   ```
   ```bash
   # Com yarn
   yarn dev
   ```

4. **Acesse a aplicação**
   Abra **[http://localhost:3000](http://localhost:3000)** no navegador.

---

## 📖 Como Usar

1. **Seleção do Modo de Operação**

   * 📅 Visualização de Calendário
   * 🏢 Cálculo de Compensação

2. **Definição do Período**

   * Selecione **Data de Início** e **Data de Retorno**

3. **Análise dos Resultados**

   * 📊 Resumo Executivo
   * 📋 Detalhes
   * 📈 Análise
   * 💡 Insights

4. **Exportação de Relatórios**

   * 📄 TXT  •  📊 CSV  •  🔧 JSON

---

## ⚙️ Configuração

Nenhuma variável de ambiente é necessária para rodar localmente.
Para personalizar tema e cores, edite `tailwind.config.ts`.
Localização de datas: `lib/enhanced-date-logic.ts`.

---

## 🏗️ Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev

# Produção
pnpm build
pnpm start

# Qualidade de Código
pnpm lint
pnpm type-check
```

---

## 📁 Estrutura do Projeto

```text
timeoff-planner/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/
├── lib/
│   ├── date-logic.ts
│   ├── enhanced-date-logic.ts
│   └── utils.ts
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

---

## 🎨 Screenshots

| Tela             | Preview                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------- |
| Tela Inicial     | ![Tela Inicial](https://via.placeholder.com/800x600/3B82F6/FFFFFF?text=Tela+Inicial)         |
| Seleção de Datas | ![Seleção de Datas](https://via.placeholder.com/800x600/10B981/FFFFFF?text=Seleção+de+Datas) |
| Relatórios       | ![Relatórios](https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Relatórios+e+Análises)  |

---

## 🌐 Demo Online

🔗 **[Acesse a Demo](https://v0-planejador-de-ausencia.vercel.app/)**

---

## 📊 Performance

* **Lighthouse** ≥ 95 em todas as métricas
* **Core Web Vitals** otimizado
* **Bundle** < 200 KB gzipped
* **Animações** 60 fps com aceleração por hardware

---

## 🔧 Troubleshooting

### Erro de dependências

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Problemas de build

```bash
pnpm lint
pnpm type-check
```

---

## 📝 Changelog

### v1.0.0 (2025-01-25)

* ✨ Lançamento inicial
* 📅 Visualização de calendário
* 🔢 Cálculo de compensação
* 📊 Relatórios avançados
* 🎨 Interface responsiva
* 🌐 Localização pt-BR

---

## 📄 Licença

Distribuído sob a **MIT License**.
Este repositório inclui código gerado por IA para fins educacionais e pessoais — consulte o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👥 Equipe

### Desenvolvedor Principal

* **Teusdv** — *Desenvolvimento Full-Stack* — [@TeusDev](https://github.com/TeusDev)

### Contribuidores

> Projeto desenvolvido individualmente com apoio de ferramentas de Inteligência Artificial.

---

## 📞 Contato

* **Email**: [221000080@aluno.unb.br](mailto:221000080@aluno.unb.br)
* **LinkedIn**: [linkedin.com/in/teusdev](https://www.linkedin.com/in/teusdev)
* **GitHub**: [@TeusDev](https://github.com/TeusDev)

---

<div align="center">

**⭐ Se este projeto foi útil para você, considere dar uma estrela!**

[🐛 Reportar Bug](https://github.com/TeusDev/timeoff-planner/issues) •
[💡 Sugerir Feature](https://github.com/TeusDev/timeoff-planner/issues) •
[📖 Documentação](https://github.com/TeusDev/timeoff-planner/wiki)

</div>
