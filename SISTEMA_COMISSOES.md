# Sistema de Comissões - Como Funciona

## Fluxo de uma Compra de Tokens

Quando um usuário compra tokens, acontece o seguinte:

### 1. **Taxa Total Coletada**
- Total da transação: 100%
- Deste valor, são deduzidas taxas

### 2. **Distribuição das Taxas**

#### A) **Taxa do Tesouro - 5%**
- Vai direto para: `0x9729DA1ec03ba5eb2DDDBa2175EaAb5cc5828c25` (taxWallet)
- Aparece nas transações do contrato como: `Transfer(from: buyer, to: taxWallet, value: X)`
- **Não aparece nas comissões de usuários**
- Usado para: liquidez, desenvolvimento, marketing

#### B) **Comissões de Rede - Variável**
- Distribuídas para os uplines (até 17 níveis)
- Pagas em **PSCT tokens**
- Cada nível recebe uma porcentagem diferente
- Aparecem nas transações como: `Transfer(from: contract, to: upline, value: X)` e `CommissionPaid(upline, user, level, amount, type)`
- **Creditadas no saldo PSCT do upline**
- Aparece no campo `totalCommissionsReceived[upline]`

### 3. **Exemplo Real da Sua Transação**

**Comprador:** `0xace484db5348886deda21d1fbab49e16ac32698e`  
**Upline:** `0x532c4c8dffc4c433fc0ecbeb9898359077f383ac`

#### O que aconteceu:
1. ✅ Taxa de 5% foi para o tesouro (`0x9729...8c25`)
2. ✅ Comissão de nível 1 foi paga ao upline em PSCT
3. ✅ Evento `CommissionPaid` foi emitido
4. ✅ Valor creditado em `totalCommissionsReceived[upline]`

#### Por que não aparece no frontend:
- ❌ **NÃO ERA BUG!** As comissões ESTÃO sendo pagas
- ✅ O frontend estava mostrando comissões como "USDT" quando na verdade são "PSCT"
- ✅ **CORRIGIDO**: Agora mostra corretamente como "PSCT" no card "Comissões Recebidas"

## Como Verificar suas Comissões

### No Dashboard:
1. **Card "Comissões Recebidas"** - Mostra total em PSCT
2. **Card "Saldo"** - Suas comissões já estão incluídas aqui
3. **Aba "Rede"** - Veja quem da sua rede gerou comissões

### No Blockchain:
1. Acesse: https://bscscan.com/address/SEU_ENDERECO
2. Procure por eventos `CommissionPaid` nas transactions
3. Filtre por `Transfer` vindo do contrato para você

## Taxas por Nível

O contrato distribui comissões em 17 níveis:
- Nível 1: X% (mais alto)
- Nível 2: X%
- ...
- Nível 17: X% (mais baixo)

**Qualificação:** Você precisa ter investimento mínimo em trading para receber cada nível.

## Importante! 🚨

### Comissões SÃO creditadas automaticamente
- ✅ Não precisa fazer claim manual
- ✅ Aparecem direto no seu saldo PSCT
- ✅ Podem ser usadas para trading, staking ou venda

### Tesouro é SEPARADO
- 🏦 5% vai sempre para o tesouro
- 🏦 Não é comissão de usuário
- 🏦 Usado para sustentabilidade do projeto

## Resumo da Correção Feita

**Antes:**
```
Card: "Comissões Total"
Valor: X USDT ❌ (ERRADO - são PSCT)
```

**Depois:**
```
Card: "Comissões Recebidas"  
Valor: X PSCT ✅ (CORRETO)
+ Seção explicativa sobre como funciona
```

**Nova Seção Adicionada:**
- Card amarelo/laranja explicando:
  - Comissões em PSCT
  - Taxa de tesouro 5%
  - Como verificar comissões
  - Diferença entre tesouro e comissões de rede
