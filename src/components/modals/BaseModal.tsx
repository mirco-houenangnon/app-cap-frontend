import React from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'

interface BaseModalProps {
  visible: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'lg' | 'xl'
  backdrop?: boolean | 'static'
  keyboard?: boolean
  scrollable?: boolean
  centered?: boolean
  fullscreen?: boolean | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
}

/**
 * Composant BaseModal réutilisable
 * Modal de base avec header, body et footer personnalisables
 */
const BaseModal: React.FC<BaseModalProps> = ({
  visible,
  onClose,
  title,
  children,
  footer,
  size,
  backdrop = true,
  keyboard = true,
  scrollable = false,
  centered = false,
  fullscreen = false,
}) => {
  return (
    <CModal
      visible={visible}
      onClose={onClose}
      size={size}
      backdrop={backdrop}
      keyboard={keyboard}
      scrollable={scrollable}
      alignment={centered ? 'center' : undefined}
      fullscreen={fullscreen}
    >
      {title && (
        <CModalHeader closeButton>
          <CModalTitle>{title}</CModalTitle>
        </CModalHeader>
      )}
      <CModalBody>{children}</CModalBody>
      {footer && <CModalFooter>{footer}</CModalFooter>}
    </CModal>
  )
}

export default BaseModal
