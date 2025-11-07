import React, { FormEvent } from 'react'
import { CButton, CForm } from '@coreui/react'
import BaseModal from './BaseModal'

interface FormModalProps {
  visible: boolean
  onClose: () => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  title: string
  children: React.ReactNode
  submitText?: string
  cancelText?: string
  loading?: boolean
  size?: 'sm' | 'lg' | 'xl'
  disableSubmit?: boolean
}

/**
 * Composant FormModal réutilisable
 * Modal contenant un formulaire avec gestion de la soumission
 */
const FormModal: React.FC<FormModalProps> = ({
  visible,
  onClose,
  onSubmit,
  title,
  children,
  submitText = 'Enregistrer',
  cancelText = 'Annuler',
  loading = false,
  size,
  disableSubmit = false,
}) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(e)
  }

  const footer = (
    <>
      <CButton
        color="secondary"
        onClick={onClose}
        disabled={loading}
        type="button"
      >
        {cancelText}
      </CButton>
      <CButton
        color="primary"
        type="submit"
        form="formModalForm"
        disabled={loading || disableSubmit}
      >
        {loading ? 'Chargement...' : submitText}
      </CButton>
    </>
  )

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title={title}
      footer={footer}
      size={size}
      backdrop="static"
      keyboard={!loading}
    >
      <CForm id="formModalForm" onSubmit={handleSubmit}>
        {children}
      </CForm>
    </BaseModal>
  )
}

export default FormModal
