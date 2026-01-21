import React, { useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CFormLabel,
} from '@coreui/react'

interface RenamePieceModalProps {
  visible: boolean
  onClose: () => void
  onSave: (newName: string) => Promise<void>
  currentName: string
  pieceKey: string
}

const RenamePieceModal: React.FC<RenamePieceModalProps> = ({
  visible,
  onClose,
  onSave,
  currentName,
  pieceKey,
}) => {
  const [newName, setNewName] = useState(currentName)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!newName.trim()) return
    
    setSaving(true)
    try {
      await onSave(newName)
      onClose()
    } catch (error) {
      console.error('Erreur lors du renommage:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Renommer la pièce</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="mb-3">
          <CFormLabel>Clé de la pièce</CFormLabel>
          <CFormInput value={pieceKey} disabled />
        </div>
        <div className="mb-3">
          <CFormLabel>Nouveau nom</CFormLabel>
          <CFormInput
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Entrez le nouveau nom..."
            autoFocus
          />
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose} disabled={saving}>
          Annuler
        </CButton>
        <CButton color="primary" onClick={handleSave} disabled={saving || !newName.trim()}>
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default RenamePieceModal
