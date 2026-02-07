export type AuditAction =
  | 'document.create'
  | 'document.edit'
  | 'document.delete'
  | 'document.download'
  | 'document.view'
  | 'process.create'
  | 'process.update'
  | 'contract.view'
  | 'contract.evaluate'
  | 'team.invite'
  | 'team.update'
  | 'team.remove'
  | 'settings.update'
  | 'auth.login'
  | 'auth.logout'
  | 'search.execute'
  | 'chat.send'
  | 'navigation.page'

interface AuditEvent {
  id: string
  action: AuditAction
  resource?: string
  resourceId?: string
  details?: Record<string, unknown>
  timestamp: string
  sessionId: string
  userAgent: string
  pathname: string
}

// Session ID persiste durante a sessão do navegador
const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'server'
  let sid = sessionStorage.getItem('ata360_session_id')
  if (!sid) {
    sid = crypto.randomUUID()
    sessionStorage.setItem('ata360_session_id', sid)
  }
  return sid
}

const auditBuffer: AuditEvent[] = []
const FLUSH_INTERVAL = 30000 // 30s
const MAX_BUFFER = 50

export function audit(
  action: AuditAction,
  data?: {
    resource?: string
    resourceId?: string
    details?: Record<string, unknown>
  }
) {
  const event: AuditEvent = {
    id: crypto.randomUUID(),
    action,
    resource: data?.resource,
    resourceId: data?.resourceId,
    details: data?.details,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    pathname: typeof window !== 'undefined' ? window.location.pathname : '',
  }

  auditBuffer.push(event)

  // Flush quando buffer cheio
  if (auditBuffer.length >= MAX_BUFFER) {
    flushAuditLog()
  }
}

async function flushAuditLog() {
  if (auditBuffer.length === 0) return
  const events = auditBuffer.splice(0)

  // Em produção: enviar para API/serviço de logging
  if (process.env.NODE_ENV === 'development') {
    console.info('[ATA360:Audit]', JSON.stringify(events, null, 2))
  }

  // TODO: Integrar com Axiom, Datadog, ou API própria
  // await fetch('/api/audit', { method: 'POST', body: JSON.stringify({ events }) })
}

// Flush periódico
if (typeof window !== 'undefined') {
  setInterval(flushAuditLog, FLUSH_INTERVAL)
  window.addEventListener('beforeunload', flushAuditLog)
}
