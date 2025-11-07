import React from 'react'
import { CCard, CCardBody, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilInfo } from '@coreui/icons'

interface EmptyStateProps {
  icon?: string[]
  title?: string
  message?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

/**
 * Composant EmptyState réutilisable
 * Affiche un état vide avec message et action optionnelle
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  icon = cilInfo,
  title = 'Aucune donnée disponible',
  message = 'Il n\'y a aucune donnée à afficher pour le moment.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <CCard className={`text-center ${className}`}>
      <CCardBody className="py-5">
        <div className="mb-3">
          <CIcon
            icon={icon}
            size="4xl"
            className="text-muted"
            style={{ opacity: 0.5 }}
          />
        </div>
        <h4 className="text-muted mb-3">{title}</h4>
        <p className="text-muted mb-4">{message}</p>
        {actionLabel && onAction && (
          <CButton color="primary" onClick={onAction}>
            {actionLabel}
          </CButton>
        )}
      </CCardBody>
    </CCard>
  )
}

export default EmptyState
