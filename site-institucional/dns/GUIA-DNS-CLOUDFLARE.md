# Configuração DNS — Cloudflare

## Situação Atual

- **Registrar:** Registro.br
- **Nameservers:** `elly.ns.cloudflare.com` + `marvin.ns.cloudflare.com`
- **DNS Manager:** Cloudflare (já configurado)
- **Domínio:** ata360.com.br (ativo até 09/06/2028)

## Arquitetura de Domínios

```
ata360.com.br (apex)  →  redirect 301  →  www.ata360.com.br
www.ata360.com.br     →  Webflow       →  Site institucional (marketing)
app.ata360.com.br     →  Vercel        →  Plataforma ATA360 (autenticado)
```

## Passo a Passo no Cloudflare

### 1. Registros DNS

No painel Cloudflare → DNS → Records, criar:

| Tipo   | Nome  | Conteúdo                  | Proxy | TTL  | Observação |
|--------|-------|---------------------------|-------|------|------------|
| CNAME  | `www` | `proxy-ssl.webflow.com`   | OFF   | Auto | Webflow exige proxy OFF (DNS only) |
| CNAME  | `app` | `cname.vercel-dns.com`    | ON    | Auto | Vercel funciona com proxy ON ou OFF |
| A      | `@`   | `75.2.60.5`               | ON    | Auto | IP do Webflow (para apex) |
| A      | `@`   | `99.83.190.102`           | ON    | Auto | IP secundário do Webflow (para apex) |

> **IMPORTANTE:** O registro `www` DEVE estar com Proxy **OFF** (cinza, "DNS only").
> O Webflow precisa gerenciar o SSL diretamente. Com proxy ON, o SSL quebra.

### 2. Page Rule — Redirect apex para www

No Cloudflare → Rules → Page Rules:

- **URL:** `ata360.com.br/*`
- **Setting:** Forwarding URL
- **Status:** 301 - Permanent Redirect
- **Destination:** `https://www.ata360.com.br/$1`

Isso garante que `ata360.com.br` redireciona para `www.ata360.com.br`.

### 3. SSL/TLS

No Cloudflare → SSL/TLS:

- **Modo:** Full (strict)
- **Always Use HTTPS:** ON
- **Automatic HTTPS Rewrites:** ON
- **Minimum TLS Version:** TLS 1.2
- **HSTS:** Habilitar com `max-age=31536000; includeSubDomains; preload`

### 4. Configurar domínio no Webflow

1. No Webflow → Project Settings → Publishing → Custom Domains
2. Adicionar `www.ata360.com.br`
3. O Webflow vai pedir para verificar o CNAME (já configurado no passo 1)
4. Aguardar propagação (até 24h, geralmente minutos)
5. Publicar o site

### 5. Configurar domínio na Vercel

1. Na Vercel → Project Settings → Domains
2. Adicionar `app.ata360.com.br`
3. A Vercel vai pedir para verificar o CNAME (já configurado no passo 1)
4. SSL automático via Let's Encrypt

### 6. Ativar redirect no Next.js (Vercel)

Na Vercel → Project Settings → Environment Variables:

```
NEXT_PUBLIC_WEBFLOW_URL=https://www.ata360.com.br
```

Isso ativa os redirects 307 no middleware do Next.js para todas as rotas
institucionais e legais.

## Verificação

Após configurar, testar:

```bash
# Apex redireciona para www
curl -I https://ata360.com.br
# Esperado: 301 → https://www.ata360.com.br

# www serve o Webflow
curl -I https://www.ata360.com.br
# Esperado: 200 com headers do Webflow

# app serve o Next.js (Vercel)
curl -I https://app.ata360.com.br
# Esperado: 200 com headers da Vercel

# Rotas institucionais no app redirecionam para Webflow
curl -I https://app.ata360.com.br/blog
# Esperado: 307 → https://www.ata360.com.br/blog

# Login funciona normalmente
curl -I https://app.ata360.com.br/login
# Esperado: 200
```

## Cloudflare — Configurações Adicionais Recomendadas

### Security
- **WAF:** Habilitar regras gerenciadas
- **Bot Fight Mode:** ON
- **Challenge Passage:** 30 min

### Performance
- **Auto Minify:** HTML, CSS, JS
- **Brotli:** ON
- **Early Hints:** ON
- **HTTP/3 (QUIC):** ON

### Caching
- **Browser Cache TTL:** Respect Existing Headers
- **Crawler Hints:** ON (ajuda SEO)

## Diagrama

```
                    Cloudflare DNS
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ata360.com.br   www.ata360.com.br  app.ata360.com.br
    (apex → 301)        │               │
         │               │               │
         └──→ www ──→ Webflow        Vercel
                     (Neurex)       (Next.js 16)
                         │               │
                   Site público     App autenticado
                   Marketing        Dashboard
                   Blog             Chat IA
                   Glossário        Contratos
                   Jurisprudência   Processos
                   Legal            Equipe
                   Preços           Arquivos
                   Contato          Histórico
```
