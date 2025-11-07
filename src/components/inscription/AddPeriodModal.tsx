import React from 'react'
import {
  CRow,
  CCol,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CFormCheck,
  CFormLabel,
} from '@coreui/react'
import { FormModal } from '../modals'
import { FormDatePicker } from '../forms'

interface AddPeriodModalProps {
  visible: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  periodStartDate: Date | null
  periodStartTime: Date | null
  periodEndDate: Date | null
  periodEndTime: Date | null
  setPeriodStartDate: (date: Date | null) => void
  setPeriodStartTime: (date: Date | null) => void
  setPeriodEndDate: (date: Date | null) => void
  setPeriodEndTime: (date: Date | null) => void
  filieres: any[]
  selectedFilieres: number[]
  setSelectedFilieres: (filieres: number[]) => void
  loading?: boolean
}

/**
 * AddPeriodModal - Modal d'ajout de période
 */
const AddPeriodModal: React.FC<AddPeriodModalProps> = ({
  visible,
  onClose,
  onSubmit,
  activeTab,
  setActiveTab,
  periodStartDate,
  periodStartTime,
  periodEndDate,
  periodEndTime,
  setPeriodStartDate,
  setPeriodStartTime,
  setPeriodEndDate,
  setPeriodEndTime,
  filieres,
  selectedFilieres,
  setSelectedFilieres,
  loading = false,
}) => {
  const handleFiliereToggle = (filiereId: number) => {
    setSelectedFilieres(
      selectedFilieres.includes(filiereId)
        ? selectedFilieres.filter((id) => id !== filiereId)
        : [...selectedFilieres, filiereId]
    )
  }

  return (
    <FormModal
      visible={visible}
      onClose={onClose}
      onSubmit={onSubmit}
      title="Ajouter une période"
      submitText="Ajouter"
      loading={loading}
      size="lg"
    >
      {/* Onglets Type de période */}
      <CNav variant="tabs" className="mb-3">
        <CNavItem>
          <CNavLink
            active={activeTab === 'depot'}
            onClick={() => setActiveTab('depot')}
            style={{ cursor: 'pointer' }}
          >
            Dépôt de dossiers
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={activeTab === 'choix'}
            onClick={() => setActiveTab('choix')}
            style={{ cursor: 'pointer' }}
          >
            Choix de filière
          </CNavLink>
        </CNavItem>
      </CNav>

      <CTabContent>
        <CTabPane visible={activeTab === 'depot' || activeTab === 'choix'}>
          {/* Dates et heures */}
          <CRow>
            <CCol md={6}>
              <FormDatePicker
                id="periodStartDate"
                label="Date de début"
                selected={periodStartDate}
                onChange={setPeriodStartDate}
                required
              />
            </CCol>
            <CCol md={6}>
              <FormDatePicker
                id="periodStartTime"
                label="Heure de début"
                selected={periodStartTime}
                onChange={setPeriodStartTime}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="HH:mm"
                required
              />
            </CCol>
          </CRow>

          <CRow>
            <CCol md={6}>
              <FormDatePicker
                id="periodEndDate"
                label="Date de fin"
                selected={periodEndDate}
                onChange={setPeriodEndDate}
                minDate={periodStartDate || undefined}
                required
              />
            </CCol>
            <CCol md={6}>
              <FormDatePicker
                id="periodEndTime"
                label="Heure de fin"
                selected={periodEndTime}
                onChange={setPeriodEndTime}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="HH:mm"
                required
              />
            </CCol>
          </CRow>

          {/* Sélection des filières */}
          <div className="mb-3">
            <CFormLabel>Filières concernées</CFormLabel>
            <div className="border rounded p-3">
              {filieres.map((filiere: any) => (
                <CFormCheck
                  key={filiere.id || filiere}
                  id={`filiere-${filiere.id || filiere}`}
                  label={filiere.name || filiere.title || filiere}
                  checked={selectedFilieres.includes(filiere.id || filiere)}
                  onChange={() => handleFiliereToggle(filiere.id || filiere)}
                  className="mb-2"
                />
              ))}
            </div>
          </div>
        </CTabPane>
      </CTabContent>
    </FormModal>
  )
}

export default AddPeriodModal
