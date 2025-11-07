import React from 'react'
import {
  CButton,
  CAlert,
  CListGroup,
  CListGroupItem,
  CFormCheck,
  CBadge,
  CButtonGroup,
} from '@coreui/react'
import { LoadingSpinner } from '../common'
import { BaseModal } from '../modals/index'

interface Group {
  name: string
  students: any[]
}

interface GroupCreationModalProps {
  visible: boolean
  groups: Group[]
  currentGroupIndex: number
  selectedStudents: number[]
  allStudentsForGrouping: any[]
  loading: boolean
  onClose: () => void
  onSelectStudent: (studentId: number) => void
  onSelectAll: () => void
  onDeselectAll: () => void
  onSelectFirst: () => void
  onSelectLast: () => void
  onSelectOneInTwo: () => void
  onValidateGroup: () => void
}

/**
 * GroupCreationModal - Modal de création de groupes de classe
 */
const GroupCreationModal: React.FC<GroupCreationModalProps> = ({
  visible,
  groups,
  currentGroupIndex,
  selectedStudents,
  allStudentsForGrouping,
  loading,
  onClose,
  onSelectStudent,
  onSelectAll,
  onDeselectAll,
  onSelectFirst,
  onSelectLast,
  onSelectOneInTwo,
  onValidateGroup,
}) => {
  const currentGroup = groups[currentGroupIndex]
  const assignedStudentIds = groups.flatMap((g) => g.students.map((s: any) => s.id))
  const availableStudents = allStudentsForGrouping.filter(
    (s) => !assignedStudentIds.includes(s.id)
  )

  const footer = (
    <>
      <CButton color="secondary" onClick={onClose}>
        Annuler
      </CButton>
      <CButton
        color="primary"
        onClick={onValidateGroup}
        disabled={selectedStudents.length === 0}
      >
        Valider le groupe {currentGroup?.name}
      </CButton>
    </>
  )

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title={`Création de groupes - Groupe ${currentGroup?.name || ''}`}
      footer={footer}
      size="xl"
      scrollable
    >
      {loading ? (
        <LoadingSpinner message="Chargement des étudiants..." />
      ) : (
        <>
          {/* Récapitulatif des groupes */}
          <CAlert color="info" className="mb-3">
            <h6 className="mb-2">Récapitulatif :</h6>
            {groups.map((g, index) => (
              <div key={index}>
                <strong>Groupe {g.name}:</strong> {g.students.length} étudiant(s)
                {index === currentGroupIndex && ' (en cours)'}
              </div>
            ))}
            <div className="mt-2">
              <strong>Étudiants restants:</strong> {availableStudents.length}
            </div>
          </CAlert>

          {/* Boutons de sélection rapide */}
          <div className="mb-3">
            <h6>Sélection rapide :</h6>
            <CButtonGroup size="sm">
              <CButton color="secondary" variant="outline" onClick={onSelectAll}>
                Tout sélectionner
              </CButton>
              <CButton color="secondary" variant="outline" onClick={onDeselectAll}>
                Tout désélectionner
              </CButton>
              <CButton color="secondary" variant="outline" onClick={onSelectFirst}>
                Premiers N
              </CButton>
              <CButton color="secondary" variant="outline" onClick={onSelectLast}>
                Derniers N
              </CButton>
              <CButton color="secondary" variant="outline" onClick={onSelectOneInTwo}>
                Un sur deux
              </CButton>
            </CButtonGroup>
          </div>

          {/* Liste des étudiants disponibles */}
          <div className="mb-3">
            <h6>
              Étudiants disponibles ({availableStudents.length})
              <CBadge color="primary" className="ms-2">
                {selectedStudents.length} sélectionné(s)
              </CBadge>
            </h6>
          </div>

          {availableStudents.length === 0 ? (
            <CAlert color="warning">
              Tous les étudiants ont été assignés à un groupe.
            </CAlert>
          ) : (
            <CListGroup>
              {availableStudents.map((student: any) => (
                <CListGroupItem
                  key={student.id}
                  className="d-flex align-items-center"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectStudent(student.id)}
                >
                  <CFormCheck
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => onSelectStudent(student.id)}
                    className="me-3"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-grow-1">
                    <strong>{student.nomPrenoms}</strong>
                    <div className="text-muted small">
                      {student.email} - {student.niveau}
                    </div>
                  </div>
                </CListGroupItem>
              ))}
            </CListGroup>
          )}
        </>
      )}
    </BaseModal>
  )
}

export default GroupCreationModal
