/**
 * ATA360 — Configurações de Perfil do Usuário
 *
 * Seção dentro do Settings Modal para:
 * - Visualizar segmento detectado automaticamente
 * - Override manual de setor/segmento
 * - Terminologia preferida (pares chave→valor)
 * - UF do órgão
 * - Termos frequentes (read-only, aprendido)
 * - Documentos mais gerados (read-only, aprendido)
 *
 * @see hooks/use-user-profile.ts
 */
'use client'

import { useState, useCallback } from 'react'
import { useUserProfile, type UserProfile } from '@/hooks/use-user-profile'

const SEGMENTOS = [
  { value: 'SAUDE', label: 'Saúde' },
  { value: 'TI', label: 'Tecnologia da Informação' },
  { value: 'EDUCACAO', label: 'Educação' },
  { value: 'OBRAS', label: 'Obras e Infraestrutura' },
  { value: 'VEICULOS', label: 'Veículos e Frotas' },
  { value: 'ALIMENTOS', label: 'Alimentação' },
  { value: 'LIMPEZA', label: 'Limpeza e Conservação' },
  { value: 'ESCRITORIO', label: 'Material de Escritório' },
  { value: 'EPI', label: 'Equipamentos de Proteção' },
  { value: 'SERVICOS', label: 'Serviços Gerais' },
] as const

const UFS = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR',
  'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO',
] as const

export function SettingsProfile() {
  const { profile, loading, atualizarPreferencias } = useUserProfile()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Local state for edits
  const [segmento, setSegmento] = useState<string | null>(null)
  const [uf, setUf] = useState<string | null>(null)
  const [newTermKey, setNewTermKey] = useState('')
  const [newTermValue, setNewTermValue] = useState('')
  const [terminologia, setTerminologia] = useState<Record<string, string>>({})
  const [initialized, setInitialized] = useState(false)

  // Initialize local state from profile
  if (profile && !initialized) {
    setSegmento(profile.segmento_principal)
    setUf(profile.regiao_uf)
    setTerminologia(profile.preferencias_terminologia || {})
    setInitialized(true)
  }

  const handleSave = useCallback(async () => {
    setSaving(true)
    setSaved(false)

    const success = await atualizarPreferencias({
      segmento_principal: segmento,
      regiao_uf: uf,
      preferencias_terminologia: terminologia,
    })

    setSaving(false)
    if (success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }, [segmento, uf, terminologia, atualizarPreferencias])

  const addTerminologia = useCallback(() => {
    if (newTermKey.trim() && newTermValue.trim()) {
      setTerminologia(prev => ({
        ...prev,
        [newTermKey.trim()]: newTermValue.trim(),
      }))
      setNewTermKey('')
      setNewTermValue('')
    }
  }, [newTermKey, newTermValue])

  const removeTerminologia = useCallback((key: string) => {
    setTerminologia(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
        <span className="ml-3 text-sm text-muted-foreground">Carregando perfil...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Perfil de Uso</h3>
        <p className="text-sm text-muted-foreground mt-1">
          O sistema aprende seu perfil automaticamente com base nas suas interações.
          Você pode ajustar manualmente abaixo.
        </p>
      </div>

      {/* Segmento Principal */}
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="segmento">
          Segmento / Setor Principal
        </label>
        <select
          id="segmento"
          value={segmento || ''}
          onChange={(e) => setSegmento(e.target.value || null)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">Detecção automática</option>
          {SEGMENTOS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        {profile?.segmento_principal && !segmento && (
          <p className="text-xs text-muted-foreground">
            Detectado automaticamente: <span className="font-medium text-amber-600">{
              SEGMENTOS.find(s => s.value === profile.segmento_principal)?.label || profile.segmento_principal
            }</span>
          </p>
        )}
      </div>

      {/* UF */}
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="uf">
          Estado (UF)
        </label>
        <select
          id="uf"
          value={uf || ''}
          onChange={(e) => setUf(e.target.value || null)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">Não informado</option>
          {UFS.map(u => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>

      {/* Terminologia Preferida */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Terminologia Preferida</label>
        <p className="text-xs text-muted-foreground">
          Defina termos que o sistema deve usar ao gerar documentos.
        </p>

        {Object.entries(terminologia).length > 0 && (
          <div className="space-y-1">
            {Object.entries(terminologia).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 bg-muted/50 rounded px-3 py-1.5 text-sm">
                <span className="text-muted-foreground">{key}</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-medium">{value}</span>
                <button
                  onClick={() => removeTerminologia(key)}
                  className="ml-auto text-red-500 hover:text-red-700 text-xs"
                  aria-label={`Remover ${key}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Termo genérico"
            value={newTermKey}
            onChange={(e) => setNewTermKey(e.target.value)}
            className="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm"
          />
          <span className="self-center text-muted-foreground text-sm">→</span>
          <input
            type="text"
            placeholder="Termo preferido"
            value={newTermValue}
            onChange={(e) => setNewTermValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTerminologia()}
            className="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm"
          />
          <button
            onClick={addTerminologia}
            disabled={!newTermKey.trim() || !newTermValue.trim()}
            className="px-3 py-1.5 rounded-md bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Adicionar
          </button>
        </div>
      </div>

      {/* Dados Aprendidos (Read-only) */}
      {profile && (profile.termos_frequentes.length > 0 || profile.documentos_mais_gerados.length > 0) && (
        <div className="space-y-4 border-t pt-4">
          <h4 className="text-sm font-medium text-muted-foreground">Dados Aprendidos</h4>

          {/* Termos Frequentes */}
          {profile.termos_frequentes.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Termos Frequentes</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.termos_frequentes.slice(0, 15).map((t, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs"
                  >
                    {t.termo}
                    <span className="text-amber-500/60">({t.contagem})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Documentos Mais Gerados */}
          {profile.documentos_mais_gerados.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Documentos Mais Gerados</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.documentos_mais_gerados.map((d, i) => (
                  <span
                    key={i}
                    className="inline-flex px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-medium"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Segmentos Secundários */}
          {profile.segmentos_secundarios.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Segmentos Secundários</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.segmentos_secundarios.map((s, i) => (
                  <span
                    key={i}
                    className="inline-flex px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs"
                  >
                    {SEGMENTOS.find(sg => sg.value === s)?.label || s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Save Button */}
      <div className="flex items-center gap-3 border-t pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-md bg-amber-500 text-white font-medium hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {saving ? 'Salvando...' : 'Salvar Preferências'}
        </button>
        {saved && (
          <span className="text-sm text-green-600 dark:text-green-400 animate-in fade-in">
            Salvo com sucesso!
          </span>
        )}
      </div>
    </div>
  )
}
