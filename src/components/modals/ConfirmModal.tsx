import React from 'react'
import { CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilWarning, cilInfo, cilXCircle } from '@coreui/icons'
import BaseModal from './BaseModal'

type ConfirmType = 'success' | 'warning' | 'danger' | 'info'

interface ConfirmModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: ConfirmType
  loading?: boolean
}

const typeConfig: Record<
  ConfirmType,
  { icon: string[]; color: string; iconColor: string }
> = {
  success: { icon: cilCheckCircle, color: 'success', iconColor: 'text-success' },
  warning: { icon: cilWarning, color: 'warning', iconColor: 'text-warning' },
  danger: { icon: cilXCircle, color: 'danger', iconColor: 'text-danger' },
  info: { icon: cilInfo, color: 'info', iconColor: 'text-info' },
}

/**
 * Composant ConfirmModal réutilisable
 * Modal de confirmation avec différents types (success, warning, danger, info)
 */
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title = 'Confirmation',
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'info',
  loading = false,
}) => {
  const config = typeConfig[type]

  const footer = (
    <>
      <CButton color="secondary" onClick={onClose} disabled={loading}>
        {cancelText}
      </CButton>
      <CButton color={config.color} onClick={onConfirm} disabled={loading}>
        {loading ? 'Chargement...' : confirmText}
      </CButton>
    </>
  )

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title={title}
      footer={footer}
      backdrop="static"
      keyboard={!loading}
    >
      <div className="text-center">
        <CIcon icon={config.icon} size="3xl" className={`mb-3 ${config.iconColor}`} />
        <p className="mb-0">{message}</p>
      </div>
    </BaseModal>
  )
}

export default ConfirmModal
