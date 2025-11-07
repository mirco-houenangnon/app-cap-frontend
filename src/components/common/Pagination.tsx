import React from 'react'
import { CPagination, CPaginationItem } from '@coreui/react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisible?: number
  className?: string
}

/**
 * Composant Pagination réutilisable
 * Gère l'affichage et la navigation entre les pages
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
  className = '',
}) => {
  if (totalPages <= 1) return null

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = []
    const halfVisible = Math.floor(maxVisible / 2)

    let startPage = Math.max(1, currentPage - halfVisible)
    let endPage = Math.min(totalPages, currentPage + halfVisible)

    // Ajuster si on est près du début ou de la fin
    if (currentPage <= halfVisible) {
      endPage = Math.min(totalPages, maxVisible)
    }
    if (currentPage + halfVisible >= totalPages) {
      startPage = Math.max(1, totalPages - maxVisible + 1)
    }

    // Ajouter la première page et ellipsis si nécessaire
    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) {
        pages.push('...')
      }
    }

    // Ajouter les pages visibles
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Ajouter ellipsis et dernière page si nécessaire
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...')
      }
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <CPagination className={`justify-content-center ${className}`} aria-label="Pagination">
      <CPaginationItem
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Précédent"
      >
        Précédent
      </CPaginationItem>

      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <CPaginationItem key={`ellipsis-${index}`} disabled>
              ...
            </CPaginationItem>
          )
        }

        return (
          <CPaginationItem
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </CPaginationItem>
        )
      })}

      <CPaginationItem
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Suivant"
      >
        Suivant
      </CPaginationItem>
    </CPagination>
  )
}

export default Pagination
