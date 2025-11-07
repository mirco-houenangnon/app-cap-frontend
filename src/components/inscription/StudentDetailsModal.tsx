import React from 'react'
import {
  CButton,
  CListGroup,
  CListGroupItem,
  CRow,
  CCol,
} from '@coreui/react'
import { BaseModal } from '../modals'
import { Avatar, LoadingSpinner } from '../common'
import { StudentDetails } from '../../types/inscription.types'

interface StudentDetailsModalProps {
  visible: boolean
  student: StudentDetails | null
  loading: boolean
  onClose: () => void
  onEdit: () => void
}

/**
 * StudentDetailsModal - Affiche les détails d'un étudiant
 */
const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  visible,
  student,
  loading,
  onClose,
  onEdit,
}) => {
  const footer = (
    <>
      <CButton color="secondary" onClick={onClose}>
        Fermer
      </CButton>
      <CButton color="primary" onClick={onEdit}>
        Modifier
      </CButton>
    </>
  )

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title="Détails de l'étudiant"
      footer={footer}
      size="lg"
    >
      {loading && <LoadingSpinner message="Chargement des détails..." />}
      
      {!loading && student && (
        <>
          <div className="text-center mb-4">
            <Avatar
              src={student.photo}
              alt={student.nomPrenoms}
              size="xl"
            />
            <h4 className="mt-3">{student.nomPrenoms}</h4>
          </div>

          <CRow>
            <CCol md={6}>
              <CListGroup>
                <CListGroupItem>
                  <strong>Email :</strong> {student.email}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Téléphone :</strong> {student.telephone || 'Non renseigné'}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Sexe :</strong>{' '}
                  {student.sexe === 'M' ? 'Masculin' : 'Féminin'}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Date de naissance :</strong> {student.dateNaissance}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Lieu de naissance :</strong> {student.lieuNaissance || 'Non renseigné'}
                </CListGroupItem>
              </CListGroup>
            </CCol>
            <CCol md={6}>
              <CListGroup>
                <CListGroupItem>
                  <strong>Filière :</strong> {student.filiere}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Niveau :</strong> {student.niveau}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Année scolaire :</strong> {student.annee}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Statut :</strong>{' '}
                  {student.redoublant === 'Oui' ? 'Redoublant' : 'Normal'}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Diplôme d'entrée :</strong> {student.entryDiploma || 'Non renseigné'}
                </CListGroupItem>
                {student.matricule && (
                  <CListGroupItem>
                    <strong>Matricule :</strong> {student.matricule}
                  </CListGroupItem>
                )}
                {student.groupe && (
                  <CListGroupItem>
                    <strong>Groupe :</strong> {student.groupe}
                  </CListGroupItem>
                )}
              </CListGroup>
            </CCol>
          </CRow>
        </>
      )}
    </BaseModal>
  )
}

export default StudentDetailsModal
