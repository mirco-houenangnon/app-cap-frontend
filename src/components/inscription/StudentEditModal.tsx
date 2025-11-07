import React from 'react'
import { CRow, CCol } from '@coreui/react'
import { FormModal } from '../modals'
import { FormField, FormSelect } from '../forms'

interface EditFormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  gender: string
  date_of_birth: string
}

interface StudentEditModalProps {
  visible: boolean
  formData: EditFormData
  loading: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onChange: (field: string, value: string) => void
}

/**
 * StudentEditModal - Modal d'édition des informations d'un étudiant
 */
const StudentEditModal: React.FC<StudentEditModalProps> = ({
  visible,
  formData,
  loading,
  onClose,
  onSubmit,
  onChange,
}) => {
  const genderOptions = [
    { value: 'M', label: 'Masculin' },
    { value: 'F', label: 'Féminin' },
  ]

  return (
    <FormModal
      visible={visible}
      onClose={onClose}
      onSubmit={onSubmit}
      title="Modifier l'étudiant"
      submitText="Enregistrer"
      loading={loading}
      size="lg"
    >
      <CRow>
        <CCol md={6}>
          <FormField
            id="first_name"
            label="Prénom(s)"
            value={formData.first_name}
            onChange={(e) => onChange('first_name', e.target.value)}
            required
          />
        </CCol>
        <CCol md={6}>
          <FormField
            id="last_name"
            label="Nom"
            value={formData.last_name}
            onChange={(e) => onChange('last_name', e.target.value)}
            required
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol md={6}>
          <FormField
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            required
          />
        </CCol>
        <CCol md={6}>
          <FormField
            id="phone"
            label="Téléphone"
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            required
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol md={6}>
          <FormSelect
            id="gender"
            label="Sexe"
            value={formData.gender}
            onChange={(e) => onChange('gender', e.target.value)}
            options={genderOptions}
            required
          />
        </CCol>
        <CCol md={6}>
          <FormField
            id="date_of_birth"
            label="Date de naissance"
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => onChange('date_of_birth', e.target.value)}
            required
          />
        </CCol>
      </CRow>
    </FormModal>
  )
}

export default StudentEditModal
