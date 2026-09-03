import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

interface InquiryContextValue {
  open: boolean
  openInquiry: () => void
  closeInquiry: () => void
}

const InquiryContext = createContext<InquiryContextValue | undefined>(undefined)

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  const openInquiry = useCallback(() => setOpen(true), [])
  const closeInquiry = useCallback(() => setOpen(false), [])

  const value = useMemo(
    () => ({ open, openInquiry, closeInquiry }),
    [open, openInquiry, closeInquiry],
  )

  return <InquiryContext.Provider value={value}>{children}</InquiryContext.Provider>
}

export function useInquiry() {
  const context = useContext(InquiryContext)
  if (!context) {
    throw new Error('useInquiry must be used within InquiryProvider')
  }
  return context
}
