# Guia de Deploy - PrimeCoin Staking DApp

## 🚀 Opções de Deploy

### 1. Vercel (Recomendado) ⚡

O Vercel é a plataforma mais simples e rápida para deploy de aplicações React/Vite.

#### Passo a Passo:

1. Crie uma conta em [vercel.com](https://vercel.com)
2. Instale o Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Na pasta do projeto, execute:
   ```bash
   vercel
   ```
4. Siga as instruções no terminal
5. Sua aplicação estará online em poucos minutos!

#### Deploy via GitHub:

1. Faça push do código para um repositório GitHub
2. Conecte o repositório no Vercel
3. Configure o build:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Clique em "Deploy"

### 2. Netlify 🌐

Outra excelente opção gratuita.

#### Via Netlify CLI:

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod
```

#### Via Interface Web:

1. Faça push do código para GitHub
2. Conecte em [netlify.com](https://netlify.com)
3. Configure:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

### 3. GitHub Pages 📄

Para hospedagem gratuita no GitHub.

#### Configuração:

1. Instale o pacote gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Adicione no `package.json`:
   ```json
   {
     "homepage": "https://seu-usuario.github.io/nome-repo",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Configure `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/nome-repo/',
     // ... resto da config
   })
   ```

4. Execute:
   ```bash
   npm run deploy
   ```

### 4. AWS S3 + CloudFront ☁️

Para aplicações em produção com alta disponibilidade.

#### Passos:

1. Build da aplicação:
   ```bash
   npm run build
   ```

2. Crie um bucket S3
3. Configure como website estático
4. Faça upload da pasta `dist/`
5. Configure CloudFront (CDN)
6. Configure Route53 para domínio customizado

### 5. Docker 🐳

Para deploy containerizado.

#### Dockerfile:

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Comandos:

```bash
docker build -t primecoin-dapp .
docker run -p 80:80 primecoin-dapp
```

## ⚙️ Configurações Importantes

### Variáveis de Ambiente

Se precisar de configurações diferentes para produção, crie um `.env.production`:

```env
VITE_BSC_RPC_URL=https://bsc-dataseed1.binance.org
VITE_CONTRACT_ADDRESS=0x04b975f8c0b02354b0bbab5e274094f1df13631d
```

### Otimizações de Build

O Vite já otimiza automaticamente, mas você pode ajustar no `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ethers-vendor': ['ethers'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
})
```

## 🔒 Segurança em Produção

### Headers de Segurança

Configure no seu servidor/CDN:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### HTTPS

**SEMPRE** use HTTPS em produção! Carteiras Web3 não funcionam sem HTTPS.

## 📊 Monitoramento

### Google Analytics (Opcional)

Adicione no `index.html`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🎯 Checklist Pré-Deploy

- [ ] Testado em diferentes navegadores (Chrome, Firefox, Safari)
- [ ] Testado em mobile
- [ ] Testado com MetaMask, SafePal, etc.
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Build sem erros: `npm run build`
- [ ] Preview funcionando: `npm run preview`
- [ ] Endereço do contrato correto
- [ ] Rede BSC configurada corretamente
- [ ] HTTPS habilitado
- [ ] Domínio customizado configurado (se aplicável)

## 🌍 Domínio Customizado

### Namecheap/GoDaddy

1. Compre um domínio (ex: primecoin.app)
2. Configure DNS:
   - Para Vercel/Netlify: Adicione CNAME apontando para o domínio deles
   - Para AWS: Configure Route53
3. Configure SSL (geralmente automático)

## 📱 PWA (Progressive Web App)

Para transformar em PWA, adicione:

1. `vite-plugin-pwa`:
   ```bash
   npm install -D vite-plugin-pwa
   ```

2. Configure no `vite.config.ts`:
   ```typescript
   import { VitePWA } from 'vite-plugin-pwa'

   export default defineConfig({
     plugins: [
       react(),
       VitePWA({
         registerType: 'autoUpdate',
         manifest: {
           name: 'PrimeCoin Staking DApp',
           short_name: 'PrimeCoin',
           theme_color: '#2563eb',
           icons: [
             {
               src: '/icon-192.png',
               sizes: '192x192',
               type: 'image/png'
             },
             {
               src: '/icon-512.png',
               sizes: '512x512',
               type: 'image/png'
             }
           ]
         }
       })
     ]
   })
   ```

## 🐛 Troubleshooting

### Build falha com erro de memória

```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### Rotas não funcionam após deploy

Configure redirects para SPA (Single Page Application):

**Vercel** (`vercel.json`):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Netlify** (`netlify.toml`):
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 📈 Performance

### Lighthouse Score

Execute antes do deploy:

```bash
npm run build
npm run preview
```

Abra Chrome DevTools > Lighthouse > Generate Report

Metas:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 80

---

**Bom deploy! 🚀**
