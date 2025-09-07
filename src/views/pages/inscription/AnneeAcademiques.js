import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CBadge,
  CListGroup,
  CListGroupItem,
  CAlert,
} from '@coreui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import useAnneeAcademiquesData from '../../../hooks/inscription/useAnneeAcademiqueData'
import Swal from 'sweetalert2'

const AnneeAcademiques = () => {
  const { academicYears, filieres, loading, error, createAcademicYear, addPeriod, getPeriods } =
    useAnneeAcademiquesData()

  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [addPeriodModalVisible, setAddPeriodModalVisible] = useState(false)
  const [periodsModalVisible, setPeriodsModalVisible] = useState(false)
  const [selectedYearId, setSelectedYearId] = useState(null)
  const [newYearStart, setNewYearStart] = useState(null)
  const [newYearEnd, setNewYearEnd] = useState(null)
  const [activeTab, setActiveTab] = useState('depot')
  const [periodStartDate, setPeriodStartDate] = useState(null)
  const [periodStartTime, setPeriodStartTime] = useState(null)
  const [periodEndDate, setPeriodEndDate] = useState(null)
  const [periodEndTime, setPeriodEndTime] = useState(null)
  const [selectedFilieres, setSelectedFilieres] = useState(filieres)
  const [periods, setPeriods] = useState([])

  const handleCreateYear = async () => {
    if (!newYearStart || !newYearEnd) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation',
        text: 'Veuillez sélectionner les dates de début et de fin.',
      })
      return
    }

    const today = new Date()
    const startDateOnly = new Date(newYearStart.setHours(0, 0, 0, 0))
    const todayOnly = new Date(today.setHours(0, 0, 0, 0))

    if (startDateOnly < todayOnly) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation',
        text: "La date de début d'une année académique ne peut pas être antérieure à la date actuelle.",
      })
      return
    }

    if (newYearStart >= newYearEnd) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation',
        text: 'La date de début doit être antérieure à la date de fin.',
      })
      return
    }

    const result = await createAcademicYear(newYearStart, newYearEnd)
    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Année académique créée avec succès.',
      })
      setCreateModalVisible(false)
      setNewYearStart(null)
      setNewYearEnd(null)
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Échec de la création de l'année académique.",
      })
    }
  }

  const handleAddPeriod = async () => {
    if (
      !periodStartDate ||
      !periodEndDate ||
      !periodStartTime ||
      !periodEndTime ||
      selectedFilieres.length === 0
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation',
        text: 'Veuillez remplir tous les champs et sélectionner au moins une filière.',
      })
      return
    }

    const today = new Date()
    const startDateOnly = new Date(periodStartDate.setHours(0, 0, 0, 0))
    const todayOnly = new Date(today.setHours(0, 0, 0, 0))

    if (startDateOnly < todayOnly) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation',
        text: 'La date de début de la période ne peut pas être antérieure à la date actuelle.',
      })
      return
    }

    if (periodStartDate >= periodEndDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation',
        text: 'La date de début doit être antérieure à la date de fin.',
      })
      return
    }

    const result = await addPeriod(
      selectedYearId,
      activeTab,
      periodStartDate,
      periodStartTime,
      periodEndDate,
      periodEndTime,
      selectedFilieres,
    )

    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Période ajoutée avec succès.',
      })
      setAddPeriodModalVisible(false)
      setPeriodStartDate(null)
      setPeriodStartTime(null)
      setPeriodEndDate(null)
      setPeriodEndTime(null)
      setSelectedFilieres(filieres)
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: result.error || "Échec de l'ajout de la période.",
      })
    }
  }

  const handleShowPeriods = async (yearId) => {
    const periodsData = await getPeriods(yearId)
    setPeriods(periodsData)
    setPeriodsModalVisible(true)
  }

  const handleFiliereChange = (filiere) => {
    setSelectedFilieres((prev) =>
      prev.includes(filiere) ? prev.filter((f) => f !== filiere) : [...prev, filiere],
    )
  }

  const openAddPeriodModal = (yearId) => {
    setSelectedYearId(yearId)
    setAddPeriodModalVisible(true)
    setSelectedFilieres(filieres)
  }

  if (loading) {
    return <div className="text-center py-3">Chargement des données...</div>
  }
  const monthsLater = new Date()
  monthsLater.setMonth(monthsLater.getMonth() + 6)

  return (
    <CCard className="mb-4 shadow-sm">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <span className="fw-bold">Années Académiques</span>
        <CButton color="outline-primary" size="sm" onClick={() => setCreateModalVisible(true)}>
          Créer une année académique
        </CButton>
      </CCardHeader>
      <CCardBody>
        {error && <CAlert color="danger">{error}</CAlert>}

        <CTable align="middle" responsive bordered>
          <CTableHead className="text-nowrap table-light">
            <CTableRow>
              <CTableHeaderCell className="text-center">Année Académique</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Début</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Fin</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Ajouter une période</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Périodes</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {academicYears.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={5} className="text-center text-muted py-3">
                  Aucune année académique trouvée.
                </CTableDataCell>
              </CTableRow>
            ) : (
              academicYears.map((year) => (
                <CTableRow key={year.id}>
                  <CTableDataCell className="text-center">{year.annee}</CTableDataCell>
                  <CTableDataCell className="text-center">{year.debut}</CTableDataCell>
                  <CTableDataCell className="text-center">{year.fin}</CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CButton
                      color="outline-success"
                      size="sm"
                      onClick={() => openAddPeriodModal(year.id)}
                    >
                      Ajouter
                    </CButton>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CButton
                      color="outline-secondary"
                      size="sm"
                      onClick={() => handleShowPeriods(year.id)}
                    >
                      Voir
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </CCardBody>

      {/* Modale Créer année */}
      <CModal visible={createModalVisible} onClose={() => setCreateModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Créer une année académique</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4">
          <CForm>
            <CRow className="mb-3">
              <CCol md="3" className="d-flex align-items-center">
                <label className="form-label mb-0">Date de début</label>
              </CCol>
              <CCol md="9">
                <DatePicker
                  selected={newYearStart}
                  onChange={(date) => setNewYearStart(date)}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  placeholderText="Choisir la date de début (jj/mm/aaaa)"
                  minDate={new Date()}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md="3" className="d-flex align-items-center">
                <label className="form-label mb-0">Date de fin</label>
              </CCol>
              <CCol md="9">
                <DatePicker
                  selected={newYearEnd}
                  onChange={(date) => setNewYearEnd(date)}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  placeholderText="Choisir la date de fin (jj/mm/aaaa)"
                  minDate={(() => {
                    const monthsLater = new Date()
                    monthsLater.setMonth(monthsLater.getMonth() + 6)
                    return monthsLater
                  })()}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="outline-secondary" onClick={() => setCreateModalVisible(false)}>
            Annuler
          </CButton>
          <CButton color="outline-primary" onClick={handleCreateYear}>
            Créer
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={addPeriodModalVisible}
        onClose={() => setAddPeriodModalVisible(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Ajouter une période</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4">
          <CNav variant="tabs" className="mb-3">
            <CNavItem>
              <CNavLink active={activeTab === 'depot'} onClick={() => setActiveTab('depot')}>
                Dépôt de dossier
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'reclamation'}
                onClick={() => setActiveTab('reclamation')}
              >
                Période de réclamation
              </CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent>
            <CTabPane visible={true}>
              <CForm>
                <CRow className="mb-3">
                  <CCol md="3" className="d-flex align-items-center">
                    <label className="form-label mb-0">Date de début</label>
                  </CCol>
                  <CCol md="9">
                    <DatePicker
                      selected={periodStartDate}
                      onChange={(date) => setPeriodStartDate(date)}
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      placeholderText="Choisir la date de début (jj/mm/aaaa)"
                      minDate={new Date()}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md="3" className="d-flex align-items-center">
                    <label className="form-label mb-0">Heure de début</label>
                  </CCol>
                  <CCol md="9">
                    <DatePicker
                      selected={periodStartTime}
                      onChange={(date) => setPeriodStartTime(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Heure"
                      dateFormat="HH:mm"
                      className="form-control"
                      placeholderText="Choisir l'heure de début (hh:mm)"
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md="3" className="d-flex align-items-center">
                    <label className="form-label mb-0">Date de fin</label>
                  </CCol>
                  <CCol md="9">
                    <DatePicker
                      selected={periodEndDate}
                      onChange={(date) => setPeriodEndDate(date)}
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      placeholderText="Choisir la date de fin (jj/mm/aaaa)"
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md="3" className="d-flex align-items-center">
                    <label className="form-label mb-0">Heure de fin</label>
                  </CCol>
                  <CCol md="9">
                    <DatePicker
                      selected={periodEndTime}
                      onChange={(date) => setPeriodEndTime(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Heure"
                      dateFormat="HH:mm"
                      className="form-control"
                      placeholderText="Choisir l'heure de fin (hh:mm)"
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md="3" className="d-flex align-items-center">
                    <label className="form-label mb-0">Filières</label>
                  </CCol>
                  <CCol md="9">
                    <CRow>
                      {filieres.map((filiere) => {
                        const isSelected = selectedFilieres.includes(filiere)
                        return (
                          <CCol xs="6" key={filiere} className="mb-2">
                            <CBadge
                              component="button"
                              color={isSelected ? 'success' : 'secondary'}
                              shape="rounded-pill"
                              className={`px-3 py-2 w-100 text-start shadow-sm border ${isSelected ? 'fw-bold' : ''}`}
                              onClick={() => handleFiliereChange(filiere)}
                            >
                              {isSelected && <span className="me-2">✔</span>}
                              {filiere}
                            </CBadge>
                          </CCol>
                        )
                      })}
                    </CRow>
                  </CCol>
                </CRow>
              </CForm>
            </CTabPane>
          </CTabContent>
        </CModalBody>
        <CModalFooter>
          <CButton color="outline-secondary" onClick={() => setAddPeriodModalVisible(false)}>
            Annuler
          </CButton>
          <CButton color="outline-success" onClick={handleAddPeriod}>
            Ajouter
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modale Voir périodes */}
      <CModal visible={periodsModalVisible} onClose={() => setPeriodsModalVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Périodes définies</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4">
          <CListGroup>
            {periods.length === 0 ? (
              <CListGroupItem>Aucune période définie.</CListGroupItem>
            ) : (
              periods.map((period, index) => (
                <CListGroupItem key={index} className="mb-2 shadow-sm p-3 rounded">
                  <p className="mb-1">
                    <strong>Type:</strong>{' '}
                    <CBadge
                      color={period.type === 'depot' ? 'success' : 'warning'}
                      className="px-2 py-1"
                    >
                      {period.type === 'depot' ? 'Dépôt de dossier' : 'Réclamation'}
                    </CBadge>
                  </p>
                  <p className="mb-1">
                    <strong>Début:</strong> {period.start}
                  </p>
                  <p className="mb-1">
                    <strong>Fin:</strong> {period.end}
                  </p>
                  <p className="mb-0">
                    <strong>Filières:</strong>{' '}
                    {period.filieres && period.filieres.length > 0 ? (
                      period.filieres.map((filiere, i) => (
                        <CBadge key={i} color="info" className="me-1 px-2 py-1">
                          {filiere}
                        </CBadge>
                      ))
                    ) : (
                      <span>Aucune</span>
                    )}
                  </p>
                </CListGroupItem>
              ))
            )}
          </CListGroup>
        </CModalBody>
        <CModalFooter>
          <CButton color="outline-secondary" onClick={() => setPeriodsModalVisible(false)}>
            Fermer
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default AnneeAcademiques
