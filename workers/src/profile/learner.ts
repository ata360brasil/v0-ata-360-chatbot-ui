/**
 * ATA360 — User Profile Learner
 *
 * Aprende perfil do usuario a partir de:
 * 1. Mensagens do chat (extrai termos, segmentos, padroes)
 * 2. Processos criados (tipos de documento, setores)
 * 3. Feedbacks enviados (correcoes recorrentes)
 * 4. Decisoes ACMA/AUDITOR (preferencias de estilo)
 *
 * Atualiza perfil_usuario com debounce via KV (max 1x por hora).
 *
 * Part 19: perfil e inferencias NUNCA expostos em PDFs.
 *
 * @see Spec v8 Part 08 — ACMA Agent
 * @see Spec v8 Part 19 — Seguranca
 */

interface ProfileEnv {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
  KV?: KVNamespace
}

interface SignalExtraction {
  termos: string[]
  segmentos_detectados: string[]
  documentos_mencionados: string[]
}

// ─── Mapa de termos → segmentos ─────────────────────────────────────────────

const SEGMENTO_KEYWORDS: Record<string, string[]> = {
  SAUDE: [
    'medicamento', 'dipirona', 'paracetamol', 'luva', 'seringa', 'gaze',
    'monitor multiparametrico', 'oximetro', 'desfibrilador', 'ambulancia',
    'uti', 'leito', 'enfermagem', 'farmacia', 'hospitalar', 'clinica',
    'sus', 'fns', 'saude', 'vacina', 'diagnostico', 'laboratorio',
    'epi hospitalar', 'autoclave', 'esterilizacao',
  ],
  TI: [
    'computador', 'notebook', 'servidor', 'switch', 'roteador', 'firewall',
    'software', 'licenca', 'monitor led', 'impressora', 'scanner',
    'storage', 'backup', 'nuvem', 'cloud', 'fibra optica', 'rede',
    'nobreak', 'desktop', 'tablet', 'toner', 'cartucho',
  ],
  EDUCACAO: [
    'escola', 'carteira escolar', 'livro didatico', 'fnde', 'pnae',
    'merenda', 'transporte escolar', 'pdde', 'fundeb', 'lousa',
    'projetor', 'material pedagogico', 'uniforme escolar', 'mochila',
  ],
  OBRAS: [
    'cimento', 'areia', 'brita', 'ferro', 'tijolo', 'concreto',
    'asfalto', 'pavimentacao', 'sinapi', 'sicro', 'engenharia',
    'topografia', 'terraplenagem', 'drenagem', 'fundacao', 'alvenaria',
    'reforma', 'construcao', 'edificacao',
  ],
  VEICULOS: [
    'veiculo', 'caminhao', 'onibus', 'ambulancia', 'motocicleta',
    'combustivel', 'gasolina', 'diesel', 'etanol', 'pneu',
    'manutencao veicular', 'frota', 'inmetro', 'locacao veiculo',
  ],
  ALIMENTOS: [
    'arroz', 'feijao', 'carne', 'frango', 'leite', 'acucar',
    'oleo', 'farinha', 'legume', 'fruta', 'verdura', 'merenda',
    'cesta basica', 'alimentacao', 'nutricao', 'pnae',
  ],
  LIMPEZA: [
    'detergente', 'desinfetante', 'agua sanitaria', 'papel higienico',
    'papel toalha', 'sabao', 'limpeza', 'conservacao', 'higienizacao',
    'terceirizado', 'servico limpeza',
  ],
  ESCRITORIO: [
    'papel a4', 'caneta', 'lapis', 'borracha', 'grampeador',
    'pasta', 'envelope', 'material expediente', 'mobiliario',
    'cadeira escritorio', 'mesa escritorio', 'armario', 'estante',
  ],
}

/**
 * Extrai sinais de segmento a partir de texto (mensagens, objetos, etc.)
 */
