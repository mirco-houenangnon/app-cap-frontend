import React from 'react'
import { CRow, CCol, CFormCheck } from '@coreui/react'
import { FormModal } from '../modals'
import { FormDatePicker } from '../forms'

interface AcademicYearFormProps {
  visible: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  newYearStart: Date | null
  newYearEnd: Date | null
  submissionStart: Date | null
  submissionEnd: Date | null
  includeSubmissionPeriod: boolean
  setNewYearStart: (date: Date | null) => void
  setNewYearEnd: (date: Date | null) => void
  setSubmissionStart: (date: Date | null) => void
  setSubmissionEnd: (date: Date | null) => void
  setIncludeSubmissionPeriod: (value: boolean) => void
  loading?: boolean
}

/**
 * AcademicYearForm - Formulaire de création d'année académique
 */
const AcademicYearForm: React.FC<AcademicYearFormProps> = ({
  visible,
  onClose,
  onSubmit,
  newYearStart,
  newYearEnd,
  submissionStart,
  submissionEnd,
  includeSubmissionPeriod,
  setNewYearStart,
  setNewYearEnd,
  setSubmissionStart,
  setSubmissionEnd,
  setIncludeSubmissionPeriod,
  loading = false,
}) => {
  return (
    <FormModal
      visible={visible}
      onClose={onClose}
      onSubmit={onSubmit}
      title="Créer une nouvelle année académique"
      submitText="Créer"
      loading={loading}
      size="lg"
    >
      <CRow>
        <CCol md={6}>
          <FormDatePicker
            id="newYearStart"
            label="Date de début"
            selected={newYearStart}
            onChange={setNewYearStart}
            minDate={new Date()}
            required
          />
        </CCol>
        <CCol md={6}>
          <FormDatePicker
            id="newYearEnd"
            label="Date de fin"
            selected={newYearEnd}
            onChange={setNewYearEnd}
            minDate={newYearStart || new Date()}
            required
          />
        </CCol>
      </CRow>

      <CFormCheck
        id="includeSubmissionPeriod"
        label="Inclure une période de soumission des demandes"
        checked={includeSubmissionPeriod}
        onChange={(e) => setIncludeSubmissionPeriod(e.target.checked)}
        className="mb-3"
      />

      {includeSubmissionPeriod && (
        <CRow>
          <CCol md={6}>
            <FormDatePicker
              id="submissionStart"
              label="Début de soumission"
              selected={submissionStart}
              onChange={setSubmissionStart}
              minDate={newYearStart || new Date()}
              maxDate={newYearEnd || undefined}
              required
            />
          </CCol>
          <CCol md={6}>
            <FormDatePicker
              id="submissionEnd"
              label="Fin de soumission"
              selected={submissionEnd}
              onChange={setSubmissionEnd}
              minDate={submissionStart || newYearStart || new Date()}
              maxDate={newYearEnd || undefined}
              required
            />
          </CCol>
        </CRow>
      )}
    </FormModal>
  )
}

export default AcademicYearForm
