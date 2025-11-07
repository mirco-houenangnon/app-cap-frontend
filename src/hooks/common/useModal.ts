import { useState, useCallback } from 'react'

interface UseModalReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

/**
 * Hook useModal - Gère l'état ouvert/fermé des modals
 * @param initialState - État initial (ouvert/fermé)
 * @returns Objet contenant l'état et les handlers
 */
const useModal = (initialState = false): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(initialState)

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}

export default useModal