function extractSignals(texto: string): SignalExtraction {
  const lower = texto.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  const termos: string[] = []
  const segmentos = new Map<string, number>()
  const documentos: string[] = []

  // Detectar segmentos por keywords
  for (const [segmento, keywords] of Object.entries(SEGMENTO_KEYWORDS)) {
    for (const keyword of keywords) {
      const kw = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      if (lower.includes(kw)) {
        segmentos.set(segmento, (segmentos.get(segmento) || 0) + 1)
        termos.push(keyword)
      }
    }
  }

  // Detectar tipos de documento mencionados
  const docTypes = ['ETP', 'TR', 'DFD', 'PCA', 'PP', 'MR', 'JCD', 'ARP', 'CDF', 'ALF']
  for (const dt of docTypes) {
    if (texto.includes(dt)) documentos.push(dt)
  }

  // Ordenar segmentos por frequência
  const segmentosOrdenados = [...segmentos.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([s]) => s)

  return {
    termos: [...new Set(termos)],
    segmentos_detectados: segmentosOrdenados,
    documentos_mencionados: [...new Set(documentos)],
  }
}

/**
 * Atualiza perfil do usuario com sinais extraidos.
 * Usa KV debounce para evitar atualizacoes excessivas (max 1x/hora).
 */
export async function updateUserProfile(
  usuarioId: string,
  orgaoId: string,
  textos: string[],
  env: ProfileEnv,
): Promise<{ atualizado: boolean; segmento_detectado?: string }> {
  // Debounce via KV (1 hora)
  if (env.KV) {
    const debounceKey = `profile_update:${usuarioId}`
    const lastUpdate = await env.KV.get(debounceKey)
    if (lastUpdate) {
      return { atualizado: false }
    }
    // Setar debounce
    await env.KV.put(debounceKey, new Date().toISOString(), { expirationTtl: 3600 })
  }

  // Extrair sinais de todos os textos
  const allTermos: string[] = []
  const allSegmentos = new Map<string, number>()
  const allDocumentos: string[] = []

  for (const texto of textos) {
    const signals = extractSignals(texto)
    allTermos.push(...signals.termos)
    for (const seg of signals.segmentos_detectados) {
      allSegmentos.set(seg, (allSegmentos.get(seg) || 0) + 1)
    }
    allDocumentos.push(...signals.documentos_mencionados)
  }

  if (allTermos.length === 0 && allSegmentos.size === 0) {
    return { atualizado: false }
  }

  const headers = {
    'Content-Type': 'application/json',
    'apikey': env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
  }

  // Carregar perfil existente
  const existingResponse = await fetch(
    `${env.SUPABASE_URL}/rest/v1/perfil_usuario?usuario_id=eq.${usuarioId}&select=*`,
    { headers },
  )

  let existingProfile: Record<string, unknown> | null = null
  if (existingResponse.ok) {
    const rows = await existingResponse.json() as Array<Record<string, unknown>>
    existingProfile = rows[0] || null
  }

  // Calcular segmento principal
  const segmentosOrdenados = [...allSegmentos.entries()]
    .sort((a, b) => b[1] - a[1])

  const segmentoPrincipal = segmentosOrdenados[0]?.[0] || null
  const segmentosSecundarios = segmentosOrdenados.slice(1, 4).map(([s]) => s)

  // Merge termos frequentes com existentes
  const termosMap = new Map<string, number>()
  if (existingProfile?.termos_frequentes && Array.isArray(existingProfile.termos_frequentes)) {
    for (const t of existingProfile.termos_frequentes as Array<{ termo: string; contagem: number }>) {
      termosMap.set(t.termo, t.contagem)
    }
  }
  for (const termo of allTermos) {
    termosMap.set(termo, (termosMap.get(termo) || 0) + 1)
  }
  const termosFrequentes = [...termosMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([termo, contagem]) => ({ termo, contagem }))

  // Merge documentos mais gerados
  const docsMap = new Map<string, number>()
  if (existingProfile?.documentos_mais_gerados && Array.isArray(existingProfile.documentos_mais_gerados)) {
    for (const d of existingProfile.documentos_mais_gerados as string[]) {
      docsMap.set(d, (docsMap.get(d) || 0) + 1)
    }
  }
  for (const doc of allDocumentos) {
    docsMap.set(doc, (docsMap.get(doc) || 0) + 1)
  }
  const documentosMaisGerados = [...docsMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([d]) => d)

  // Preparar dados para upsert
  const profileData: Record<string, unknown> = {
    usuario_id: usuarioId,
    orgao_id: orgaoId,
    termos_frequentes: termosFrequentes,
    documentos_mais_gerados: documentosMaisGerados,
    updated_at: new Date().toISOString(),
  }

  // So atualizar segmento se temos evidencia suficiente (80%+ de um segmento)
  if (segmentoPrincipal) {
    const totalSignals = segmentosOrdenados.reduce((sum, [, count]) => sum + count, 0)
    const principalShare = (allSegmentos.get(segmentoPrincipal) || 0) / totalSignals

    if (principalShare >= 0.6 || (existingProfile?.segmento_principal === segmentoPrincipal)) {
      profileData.segmento_principal = segmentoPrincipal
    }

    if (segmentosSecundarios.length > 0) {
      profileData.segmentos_secundarios = segmentosSecundarios
    }
  }

  // Temas recorrentes (top 5 termos)
  profileData.temas_recorrentes = termosFrequentes.slice(0, 5).map(t => t.termo)

  // Upsert perfil
  if (existingProfile) {
    await fetch(
      `${env.SUPABASE_URL}/rest/v1/perfil_usuario?usuario_id=eq.${usuarioId}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify(profileData),
      },
    )
  } else {
    await fetch(
      `${env.SUPABASE_URL}/rest/v1/perfil_usuario`,
      {
        method: 'POST',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify(profileData),
      },
    )
  }

  return {
    atualizado: true,
    segmento_detectado: segmentoPrincipal || undefined,
  }
}

/**
 * Carrega perfil sanitizado para o frontend.
 * Part 19: retorna apenas dados seguros (sem dados internos de scoring).
 */
export async function loadUserProfile(
  usuarioId: string,
  supabaseUrl: string,
  supabaseKey: string,
): Promise<{
  segmento_principal: string | null
  segmentos_secundarios: string[]
  termos_frequentes: Array<{ termo: string; contagem: number }>
  preferencias_terminologia: Record<string, string>
  regiao_uf: string | null
  temas_recorrentes: string[]
  documentos_mais_gerados: string[]
} | null> {
  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/perfil_usuario?usuario_id=eq.${usuarioId}&select=segmento_principal,segmentos_secundarios,termos_frequentes,preferencias_terminologia,regiao_uf,temas_recorrentes,documentos_mais_gerados`,
    { headers },
  )

  if (!response.ok) return null

  const rows = await response.json() as Array<Record<string, unknown>>
  if (rows.length === 0) return null

  const row = rows[0]
  return {
    segmento_principal: (row.segmento_principal as string) || null,
    segmentos_secundarios: (row.segmentos_secundarios as string[]) || [],
    termos_frequentes: (row.termos_frequentes as Array<{ termo: string; contagem: number }>) || [],
    preferencias_terminologia: (row.preferencias_terminologia as Record<string, string>) || {},
    regiao_uf: (row.regiao_uf as string) || null,
    temas_recorrentes: (row.temas_recorrentes as string[]) || [],
    documentos_mais_gerados: (row.documentos_mais_gerados as string[]) || [],
  }
}

/**
 * Carrega perfil completo para injecao no prompt ACMA (server-side only).
 * Part 19: NUNCA retornar ao frontend. Apenas usado internamente pelos agentes.
 */
export async function loadFullProfileForACMA(
  usuarioId: string,
  supabaseUrl: string,
  supabaseKey: string,
): Promise<{
  segmento_principal?: string
  regiao_uf?: string
  orgao_nome?: string
  termos_frequentes?: Array<{ termo: string; contagem: number }>
  preferencias_terminologia?: Record<string, string>
} | null> {
  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/perfil_usuario?usuario_id=eq.${usuarioId}&select=segmento_principal,regiao_uf,termos_frequentes,preferencias_terminologia,orgao_id`,
    { headers },
  )

  if (!response.ok) return null

  const rows = await response.json() as Array<Record<string, unknown>>
  if (rows.length === 0) return null

  const row = rows[0]

  // Buscar nome do orgao
  let orgaoNome: string | undefined
  if (row.orgao_id) {
    const orgaoResponse = await fetch(
      `${supabaseUrl}/rest/v1/orgaos?id=eq.${row.orgao_id}&select=nome`,
      { headers },
    )
    if (orgaoResponse.ok) {
      const orgaos = await orgaoResponse.json() as Array<{ nome: string }>
      orgaoNome = orgaos[0]?.nome
    }
  }

  return {
    segmento_principal: (row.segmento_principal as string) || undefined,
    regiao_uf: (row.regiao_uf as string) || undefined,
    orgao_nome: orgaoNome,
    termos_frequentes: (row.termos_frequentes as Array<{ termo: string; contagem: number }>) || undefined,
    preferencias_terminologia: (row.preferencias_terminologia as Record<string, string>) || undefined,
  }
}
