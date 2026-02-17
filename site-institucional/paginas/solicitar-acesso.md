# PAGINA: /solicitar-acesso

## Meta
- Title: Solicitar Acesso Gratuito | ATA360
- Description: Solicite acesso gratuito ao ATA360 por 14 dias. Exclusivo para orgaos publicos. Informe o CNPJ e receba o ambiente configurado com dados do PNCP.

---

## Conteudo

**H1:**
Solicite seu acesso gratuito por 14 dias

**Subtitulo:**
Informe os dados do seu orgao. Com o CNPJ, ja preparamos seu ambiente com dados reais do PNCP, historico de contratacoes e informacoes do IBGE. E rapido.

---

## Formulario (5 campos)

### Campo 1: CNPJ do orgao
- Type: text com mascara (00.000.000/0000-00)
- Micro-copy: Para identificar seu orgao e preparar o ambiente com dados reais
- Validacao front: digitos verificadores
- Validacao back: Serpro (natureza juridica = administracao publica)
- Feedback em tempo real: ao sair do campo, mostrar nome do orgao encontrado

### Campo 2: Seu CPF
- Type: text com mascara (000.000.000-00)
- Micro-copy: Para criar seu acesso individual e seguro
- Validacao front: digitos verificadores

### Campo 3: E-mail institucional
- Type: email
- Placeholder: nome@prefeitura.gov.br
- Micro-copy: Para enviar suas credenciais de acesso
- Label: E-mail institucional (ex: nome@prefeitura.gov.br)
- Se Gmail/Hotmail: mensagem suave "Para agilizar a aprovacao, use seu e-mail institucional (.gov.br). Com e-mail pessoal, a liberacao pode levar ate 48h."

### Campo 4: Qual sua funcao principal?
- Type: dropdown (obrigatorio)
- Opcoes:
  - Prefeito(a)
  - Vice-Prefeito(a)
  - Secretario(a) Municipal
  - Pregoeiro(a) / Agente de Contratacao
  - Ordenador(a) de Despesas
  - Assessor(a) / Consultor(a) Juridico(a)
  - Fiscal de Contrato
  - Controle Interno
  - Equipe de apoio a licitacao
  - Outro (campo de texto aberto)

### Campo 5: Telefone / WhatsApp
- Type: tel com mascara
- Micro-copy: Para suporte prioritario durante o periodo de teste

---

## CTA do formulario
**Botao (amarelo):** Solicitar meu acesso gratuito

## Texto de confianca (abaixo do botao)
Seus dados sao protegidos pela LGPD (Lei 13.709/2018) e utilizados exclusivamente para configurar o ambiente do seu orgao. Nao compartilhamos informacoes com terceiros.

---

## Feedback em tempo real (dentro do formulario)

Quando CNPJ e validado, mostrar card:

  [check] Prefeitura Municipal de [CIDADE] -- [UF]
  Natureza juridica: Administracao Publica Municipal
  [X] contratacoes encontradas no PNCP

---

## Tela pos-envio: Aprovacao automatica
(CNPJ publico + e-mail .gov.br + CPF valido)

  [check] Acesso liberado!
  O ambiente da [Nome do Orgao] ja esta pronto com:
  - Dados do PNCP e historico de contratacoes
  - Informacoes do IBGE do seu municipio
  - Logo e dados cadastrais do orgao
  Acesse com o e-mail [email] e a senha enviada.
  Seu acesso gratuito e valido por 14 dias.
  [Botao: Acessar o ATA360 agora]

## Tela pos-envio: Fila de revisao
(e-mail pessoal ou dados inconsistentes)

  [relogio] Solicitacao recebida!
  Para garantir a seguranca da plataforma, precisamos validar alguns dados.
  Nossa equipe libera seu acesso em ate 48h.
  Voce recebera um e-mail em [email] com as credenciais.
  Enquanto isso, veja como o ATA360 funciona: [Link para video demo]

---

## Logica de validacao em camadas

### Camada 1 -- Front (custo zero)
- CNPJ valido (digitos verificadores)
- CPF valido (digitos verificadores)
- E-mail institucional (.gov.br, .leg.br, .jus.br, .mil.br, .edu.br)

### Camada 2 -- Serpro (so apos camada 1)
- CNPJ e de orgao publico? (natureza juridica)
- Se NAO: rejeicao "O ATA360 e exclusivo para orgaos da administracao publica."

### Camada 3 -- Humana (so para ambiguos)
- E-mail pessoal + CNPJ publico valido
- CNPJ de natureza juridica incomum
- Multiplas solicitacoes do mesmo IP

---

## Trial
- Duracao: 14 dias
- Limite: 5 documentos completos + chat ilimitado (50 msg/dia)
- Extensao: +7 dias automatico se iniciou contratacao do ATA360 pela plataforma
- Ao atingir limite: dados preservados, geracao travada, CTA para contratar
