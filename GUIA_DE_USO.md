# Guia de Instalação e Uso - PrimeCoin Staking DApp

## 📋 Pré-requisitos

Antes de começar, você precisará ter instalado:

- **Node.js** (versão 18 ou superior) - [Download aqui](https://nodejs.org/)
- **Uma carteira Web3** compatível:
  - MetaMask - [Instalar](https://metamask.io/)
  - SafePal Wallet
  - Trust Wallet
  - Ou qualquer outra carteira compatível com WalletConnect

## 🚀 Instalação

### Passo 1: Navegue até a pasta do projeto

```bash
cd front-app
```

### Passo 2: Instale as dependências

```bash
npm install
```

Este comando irá instalar todas as bibliotecas necessárias:
- React 18 + TypeScript
- Ethers.js v6 (para interação com blockchain)
- Tailwind CSS (para estilos)
- React Router (para navegação)
- React Toastify (para notificações)
- E outras dependências

## 🏃 Executando a Aplicação

### Modo de Desenvolvimento

```bash
npm run dev
```

A aplicação será aberta automaticamente no navegador em `http://localhost:3000`

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`

### Preview da Build de Produção

```bash
npm run preview
```

## 🔧 Configuração da Carteira

### Conectando à BSC (Binance Smart Chain)

1. Abra sua carteira (ex: MetaMask)
2. Clique em "Adicionar Rede" ou "Network"
3. Adicione a BSC Mainnet com os seguintes dados:

```
Nome da Rede: Binance Smart Chain
RPC URL: https://bsc-dataseed1.binance.org
Chain ID: 56
Símbolo: BNB
Block Explorer: https://bscscan.com
```

**Ou simplesmente clique no botão "Trocar para BSC"** quando a aplicação detectar que você está em outra rede!

## 💰 Preparando sua Carteira

Você precisará ter em sua carteira:

1. **BNB** - Para pagar as taxas de gás (gas fees) das transações
   - Recomendado: Pelo menos 0.01 BNB (~$5-10)
   
2. **USDT (BEP20)** - Para comprar tokens PSCT
   - Endereço do USDT na BSC: `0x55d398326f99059fF775485246999027B3197955`

## 📱 Como Usar a Aplicação

### 1️⃣ Conectar Carteira

- Clique no botão **"Conectar Carteira"** no canto superior direito
- Selecione sua carteira (MetaMask, SafePal, etc.)
- Aprove a conexão
- Se necessário, troque para a rede BSC

### 2️⃣ Definir Patrocinador (Primeira vez)

**IMPORTANTE**: Antes de fazer qualquer transação, você PRECISA definir um patrocinador (upline).

1. Vá para a aba **"Rede"**
2. Digite o endereço do seu patrocinador
3. Clique em "Definir Patrocinador"
4. Aprove a transação na sua carteira
5. ⚠️ **Esta ação é permanente e não pode ser alterada!**

### 3️⃣ Dashboard

Visualize suas informações:
- Saldo de tokens PSCT
- Quantidade em stake
- Créditos disponíveis
- Comissões totais recebidas
- Preço atual do token

### 4️⃣ Fazer Stake

1. Vá para a aba **"Staking"**
2. Digite a quantidade de tokens PSCT
3. Escolha o período:
   - **7 dias**: +3% de retorno
   - **14 dias**: +8% de retorno
   - **28 dias**: +25% de retorno
4. Clique em "Fazer Stake"
5. Aprove a transação
6. Aguarde a confirmação

### 5️⃣ Retirar Stake

1. Na aba **"Staking"**, visualize seus stakes ativos
2. Quando o período terminar, o botão **"Retirar"** ficará disponível
3. Clique em "Retirar"
4. Aprove a transação
5. Você receberá o valor original + recompensa

### 6️⃣ Comprar Tokens

1. Vá para a aba **"Trading"**
2. Selecione **"Comprar"**
3. Digite a quantidade de USDT
4. Veja o preview de quantos tokens receberá
5. Clique em "Comprar Tokens"
6. Aprove o USDT (se for a primeira vez)
7. Aprove a transação de compra
8. Aguarde a confirmação

### 7️⃣ Vender Tokens

1. Vá para a aba **"Trading"**
2. Selecione **"Vender"**
3. Digite a quantidade de tokens PSCT
4. Veja o preview de quanto USDT receberá
5. ⚠️ Verifique seus limites diários
6. Clique em "Vender Tokens"
7. Aprove a transação
8. Aguarde a confirmação

### 8️⃣ Gerenciar Rede

1. Vá para a aba **"Rede"**
2. Visualize seu patrocinador (upline)
3. Copie seu link de referência
4. Compartilhe com outras pessoas
5. Veja seus indicados diretos (downlines)
6. Ganhe comissões de até 17 níveis!

## 🔐 Segurança

### Dicas Importantes:

✅ **SEMPRE** verifique o endereço do contrato: `0x04b975f8c0b02354b0bbab5e274094f1df13631d`

✅ **NUNCA** compartilhe sua seed phrase ou chave privada

✅ Verifique todas as transações antes de aprovar

✅ Mantenha sempre BNB na carteira para taxas de gás

✅ Use apenas redes e extensões oficiais

❌ **NÃO** aprove transações suspeitas

❌ **NÃO** conecte sua carteira em sites desconhecidos

## ❓ Problemas Comuns

### Erro: "MetaMask não está instalado"
**Solução**: Instale a extensão MetaMask no seu navegador

### Erro: "Rede incorreta"
**Solução**: Clique no botão "Trocar para BSC" ou configure manualmente

### Erro: "Insufficient funds for gas"
**Solução**: Adicione mais BNB à sua carteira para pagar taxas

### Erro: "Allowance insuficiente"
**Solução**: A aplicação automaticamente pedirá aprovação do USDT

### Transação pendente por muito tempo
**Solução**: Verifique o gas price. Pode aumentar no MetaMask se necessário

### Não consigo fazer stake/comprar
**Solução**: Certifique-se de ter definido um patrocinador primeiro!

## 📊 Informações do Contrato

- **Endereço**: `0x04b975f8c0b02354b0bbab5e274094f1df13631d`
- **Rede**: BSC (Binance Smart Chain)
- **Token**: PSCT (PrimeCoin Test)
- **Decimais**: 18
- **Scanner**: [Ver no BscScan](https://bscscan.com/address/0x04b975f8c0b02354b0bbab5e274094f1df13631d)

## 🌐 Links Úteis

- [BscScan](https://bscscan.com/) - Explorer da BSC
- [PancakeSwap](https://pancakeswap.finance/) - DEX onde o token é negociado
- [MetaMask](https://metamask.io/) - Carteira Web3
- [Binance](https://www.binance.com/) - Exchange para comprar BNB

## 🆘 Suporte

Se encontrar problemas:

1. Verifique o console do navegador (F12) para erros
2. Verifique se está na rede correta (BSC)
3. Certifique-se de ter BNB para taxas
4. Tente recarregar a página
5. Desconecte e reconecte a carteira

## 📝 Notas Importantes

- Todas as transações são irreversíveis
- O patrocinador (upline) não pode ser alterado depois de definido
- Existe um período de cooldown de 5 minutos entre vendas
- Os limites de venda são baseados no seu lucro e investimento
- As comissões são distribuídas automaticamente pelo contrato

---

**Desenvolvido com React + TypeScript + Ethers.js v6**

Boa sorte e bons negócios! 🚀💰
