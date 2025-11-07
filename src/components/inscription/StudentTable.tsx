import React from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
} from '@coreui/react'
import { Avatar, LoadingSpinner, EmptyState } from '../common'

interface Student {
  id: number
  matricule?: string
  nomPrenoms: string
  email: string
  filiere: string
  niveau: string
  sexe: string
  redoublant: string
  photo?: string | null
}

interface StudentTableProps {
  students: Student[]
  loading: boolean
  onRowClick: (studentId: number) => void
}

/**
 * StudentTable - Affiche la liste des étudiants dans un tableau
 */
const StudentTable: React.FC<StudentTableProps> = ({
  students,
  loading,
  onRowClick,
}) => {
  if (loading) {
    return <LoadingSpinner message="Chargement des étudiants..." />
  }

  if (!students || students.length === 0) {
    return (
      <EmptyState
        title="Aucun étudiant trouvé"
        message="Aucun étudiant ne correspond aux critères de recherche."
      />
    )
  }

  return (
    <CTable hover responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Photo</CTableHeaderCell>
          <CTableHeaderCell>Matricule</CTableHeaderCell>
          <CTableHeaderCell>Nom et Prénoms</CTableHeaderCell>
          <CTableHeaderCell>Email</CTableHeaderCell>
          <CTableHeaderCell>Filière</CTableHeaderCell>
          <CTableHeaderCell>Niveau</CTableHeaderCell>
          <CTableHeaderCell>Sexe</CTableHeaderCell>
          <CTableHeaderCell>Statut</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {students.map((student) => (
          <CTableRow
            key={student.id}
            onClick={() => onRowClick(student.id)}
            style={{ cursor: 'pointer' }}
          >
            <CTableDataCell>
              <Avatar
                src={student.photo}
                alt={student.nomPrenoms}
                size="sm"
              />
            </CTableDataCell>
            <CTableDataCell>{student.matricule || 'N/A'}</CTableDataCell>
            <CTableDataCell>{student.nomPrenoms}</CTableDataCell>
            <CTableDataCell>{student.email}</CTableDataCell>
            <CTableDataCell>{student.filiere}</CTableDataCell>
            <CTableDataCell>{student.niveau}</CTableDataCell>
            <CTableDataCell>
              {student.sexe === 'M' ? 'Masculin' : 'Féminin'}
            </CTableDataCell>
            <CTableDataCell>
              {student.redoublant === 'Oui' ? (
                <CBadge color="warning">Redoublant</CBadge>
              ) : (
                <CBadge color="success">Normal</CBadge>
              )}
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  )
}

export default StudentTable
