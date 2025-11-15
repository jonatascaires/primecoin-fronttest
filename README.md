# 🚀 PrimeCoin Staking DApp

<div align="center">

![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript)
![Ethers.js](https://img.shields.io/badge/Ethers.js-6.9-2535A0?style=for-the-badge&logo=ethereum)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)

**Aplicação Web3 completa para interagir com o contrato PrimeCoin na Binance Smart Chain**

[Início Rápido](#-início-rápido) • [Funcionalidades](#-funcionalidades) • [Documentação](#-documentação) • [Deploy](#-deploy)

</div>

---

## 📋 Sobre o Projeto

Uma aplicação React moderna e completa para interagir com o contrato inteligente PrimeCoinStakingTest na BSC. Interface intuitiva, responsiva e segura para staking, trading e gerenciamento de rede MLM.

### 🎯 Contrato Inteligente

- **Endereço**: `0x04b975f8c0b02354b0bbab5e274094f1df13631d`
- **Rede**: BSC (Binance Smart Chain)
- **Chain ID**: 56
- **Token**: PSCT (PrimeCoin Test)

## ⚡ Início Rápido

### Windows (Mais Fácil):

```bash
# 1. Clique duas vezes em install.bat
# 2. Clique duas vezes em start-dev.bat
```

### Mac/Linux/Windows (Terminal):

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Abrir http://localhost:3000
```

## ✨ Funcionalidades

### 🔌 Conexão Web3
- ✅ Suporte para MetaMask, SafePal, Trust Wallet
- ✅ Detecção automática de rede
- ✅ Switch automático para BSC
- ✅ Gerenciamento de múltiplas contas

### 📊 Dashboard Completo
- ✅ Visualização de saldo em tempo real
- ✅ Tokens em stake com detalhes
- ✅ Créditos e comissões
- ✅ Preço atual do token (via PancakeSwap)
- ✅ Estatísticas da rede

### 🔒 Sistema de Staking
- ✅ Stake de tokens com 3 períodos:
  - 7 dias → 3% retorno
  - 14 dias → 8% retorno  
  - 28 dias → 25% retorno
- ✅ Visualização de stakes ativos
- ✅ Cálculo automático de recompensas
- ✅ Retirada após período com rewards

### 💱 Trading (DEX Integration)
- ✅ Comprar tokens com USDT
- ✅ Vender tokens por USDT
- ✅ Preview de preços em tempo real
- ✅ Aprovação automática de USDT
- ✅ Integração com PancakeSwap
- ✅ Verificação de limites diários

### 🌐 Sistema de Rede MLM
- ✅ Definir patrocinador (upline)
- ✅ Link de referência personalizado
- ✅ Visualizar indicados diretos (downlines)
- ✅ Sistema de comissões (17 níveis)
- ✅ Tracking de investimentos da rede

### 🎨 Interface & UX
- ✅ Design responsivo (mobile-first)
- ✅ Tema moderno com Tailwind CSS
- ✅ Notificações toast elegantes
- ✅ Loading states e feedback visual
- ✅ Error handling robusto
- ✅ Navegação intuitiva por rotas

## 📁 Estrutura do Projeto

```
front-app/
├── src/
│   ├── components/       # Componentes React
│   │   ├── Header.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Staking.tsx
│   │   ├── Trading.tsx
│   │   ├── Network.tsx
│   │   └── Common.tsx
│   ├── config/          # Configurações
│   │   ├── constants.ts
│   │   └── abi.ts
│   ├── hooks/           # React Hooks customizados
│   │   ├── useWallet.ts
│   │   └── useContract.ts
│   ├── types/           # TypeScript types
│   ├── utils/           # Utilitários
│   ├── App.tsx          # Componente principal
│   ├── main.tsx         # Entry point
│   └── index.css        # Estilos globais
├── public/
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## 🛠️ Tecnologias

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| React | 18.2 | Framework UI |
| TypeScript | 5.2 | Type Safety |
| Ethers.js | 6.9 | Biblioteca Web3 |
| Vite | 5.0 | Build Tool |
| Tailwind CSS | 3.3 | CSS Framework |
| React Router | 6.20 | Navegação |
| React Toastify | 9.1 | Notificações |
| React Icons | 4.12 | Ícones |

## 📚 Documentação

- **[INICIO_RAPIDO.md](INICIO_RAPIDO.md)** - Comece em 3 minutos
- **[GUIA_DE_USO.md](GUIA_DE_USO.md)** - Guia completo para usuários
- **[DEPLOY.md](DEPLOY.md)** - Guia de deploy (Vercel, Netlify, AWS)
- **[RESUMO_DO_PROJETO.md](RESUMO_DO_PROJETO.md)** - Visão técnica completa

## 🚀 Scripts Disponíveis

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção
npm run preview    # Preview da build
npm run lint       # Verificar código
```

### Scripts Windows (.bat):

- `install.bat` - Instala dependências
- `start-dev.bat` - Inicia desenvolvimento
- `build.bat` - Cria build de produção

## 🌐 Deploy

### Vercel (Recomendado):

```bash
npm install -g vercel
vercel
```

### Netlify:

```bash
npm run build
netlify deploy --prod
```

Para mais opções, consulte [DEPLOY.md](DEPLOY.md)

## 🔐 Segurança

- ✅ Validação de rede antes de transações
- ✅ Verificação de allowances
- ✅ Aprovações seguras de tokens
- ✅ Type safety com TypeScript
- ✅ Error boundaries e tratamento de erros
- ✅ HTTPS obrigatório em produção

## 📱 Compatibilidade

- ✅ Chrome / Edge
- ✅ Firefox
- ✅ Safari
- ✅ Mobile (iOS/Android)
- ✅ MetaMask Mobile
- ✅ Trust Wallet Mobile

## 🤝 Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 💡 Dicas de Uso

- Sempre tenha BNB na carteira para gas fees
- Defina um patrocinador antes de fazer transações
- Verifique limites diários antes de vender
- Use a aba Dashboard para monitorar tudo

## 🆘 Suporte

Encontrou um problema? Verifique:

1. [GUIA_DE_USO.md](GUIA_DE_USO.md) - Seção de problemas comuns
2. Console do navegador (F12) para erros
3. Certifique-se de estar na rede BSC (Chain ID: 56)
4. Verifique se tem BNB para gas fees

## 🎯 Roadmap

- [x] Interface básica
- [x] Integração com carteiras
- [x] Sistema de staking
- [x] Trading (buy/sell)
- [x] Sistema de rede MLM
- [ ] Histórico de transações
- [ ] Gráficos de performance
- [ ] Modo escuro
- [ ] PWA (Progressive Web App)
- [ ] Multi-idioma

## 👨‍💻 Autor

Desenvolvido com ❤️ para a comunidade PrimeCoin

---

<div align="center">

**[⬆ Voltar ao topo](#-primecoin-staking-dapp)**

Made with React • TypeScript • Ethers.js • Love

</div>
