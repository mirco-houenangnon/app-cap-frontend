import { useState, useCallback, useMemo } from 'react'

interface UsePaginationProps {
  initialPage?: number
  itemsPerPage?: number
  totalItems?: number
}

interface UsePaginationReturn {
  currentPage: number
  itemsPerPage: number
  totalPages: number
  goToPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
  setItemsPerPage: (items: number) => void
  canGoNext: boolean
  canGoPrevious: boolean
  startIndex: number
  endIndex: number
  reset: () => void
}

/**
 * Hook usePagination - Gère la logique de pagination
 * @param initialPage - Page initiale (par défaut 1)
 * @param itemsPerPage - Nombre d'items par page (par défaut 10)
 * @param totalItems - Nombre total d'items
 * @returns Objet contenant l'état et les handlers de pagination
 */
const usePagination = ({
  initialPage = 1,
  itemsPerPage: initialItemsPerPage = 10,
  totalItems = 0,
}: UsePaginationProps = {}): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage)

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage) || 1
  }, [totalItems, itemsPerPage])

  const startIndex = useMemo(() => {
    return (currentPage - 1) * itemsPerPage
  }, [currentPage, itemsPerPage])

  const endIndex = useMemo(() => {
    return Math.min(startIndex + itemsPerPage, totalItems)
  }, [startIndex, itemsPerPage, totalItems])

  const canGoNext = useMemo(() => {
    return currentPage < totalPages
  }, [currentPage, totalPages])

  const canGoPrevious = useMemo(() => {
    return currentPage > 1
  }, [currentPage])

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages))
      setCurrentPage(validPage)
    },
    [totalPages]
  )

  const nextPage = useCallback(() => {
    if (canGoNext) {
      setCurrentPage((prev) => prev + 1)
    }
  }, [canGoNext])

  const previousPage = useCallback(() => {
    if (canGoPrevious) {
      setCurrentPage((prev) => prev - 1)
    }
  }, [canGoPrevious])

  const reset = useCallback(() => {
    setCurrentPage(initialPage)
  }, [initialPage])

  const handleSetItemsPerPage = useCallback((items: number) => {
    setItemsPerPage(items)
    setCurrentPage(1) // Reset à la première page lors du changement d'items par page
  }, [])

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
    setItemsPerPage: handleSetItemsPerPage,
    canGoNext,
    canGoPrevious,
    startIndex,
    endIndex,
    reset,
  }
}

export default usePagination
