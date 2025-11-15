# Sistema de Referral com localStorage

## Como Funciona

O sistema de referral foi implementado para persistir o link de indicação mesmo quando o usuário troca de carteira.

### Fluxo de Funcionamento

1. **Usuário A compartilha seu link:**
   - Link: `http://localhost:3000?ref=0xA18D5766FF7C122727F19B69B7e8bef3DF3B2214`

2. **Usuário B acessa o link:**
   - O parâmetro `ref` é detectado automaticamente
   - O endereço é salvo no `localStorage` do navegador
   - Uma notificação aparece informando o referral detectado
   - Campo de "Endereço do Patrocinador" é preenchido automaticamente

3. **Persistência:**
   - Mesmo que o usuário B feche o navegador e retorne depois
   - Mesmo que o usuário B troque de carteira (MetaMask → SafePal)
   - O endereço do patrocinador continua salvo e preenchido

4. **Visual:**
   - Box verde mostra: "✅ Link de referência detectado!"
   - Exibe o endereço completo do referral
   - Botão para "Limpar e usar outro endereço" (caso queira trocar)

5. **Após definir upline:**
   - O localStorage pode ser mantido ou limpo
   - A informação fica permanente no blockchain

## Implementação Técnica

### Hook `useReferral.ts`

```typescript
// Salva no localStorage quando detecta ?ref= na URL
// Recupera do localStorage quando usuário retorna
// Permite limpar o referral salvo
```

### Componente `Network.tsx`

```typescript
// Usa useReferral() para obter referral salvo
// Preenche automaticamente o campo de upline
// Mostra notificação visual quando há referral
// Permite limpar e digitar manualmente outro endereço
```

### App.tsx

```typescript
// Detecta parâmetro ref na URL
// Mostra toast notification quando referral é detectado
```

## Vantagens

✅ **Persistente**: Sobrevive a fechamento do navegador
✅ **Multi-carteira**: Funciona mesmo trocando de wallet
✅ **User-friendly**: Preenchimento automático
✅ **Flexível**: Permite trocar o referral se necessário
✅ **Visual**: Feedback claro ao usuário

## Chave do localStorage

```javascript
localStorage.key = 'primecoin_referral'
```

## Testando

1. Compartilhe seu link: `http://localhost:3000?ref=SEU_ENDEREÇO`
2. Abra em aba anônima ou outro navegador
3. Verifique que o campo é preenchido automaticamente
4. Feche e abra novamente - o valor persiste
5. Troque de carteira - o valor permanece

## Console Debug

No console do navegador você verá:
```
Referral salvo no localStorage: 0x...
Referral carregado do localStorage: 0x...
```
