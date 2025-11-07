import React from 'react'
import {
  CTableRow,
  CTableDataCell,
  CFormCheck,
  CFormInput,
  CFormSwitch,
  CBadge,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilCheckCircle, cilXCircle } from '@coreui/icons'
import Select from 'react-select'
import type { PendingStudentData } from '../../types/inscription.types'

interface SelectOption {
  value: string | number
  label: string
}

interface PendingStudentRowProps {
  student: PendingStudentData
  index: number
  currentPage: number
  isSelected: boolean
  isSpecialFiliere: boolean
  opinionOptions: SelectOption[]
  onSelectStudent: (studentId: number) => void
  onOpenDocument: (documentUrl: string) => void
  onOpinionChange: (studentId: number, type: string, value: string) => void
  onCommentChange: (studentId: number, type: string, value: string) => void
  onStatusChange: (studentId: number, field: 'exonere' | 'sponsorise', checked: boolean) => void
}

/**
 * PendingStudentRow - Ligne de tableau pour un étudiant en attente
 */
const PendingStudentRow: React.FC<PendingStudentRowProps> = ({
  student,
  index,
  currentPage,
  isSelected,
  isSpecialFiliere,
  opinionOptions,
  onSelectStudent,
  onOpenDocument,
  onOpinionChange,
  onCommentChange,
  onStatusChange,
}) => {
  const getStatusColor = (status: string) => {
    if (status === 'approved') return 'success'
    if (status === 'rejected') return 'danger'
    return 'warning'
  }

  const getStatusLabel = (status: string) => {
    if (status === 'approved') return 'Validé'
    if (status === 'rejected') return 'Rejeté'
    return 'En attente'
  }

  return (
    <CTableRow>
      {/* Checkbox Sélection */}
      <CTableDataCell>
        <CFormCheck checked={isSelected} onChange={() => onSelectStudent(student.id)} />
      </CTableDataCell>

      {/* Numéro */}
      <CTableDataCell>{(currentPage - 1) * 10 + index + 1}</CTableDataCell>

      {/* Nom et Prénoms */}
      <CTableDataCell>{student.first_name + ' ' + student.last_name}</CTableDataCell>

      {/* Pièces */}
      <CTableDataCell>
        <div style={{ maxWidth: '200px' }}>
          {student.pieces && student.pieces.length > 0 ? (
            student.pieces.map((piece, pieceIndex) => (
              <div key={pieceIndex} className="mb-1">
                <CBadge
                  color="primary"
                  className="cursor-pointer text-decoration-underline"
                  onClick={() =>
                    onOpenDocument(
                      typeof piece === 'string' ? piece : piece.url || ''
                    )
                  }
                  style={{ cursor: 'pointer' }}
                >
                  {typeof piece === 'string'
                    ? `Pièce ${pieceIndex + 1}`
                    : piece.name || `Pièce ${pieceIndex + 1}`}
                </CBadge>
              </div>
            ))
          ) : (
            <span className="text-muted">Aucune pièce</span>
          )}
        </div>
      </CTableDataCell>

      {/* Opinion CUCA / Commission */}
      <CTableDataCell>
        <Select
          options={opinionOptions}
          value={opinionOptions.find((opt) => opt.value === student.opinionCuca)}
          onChange={(option) =>
            onOpinionChange(student.id, 'opinionCuca', String(option?.value || ''))
          }
          isClearable={false}
        />
      </CTableDataCell>

      {/* Commentaire CUCA / Commission */}
      <CTableDataCell>
        <CFormInput
          value={student.commentaireCuca || ''}
          onChange={(e) =>
            onCommentChange(student.id, 'commentaireCuca', e.target.value)
          }
        />
      </CTableDataCell>

      {/* Opinion CUO (non spécial) */}
      {!isSpecialFiliere && (
        <CTableDataCell>
          <Select
            options={opinionOptions}
            value={opinionOptions.find((opt) => opt.value === student.opinionCuo)}
            onChange={(option) =>
              onOpinionChange(student.id, 'opinionCuo', String(option?.value || ''))
            }
            isClearable={false}
          />
        </CTableDataCell>
      )}

      {/* Commentaire CUO (non spécial) */}
      {!isSpecialFiliere && (
        <CTableDataCell>
          <CFormInput
            value={student.commentaireCuo || ''}
            onChange={(e) =>
              onCommentChange(student.id, 'commentaireCuo', e.target.value)
            }
          />
        </CTableDataCell>
      )}

      {/* Mail CUCA envoyé */}
      <CTableDataCell>
        <CIcon
          icon={student.mailCucaEnvoye === 'Oui' ? cilCheckCircle : cilXCircle}
          className={
            student.mailCucaEnvoye === 'Oui' ? 'text-success' : 'text-danger'
          }
        />
        ({student.mailCucaCount || 0})
      </CTableDataCell>

      {/* Mail CUO envoyé (non spécial) */}
      {!isSpecialFiliere && (
        <CTableDataCell>
          <CIcon
            icon={student.mailCuoEnvoye === 'Oui' ? cilCheckCircle : cilXCircle}
            className={
              student.mailCuoEnvoye === 'Oui' ? 'text-success' : 'text-danger'
            }
          />
          ({student.mailCuoCount || 0})
        </CTableDataCell>
      )}

      {/* Exonéré */}
      <CTableDataCell>
        <CFormSwitch
          id={`exonere-${student.id}`}
          checked={student.exonere === 'Oui'}
          onChange={(e) => onStatusChange(student.id, 'exonere', e.target.checked)}
          label=""
        />
      </CTableDataCell>

      {/* Sponsorisé */}
      <CTableDataCell>
        <CFormSwitch
          id={`sponsorise-${student.id}`}
          checked={student.sponsorise === 'Oui'}
          onChange={(e) => onStatusChange(student.id, 'sponsorise', e.target.checked)}
          label=""
        />
      </CTableDataCell>

      {/* Statut */}
      <CTableDataCell>
        <CBadge color={getStatusColor(student.status)}>
          {getStatusLabel(student.status)}
        </CBadge>
      </CTableDataCell>
    </CTableRow>
  )
}

export default PendingStudentRow
