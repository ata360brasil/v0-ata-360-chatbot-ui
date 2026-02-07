import { describe, it, expect } from 'vitest'
import { ROUTES, SIDEBAR_ROUTE_MAP, ROUTE_META } from '@/lib/routes'

describe('ROUTES', () => {
  it('has all expected routes', () => {
    expect(ROUTES.chat).toBe('/')
    expect(ROUTES.dashboard).toBe('/dashboard')
    expect(ROUTES.contracts).toBe('/contracts')
    expect(ROUTES.processes).toBe('/processes')
    expect(ROUTES.team).toBe('/team')
    expect(ROUTES.files).toBe('/files')
    expect(ROUTES.history).toBe('/history')
    expect(ROUTES.assistants).toBe('/assistants')
    expect(ROUTES.login).toBe('/login')
  })

  it('all route values are strings starting with /', () => {
    Object.values(ROUTES).forEach(path => {
      expect(path).toMatch(/^\//)
    })
  })
})

describe('SIDEBAR_ROUTE_MAP', () => {
  it('maps all sidebar items to valid routes', () => {
    const routeValues = Object.values(ROUTES)
    Object.values(SIDEBAR_ROUTE_MAP).forEach(path => {
      expect(routeValues).toContain(path)
    })
  })

  it('has entries for all navigable sidebar items', () => {
    expect(SIDEBAR_ROUTE_MAP).toHaveProperty('dashboard')
    expect(SIDEBAR_ROUTE_MAP).toHaveProperty('contracts')
    expect(SIDEBAR_ROUTE_MAP).toHaveProperty('processes')
    expect(SIDEBAR_ROUTE_MAP).toHaveProperty('team')
    expect(SIDEBAR_ROUTE_MAP).toHaveProperty('files')
    expect(SIDEBAR_ROUTE_MAP).toHaveProperty('history')
    expect(SIDEBAR_ROUTE_MAP).toHaveProperty('assistants')
  })

  it('does not include chat (handled separately)', () => {
    expect(SIDEBAR_ROUTE_MAP).not.toHaveProperty('chat')
  })
})

describe('ROUTE_META', () => {
  it('has metadata for every route', () => {
    Object.values(ROUTES).forEach(path => {
      expect(ROUTE_META).toHaveProperty(path)
      expect(ROUTE_META[path].title).toBeTruthy()
      expect(ROUTE_META[path].description).toBeTruthy()
    })
  })

  it('descriptions mention relevant keywords', () => {
    expect(ROUTE_META['/contracts'].description).toContain('14.133')
    expect(ROUTE_META['/'].description.toLowerCase()).toContain('contratações')
    expect(ROUTE_META['/dashboard'].description).toContain('métricas')
  })
})
