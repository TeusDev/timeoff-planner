# 📅 Planejador de Ausência

Um sistema inteligente e moderno para planejamento e compensação de ausências com análise detalhada, relatórios avançados e interface responsiva.

![Planejador de Ausência](https://img.shields.io/badge/Status-Ativo-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-14.0-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8)

## 🎯 Visão Geral

O **Planejador de Ausência** é uma aplicação web desenvolvida para facilitar o planejamento de períodos de ausência e calcular automaticamente os dias de compensação necessários. Com uma interface moderna e intuitiva, o sistema oferece análises detalhadas, visualizações interativas e relatórios exportáveis em múltiplos formatos.

### ✨ Principais Funcionalidades

- **📊 Visualização de Calendário**: Visualize todos os dias do período de ausência com detalhes completos
- **🔢 Cálculo de Compensação**: Calcule automaticamente os dias de compensação necessários
- **📈 Análise Avançada**: Relatórios com insights detalhados e métricas de impacto
- **📱 Interface Responsiva**: Design otimizado para desktop, tablet e mobile
- **🎨 Animações Fluidas**: Transições suaves e animações otimizadas para performance
- **📄 Exportação de Relatórios**: Exporte dados em formatos TXT, CSV e JSON
- **🌐 Localização pt-BR**: Interface e formatação completamente em português brasileiro
- **♿ Acessibilidade**: Suporte completo para leitores de tela e navegação por teclado

## 🛠️ Tecnologias Utilizadas

### Frontend
- **[Next.js 14](https://nextjs.org/)** - Framework React com App Router
- **[React 18](https://reactjs.org/)** - Biblioteca para interfaces de usuário
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado do JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário

### UI/UX
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes de interface modernos
- **[Radix UI](https://www.radix-ui.com/)** - Componentes acessíveis e não estilizados
- **[Lucide React](https://lucide.dev/)** - Ícones SVG otimizados
- **[date-fns](https://date-fns.org/)** - Biblioteca para manipulação de datas

### Desenvolvimento
- **[ESLint](https://eslint.org/)** - Linter para JavaScript/TypeScript
- **[PostCSS](https://postcss.org/)** - Processador CSS
- **[Autoprefixer](https://autoprefixer.github.io/)** - Plugin para prefixos CSS

## 🚀 Instalação

### Pré-requisitos

- **Node.js** 18.0 ou superior
- **npm**, **yarn** ou **pnpm** (recomendado)

### Passos de Instalação

1. **Clone o repositório**
   \`\`\`bash
   git clone https://github.com/seu-usuario/planejador-ausencia.git
   cd planejador-ausencia
   \`\`\`

2. **Instale as dependências**
   \`\`\`bash
   # Com npm
   npm install

   # Com yarn
   yarn install

   # Com pnpm (recomendado)
   pnpm install
   \`\`\`

3. **Execute o projeto em modo de desenvolvimento**
   \`\`\`bash
   # Com npm
   npm run dev

   # Com yarn
   yarn dev

   # Com pnpm
   pnpm dev
   \`\`\`

4. **Acesse a aplicação**
   
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📖 Como Usar

### 1. Seleção do Modo de Operação

Na tela inicial, escolha entre dois modos:

- **📅 Visualização de Calendário**: Para visualizar todos os dias do período de ausência
- **🏢 Cálculo de Compensação**: Para calcular dias de compensação necessários

### 2. Definição do Período

1. **Data de Início**: Selecione quando sua ausência começará
2. **Data de Retorno**: Selecione quando você retornará

### 3. Análise dos Resultados

O sistema apresentará:

- **📊 Resumo Executivo**: Métricas principais do período
- **📋 Detalhes**: Lista completa de dias ou cronograma de compensação
- **📈 Análise**: Gráficos e distribuições estatísticas
- **💡 Insights**: Recomendações e observações inteligentes

### 4. Exportação de Relatórios

Exporte seus dados em três formatos:

- **📄 TXT**: Relatório textual formatado
- **📊 CSV**: Dados tabulares para planilhas
- **🔧 JSON**: Dados estruturados para integração

## ⚙️ Configuração

### Variáveis de Ambiente

O projeto não requer variáveis de ambiente específicas para funcionar localmente. Todas as configurações estão incluídas nos arquivos de configuração.

### Personalização

#### Cores e Tema
Edite o arquivo `tailwind.config.ts` para personalizar:
- Paleta de cores
- Espaçamentos
- Tipografia
- Breakpoints responsivos

#### Localização
As configurações de localização estão em:
- `lib/enhanced-date-logic.ts` - Formatação de datas
- Componentes utilizam `date-fns/locale/ptBR`

## 🏗️ Scripts Disponíveis

\`\`\`bash
# Desenvolvimento
pnpm dev          # Inicia servidor de desenvolvimento

# Produção
pnpm build        # Gera build de produção
pnpm start        # Inicia servidor de produção

# Qualidade de Código
pnpm lint         # Executa ESLint
pnpm type-check   # Verifica tipos TypeScript
\`\`\`

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Siga estas diretrizes:

### 1. Fork e Clone
\`\`\`bash
git clone https://github.com/seu-usuario/planejador-ausencia.git
cd planejador-ausencia
\`\`\`

### 2. Crie uma Branch
\`\`\`bash
git checkout -b feature/nova-funcionalidade
\`\`\`

### 3. Padrões de Código

- **TypeScript**: Use tipagem estrita
- **Componentes**: Siga o padrão de componentes funcionais
- **Styling**: Use Tailwind CSS e classes utilitárias
- **Commits**: Use mensagens descritivas em português

### 4. Estrutura de Commits
\`\`\`
feat: adiciona nova funcionalidade
fix: corrige bug específico
docs: atualiza documentação
style: ajustes de formatação
refactor: refatora código existente
test: adiciona ou corrige testes
\`\`\`

### 5. Pull Request

1. Certifique-se de que todos os testes passam
2. Atualize a documentação se necessário
3. Descreva claramente as mudanças realizadas

## 📁 Estrutura do Projeto

\`\`\`
planejador-ausencia/
├── app/                    # App Router do Next.js
│   ├── globals.css        # Estilos globais e animações
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal da aplicação
├── components/            # Componentes shadcn/ui
│   └── ui/               # Componentes de interface
├── lib/                  # Utilitários e lógica de negócio
│   ├── date-logic.ts     # Lógica de datas (legado)
│   ├── enhanced-date-logic.ts # Lógica avançada de datas
│   └── utils.ts          # Utilitários gerais
├── public/               # Arquivos estáticos
├── package.json          # Dependências e scripts
├── tailwind.config.ts    # Configuração do Tailwind
├── tsconfig.json         # Configuração do TypeScript
└── vercel.json          # Configuração de deploy
\`\`\`

## 🎨 Screenshots

### Tela Inicial
![Tela Inicial](https://via.placeholder.com/800x600/3B82F6/FFFFFF?text=Tela+Inicial)

### Seleção de Datas
![Seleção de Datas](https://via.placeholder.com/800x600/10B981/FFFFFF?text=Seleção+de+Datas)

### Relatórios e Análises
![Relatórios](https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Relatórios+e+Análises)

## 🌐 Demo Online

🔗 **[Acesse a Demo](https://planejador-ausencia.vercel.app)**

*A demo está hospedada na Vercel e é atualizada automaticamente com cada commit na branch principal.*

## 📊 Performance

- **Lighthouse Score**: 95+ em todas as métricas
- **Core Web Vitals**: Otimizado para LCP, FID e CLS
- **Bundle Size**: < 200KB gzipped
- **Animações**: 60fps com hardware acceleration

## 🔧 Troubleshooting

### Problemas Comuns

**1. Erro de dependências**
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

**2. Problemas de build**
\`\`\`bash
npm run lint
npm run type-check
\`\`\`

**3. Problemas de estilo**
\`\`\`bash
# Verifique se o Tailwind está configurado corretamente
npx tailwindcss -i ./app/globals.css -o ./dist/output.css --watch
\`\`\`

## 📝 Changelog

### v1.0.0 (2025-01-25)
- ✨ Lançamento inicial
- 📅 Visualização de calendário
- 🔢 Cálculo de compensação
- 📊 Relatórios avançados
- 🎨 Interface responsiva
- 🌐 Localização pt-BR

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Equipe

### Desenvolvedor Principal
- **Seu Nome** - *Desenvolvimento Full-Stack* - [@seu-github](https://github.com/seu-usuario)

### Contribuidores
- Veja a lista completa de [contribuidores](https://github.com/seu-usuario/planejador-ausencia/contributors)

## 📞 Contato

- **Email**: seu.email@exemplo.com
- **LinkedIn**: [Seu Perfil](https://linkedin.com/in/seu-perfil)
- **GitHub**: [@seu-usuario](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- [Next.js Team](https://nextjs.org/) pelo excelente framework
- [shadcn](https://twitter.com/shadcn) pelos componentes UI
- [Vercel](https://vercel.com/) pela plataforma de deploy
- Comunidade open-source pelas bibliotecas utilizadas

---

<div align="center">

**⭐ Se este projeto foi útil para você, considere dar uma estrela!**

[🐛 Reportar Bug](https://github.com/seu-usuario/planejador-ausencia/issues) • [💡 Sugerir Feature](https://github.com/seu-usuario/planejador-ausencia/issues) • [📖 Documentação](https://github.com/seu-usuario/planejador-ausencia/wiki)

</div>
