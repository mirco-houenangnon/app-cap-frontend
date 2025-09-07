import React, { useState } from 'react'
import Select from 'react-select'
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
  CInputGroup,
  CFormInput,
  CPagination,
  CPaginationItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
} from '@coreui/react'
import useStudentsListData from '../../../hooks/inscription/useStudentsListData'
import debounce from 'lodash/debounce'
import Swal from 'sweetalert2'

const StudentsList = () => {
  const {
    students,
    filterOptions,
    selectedYear,
    setSelectedYear,
    selectedFiliere,
    setSelectedFiliere,
    selectedEntryDiploma,
    setSelectedEntryDiploma,
    selectedRedoublant,
    setSelectedRedoublant,
    selectedNiveau,
    setSelectedNiveau,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    studentDetails,
    getStudentDetails,
    exportList,
    loading,
    error,
  } = useStudentsListData()

  const [modalVisible, setModalVisible] = useState(false)
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)

  const debouncedSetSearchQuery = debounce(setSearchQuery, 300)

  const handleFilterChange = (name, option) => {
    const value = option ? option.value : 'all'
    if (name === 'year') setSelectedYear(value)
    if (name === 'filiere') setSelectedFiliere(value)
    if (name === 'entryDiploma') setSelectedEntryDiploma(value)
    if (name === 'redoublant') setSelectedRedoublant(value)
    if (name === 'niveau') setSelectedNiveau(value)
    setCurrentPage(1)
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setLocalSearchQuery(value)
    debouncedSetSearchQuery(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleOpenModal = async (studentId) => {
    const result = await getStudentDetails(studentId)
    if (result.success) {
      setModalVisible(true)
    }
  }

  const handleExport = async (type) => {
    if (selectedYear === 'all' || selectedFiliere === 'all' || selectedNiveau === 'all') {
      Swal.fire({
        icon: 'warning',
        title: 'Sélection requise',
        text: "Veuillez sélectionner une année académique, une filière et un niveau avant d'exporter.",
      })
      return
    }
    const result = await exportList(type)
    if (result.success) {
      const a = document.createElement('a')
      a.href = result.url
      a.download = `students_${type}_${selectedFiliere}_${selectedNiveau}.${type === 'emargement' ? 'pdf' : 'excel'}`
      a.click()
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: `Exportation de la liste ${type} réussie.`,
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Échec de l'export.",
      })
    }
  }

  const selectOptions = {
    year: [
      { value: 'all', label: 'Toutes les années' },
      ...(filterOptions.years || []).map((y) => ({ value: y, label: y })),
    ],
    filiere: [
      { value: 'all', label: 'Toutes les filières' },
      ...(filterOptions.filieres || []).map((f) => ({ value: f, label: f })),
    ],
    entryDiploma: [
      { value: 'all', label: 'Tous les diplômes' },
      ...(filterOptions.entryDiplomas || []).map((d) => ({ value: d, label: d })),
    ],
    redoublant: [
      { value: 'all', label: 'Tous' },
      { value: 'oui', label: 'Oui' },
      { value: 'non', label: 'Non' },
    ],
    niveau:
      selectedFiliere === 'all'
        ? [{ value: 'all', label: 'Tous les niveaux' }]
        : [
            { value: 'all', label: 'Tous les niveaux' },
            ...(filterOptions.niveaux?.[selectedFiliere] || []).map((n) => ({
              value: n,
              label: n,
            })),
          ],
  }

  if (loading) {
    return <div className="text-center py-3">Chargement des données...</div>
  }

  return (
    <CCard className="mb-4 shadow-sm">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <span className="fw-bold">Liste des Étudiants</span>
        <div>
          <CButton
            color="primary"
            variant="outline"
            size="sm"
            className="me-2"
            onClick={() => handleExport('emargement')}
          >
            Liste d'émargement
          </CButton>
          <CButton
            color="primary"
            variant="outline"
            size="sm"
            onClick={() => handleExport('notes')}
          >
            Liste de notes
          </CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        {error && <CAlert color="danger">{error}</CAlert>}

        {/* Filtres et recherche */}
        <CRow className="mb-3">
          <CCol xs={12} md={2}>
            <label className="form-label fw-semibold">Année Académique</label>
            <Select
              options={selectOptions.year}
              value={selectOptions.year.find((opt) => opt.value === selectedYear)}
              onChange={(option) => handleFilterChange('year', option)}
              placeholder="Sélectionner une année..."
              isClearable
            />
          </CCol>
          <CCol xs={12} md={2}>
            <label className="form-label fw-semibold">Filière</label>
            <Select
              options={selectOptions.filiere}
              value={selectOptions.filiere.find((opt) => opt.value === selectedFiliere)}
              onChange={(option) => handleFilterChange('filiere', option)}
              placeholder="Sélectionner une filière..."
              isClearable
            />
          </CCol>
          <CCol xs={12} md={2}>
            <label className="form-label fw-semibold">Niveau d'études</label>
            <Select
              options={selectOptions.niveau}
              value={selectOptions.niveau.find((opt) => opt.value === selectedNiveau)}
              onChange={(option) => handleFilterChange('niveau', option)}
              placeholder="Sélectionner un niveau..."
              isClearable
            />
          </CCol>
          <CCol xs={12} md={2}>
            <label className="form-label fw-semibold">Diplôme d'entrée</label>
            <Select
              options={selectOptions.entryDiploma}
              value={selectOptions.entryDiploma.find((opt) => opt.value === selectedEntryDiploma)}
              onChange={(option) => handleFilterChange('entryDiploma', option)}
              placeholder="Sélectionner un diplôme..."
              isClearable
            />
          </CCol>
          <CCol xs={12} md={2}>
            <label className="form-label fw-semibold">Redoublant</label>
            <Select
              options={selectOptions.redoublant}
              value={selectOptions.redoublant.find((opt) => opt.value === selectedRedoublant)}
              onChange={(option) => handleFilterChange('redoublant', option)}
              placeholder="Sélectionner oui/non..."
              isClearable
            />
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol xs={12} md={6}>
            <CInputGroup>
              <CFormInput
                placeholder="Rechercher..."
                value={localSearchQuery}
                onChange={handleSearchChange}
              />
            </CInputGroup>
          </CCol>
        </CRow>

        {/* Tableau */}
        <CTable align="middle" responsive bordered>
          <CTableHead className="text-nowrap table-light">
            <CTableRow>
              <CTableHeaderCell className="text-center">N°</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Matricule</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Nom et Prénoms</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Sexe</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Redoublant</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Date de naissance</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Détails</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {students.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={7} className="text-center text-muted py-3">
                  Aucun étudiant trouvé.
                </CTableDataCell>
              </CTableRow>
            ) : (
              students.map((student, index) => (
                <CTableRow key={student.id}>
                  <CTableDataCell className="text-center">
                    {(currentPage - 1) * 10 + index + 1}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">{student.matricule}</CTableDataCell>
                  <CTableDataCell className="text-center">{student.nomPrenoms}</CTableDataCell>
                  <CTableDataCell className="text-center">{student.sexe}</CTableDataCell>
                  <CTableDataCell className="text-center">{student.redoublant}</CTableDataCell>
                  <CTableDataCell className="text-center">{student.dateNaissance}</CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CButton
                      color="primary"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenModal(student.id)}
                    >
                      Détails
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>

        {/* Pagination */}
        <CPagination align="center" className="mt-3">
          <CPaginationItem
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Précédent
          </CPaginationItem>
          {[...Array(totalPages).keys()].map((page) => (
            <CPaginationItem
              key={page + 1}
              active={currentPage === page + 1}
              onClick={() => handlePageChange(page + 1)}
            >
              {page + 1}
            </CPaginationItem>
          ))}
          <CPaginationItem
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Suivant
          </CPaginationItem>
        </CPagination>
      </CCardBody>

      {/* Modale pour détails de l'étudiant */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Détails de l'étudiant</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {studentDetails ? (
            <CListGroup>
              <CListGroupItem>
                <strong>Matricule:</strong> {studentDetails.matricule}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Nom et Prénoms:</strong> {studentDetails.nomPrenoms}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Sexe:</strong> {studentDetails.sexe}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Redoublant:</strong> {studentDetails.redoublant}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Date de naissance:</strong> {studentDetails.dateNaissance}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Filière:</strong> {studentDetails.filiere}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Niveau:</strong> {studentDetails.niveau}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Année:</strong> {studentDetails.annee}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Diplôme d'entrée:</strong> {studentDetails.entryDiploma}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Statut:</strong> {studentDetails.statut}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Email:</strong> {studentDetails.email}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Téléphone:</strong> {studentDetails.telephone}
              </CListGroupItem>
            </CListGroup>
          ) : (
            <div>Chargement des détails...</div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="outline" onClick={() => setModalVisible(false)}>
            Fermer
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default StudentsList
