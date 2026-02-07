import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { AppProvider, useApp } from '@/contexts/app-context'

function wrapper({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>
}

describe('useApp', () => {
  it('throws when used outside AppProvider', () => {
    expect(() => {
      renderHook(() => useApp())
    }).toThrow('useApp must be used within an AppProvider')
  })

  it('provides initial state', () => {
    const { result } = renderHook(() => useApp(), { wrapper })

    expect(result.current.sidebarOpen).toBe(false)
    expect(result.current.artifactsPanelOpen).toBe(false)
    expect(result.current.currentArtifact).toBeNull()
    expect(result.current.hasStartedChat).toBe(false)
    expect(result.current.notificationsModalOpen).toBe(false)
  })

  it('has 5 initial notifications with correct unread count', () => {
    const { result } = renderHook(() => useApp(), { wrapper })

    expect(result.current.notifications).toHaveLength(5)
    expect(result.current.unreadCount).toBe(3)
  })
})

describe('sidebar state', () => {
  it('toggles sidebar open and closed', () => {
    const { result } = renderHook(() => useApp(), { wrapper })

    expect(result.current.sidebarOpen).toBe(false)

    act(() => result.current.toggleSidebar())
    expect(result.current.sidebarOpen).toBe(true)

    act(() => result.current.toggleSidebar())
    expect(result.current.sidebarOpen).toBe(false)
  })

  it('sets sidebar directly', () => {
    const { result } = renderHook(() => useApp(), { wrapper })

    act(() => result.current.setSidebarOpen(true))
    expect(result.current.sidebarOpen).toBe(true)

    act(() => result.current.setSidebarOpen(false))
    expect(result.current.sidebarOpen).toBe(false)
  })
})

describe('artifacts panel', () => {
  it('opens artifact panel with data', () => {
    const { result } = renderHook(() => useApp(), { wrapper })

    const artifact = {
      id: 'test-1',
      type: 'document' as const,
      title: 'Test Document',
      content: 'Test content',
    }

    act(() => result.current.openArtifact(artifact))

    expect(result.current.artifactsPanelOpen).toBe(true)
    expect(result.current.currentArtifact).toEqual(artifact)
  })

  it('closes artifacts panel and resets width', () => {
    const { result } = renderHook(() => useApp(), { wrapper })

    act(() => {
      result.current.openArtifact({
        id: '1',
        type: 'table' as const,
        title: 'T',
        content: 'C',
      })
    })
    expect(result.current.artifactsPanelOpen).toBe(true)

    act(() => result.current.closeArtifactsPanel())
    expect(result.current.artifactsPanelOpen).toBe(false)
  })

  it('resizes artifacts panel within bounds', () => {
    const { result } = renderHook(() => useApp(), { wrapper })

    // Default width is 480
    expect(result.current.artifactsWidth).toBe(480)

    // Resize by negative delta (= wider)
    act(() => result.current.handleResize(-100))
    expect(result.current.artifactsWidth).toBe(580)

    // Resize beyond max (800) should clamp
    act(() => result.current.handleResize(-500))
    expect(result.current.artifactsWidth).toBe(800)

    // Resize by positive delta (= narrower)
    act(() => result.current.handleResize(600))
    expect(result.current.artifactsWidth).toBe(300) // min
  })
})

describe('chat state', () => {
  it('starts and resets chat', () => {
    const { result } = renderHook(() => useApp(), { wrapper })

    expect(result.current.hasStartedChat).toBe(false)

    act(() => result.current.setHasStartedChat(true))
    expect(result.current.hasStartedChat).toBe(true)

    act(() => result.current.resetChat())
    expect(result.current.hasStartedChat).toBe(false)
    expect(result.current.currentArtifact).toBeNull()
    expect(result.current.artifactsPanelOpen).toBe(false)
  })
})

describe('notifications', () => {
  it('updates notifications list', () => {
    const { result } = renderHook(() => useApp(), { wrapper })

    act(() => {
      result.current.setNotifications([
        {
          id: 'new-1',
          type: 'alert',
          title: 'New Alert',
          description: 'Test',
          date: 'Today',
          read: false,
          requiresAction: false,
        },
      ])
    })

    expect(result.current.notifications).toHaveLength(1)
    expect(result.current.unreadCount).toBe(1)
  })

  it('toggles notifications modal', () => {
    const { result } = renderHook(() => useApp(), { wrapper })

    act(() => result.current.setNotificationsModalOpen(true))
    expect(result.current.notificationsModalOpen).toBe(true)

    act(() => result.current.setNotificationsModalOpen(false))
    expect(result.current.notificationsModalOpen).toBe(false)
  })
})
