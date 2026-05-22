'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type HelpCenterContextValue = {
  open: boolean
  openHelp: () => void
  closeHelp: () => void
  toggleHelp: () => void
}

const HelpCenterContext = createContext<HelpCenterContextValue | null>(null)

export function HelpCenterProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  const openHelp = useCallback(() => setOpen(true), [])
  const closeHelp = useCallback(() => setOpen(false), [])
  const toggleHelp = useCallback(() => setOpen(v => !v), [])

  const value = useMemo(
    () => ({ open, openHelp, closeHelp, toggleHelp }),
    [open, openHelp, closeHelp, toggleHelp]
  )

  return (
    <HelpCenterContext.Provider value={value}>{children}</HelpCenterContext.Provider>
  )
}

export function useHelpCenter() {
  const ctx = useContext(HelpCenterContext)
  if (!ctx) {
    throw new Error('useHelpCenter must be used within HelpCenterProvider')
  }
  return ctx
}

export function useHelpCenterOptional() {
  return useContext(HelpCenterContext)
}
