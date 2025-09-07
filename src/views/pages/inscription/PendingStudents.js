import React, { useState, useEffect } from 'react'
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
  CForm,
  CListGroup,
  CListGroupItem,
  CAlert,
  CFormCheck,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'

import { cilCheckCircle, cilXCircle } from '@coreui/icons'
import usePendingStudentsData from '../../../hooks/inscription/usePendingSudentsData'
import debounce from 'lodash/debounce'
import Swal from 'sweetalert2'

const PendingStudents = () => {
  const {
    pendingStudents,
    filterOptions,
    selectedFiliere,
    setSelectedFiliere,
    selectedYear,
    setSelectedYear,
    selectedEntryDiploma,
    setSelectedEntryDiploma,
    selectedStatut,
    setSelectedStatut,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    loading,
    error,
    updateStudentPieces,
    sendStudentMail,
    exportData,
  } = usePendingStudentsData()

  const [modalVisible, setModalVisible] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [pieces, setPieces] = useState([])
  const [editedData, setEditedData] = useState(pendingStudents)
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const [selectedStudents, setSelectedStudents] = useState([])

  const specialFilieres = ['Droit', 'Médecine', 'Informatique'] // Exemple de filières spéciales
  const isSpecialFiliere = specialFilieres.includes(selectedFiliere)

  // Debounce la recherche pour éviter la perte de focus
  const debouncedSetSearchQuery = debounce(setSearchQuery, 300)

  // Gérer les changements de filtre
  const handleFilterChange = (name, option) => {
    const value = option ? option.value : 'all'
    if (name === 'filiere') setSelectedFiliere(value)
    if (name === 'year') setSelectedYear(value)
    if (name === 'entryDiploma') setSelectedEntryDiploma(value)
    if (name === 'statut') setSelectedStatut(value)
    setCurrentPage(1) // Réinitialiser à la première page
  }

  // Gérer la recherche locale avant debounce
  const handleSearchChange = (e) => {
    const value = e.target.value
    setLocalSearchQuery(value)
    debouncedSetSearchQuery(value)
    setCurrentPage(1) // Réinitialiser à la première page
  }

  // Gérer le changement de page
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Gérer l'ouverture de la modale
  const handleOpenModal = (student) => {
    setSelectedStudent(student)
    setPieces(student.pieces || [])
    setModalVisible(true)
  }

  // Gérer la modification des pièces
  const handlePieceChange = (index, value) => {
    const updatedPieces = [...pieces]
    updatedPieces[index] = value
    setPieces(updatedPieces)
  }

  // Sauvegarder les pièces modifiées
  const handleSavePieces = async () => {
    const result = await updateStudentPieces(selectedStudent.id, pieces)
    if (result.success) {
      setModalVisible(false)
      setEditedData((prev) =>
        prev.map((student) =>
          student.id === selectedStudent.id ? { ...student, pieces } : student,
        ),
      )
    }
  }

  // Gérer les changements d'opinion
  const handleOpinionChange = (studentId, type, value) => {
    setEditedData((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
          const newComment = value === 'Favorable' ? 'Favorable' : 'Défavorable'
          const updatedStudent = { ...student, [type]: value }
          if (type === 'opinionCuca') {
            updatedStudent.commentaireCuca = newComment
          } else if (type === 'opinionCuo') {
            updatedStudent.commentaireCuo = newComment
          }
          return updatedStudent
        }
        return student
      }),
    )
  }

  // Gérer les changements de commentaire
  const handleCommentChange = (studentId, type, value) => {
    setEditedData((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
          const updatedStudent = { ...student }
          if (type === 'commentaireCuca') {
            updatedStudent.commentaireCuca = value
          } else if (type === 'commentaireCuo') {
            updatedStudent.commentaireCuo = value
          }
          return updatedStudent
        }
        return student
      }),
    )
  }

  // Gérer la sélection multiple des étudiants
  const handleSelectStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  // Gérer l'envoi de mail pour les étudiants sélectionnés
  const handleSendMail = async (type) => {
    if (selectedStudents.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sélection requise',
        text: 'Veuillez sélectionner au moins un étudiant.',
      })
      return
    }

    const studentsData = selectedStudents.map((studentId) => {
      const student = editedData.find((s) => s.id === studentId)
      return {
        studentId,
        opinionCuca: student.opinionCuca,
        commentaireCuca: student.commentaireCuca,
        opinionCuo: student.opinionCuo,
        commentaireCuo: student.commentaireCuo,
      }
    })

    const result = await sendStudentMail(studentsData)
    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: `Mail${selectedStudents.length > 1 ? 's' : ''} envoyé${selectedStudents.length > 1 ? 's' : ''} avec succès.`,
      })
      setSelectedStudents([]) // Réinitialiser la sélection
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: result.error || "Échec de l'envoi du mail.",
      })
    }
  }

  // Gérer l'exportation
  const handleExport = async (format) => {
    if (selectedYear === 'all' || selectedFiliere === 'all') {
      Swal.fire({
        icon: 'warning',
        title: 'Sélection requise',
        text: "Veuillez sélectionner une année académique et une filière avant d'exporter.",
      })
      return
    }

    const result = await exportData(format)
    if (result.success) {
      const a = document.createElement('a')
      a.href = result.url
      a.download = `pending_students.${format}`
      a.click()
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: `Exportation en ${format} réussie.`,
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: result.error || "Échec de l'export.",
      })
    }
  }

  // Synchroniser editedData avec pendingStudents lors du chargement
  useEffect(() => {
    setEditedData(pendingStudents)
  }, [pendingStudents])

  // Options pour react-select
  const selectOptions = {
    filiere: [
      { value: 'all', label: 'Toutes les filières' },
      ...(filterOptions.filieres || []).map((f) => ({ value: f, label: f })),
    ],
    year: [
      { value: 'all', label: 'Toutes les années' },
      ...(filterOptions.years || []).map((y) => ({ value: y, label: y })),
    ],
    entryDiploma: [
      { value: 'all', label: 'Tous les diplômes' },
      ...(filterOptions.entryDiplomas || []).map((d) => ({ value: d, label: d })),
    ],
    statut: [
      { value: 'all', label: 'Tous les statuts' },
      ...(filterOptions.statuts || []).map((s) => ({ value: s, label: s })),
    ],
  }

  // Options pour opinion select
  const opinionOptions = [
    { value: 'Favorable', label: 'Favorable' },
    { value: 'Défavorable', label: 'Défavorable' },
  ]

  return (
    <CCard className="mb-4 shadow-sm">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <span>Étudiants en Attente</span>
        <div>
          <CButton
            color="primary"
            variant="outline"
            className="me-2"
            onClick={() => handleExport('pdf')}
          >
            Exporter PDF
          </CButton>
          <CButton
            color="primary"
            variant="outline"
            className="me-2"
            onClick={() => handleExport('excel')}
          >
            Exporter Excel
          </CButton>
          <CButton color="primary" variant="outline" onClick={() => handleExport('word')}>
            Exporter Word
          </CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        {/* Afficher les erreurs */}
        {error && <CAlert color="danger">{error}</CAlert>}

        {/* Filtres et recherche */}
        <CRow className="mb-3">
          <CCol xs={12} md={3}>
            <label className="form-label fw-semibold">Filière</label>
            <Select
              options={selectOptions.filiere}
              value={selectOptions.filiere.find((opt) => opt.value === selectedFiliere)}
              onChange={(option) => handleFilterChange('filiere', option)}
              placeholder="Sélectionner une filière..."
              isClearable
            />
          </CCol>
          <CCol xs={12} md={3}>
            <label className="form-label fw-semibold">Année Académique</label>
            <Select
              options={selectOptions.year}
              value={selectOptions.year.find((opt) => opt.value === selectedYear)}
              onChange={(option) => handleFilterChange('year', option)}
              placeholder="Sélectionner une année..."
              isClearable
            />
          </CCol>
          <CCol xs={12} md={3}>
            <label className="form-label fw-semibold">Diplôme d'entrée</label>
            <Select
              options={selectOptions.entryDiploma}
              value={selectOptions.entryDiploma.find((opt) => opt.value === selectedEntryDiploma)}
              onChange={(option) => handleFilterChange('entryDiploma', option)}
              placeholder="Sélectionner un diplôme..."
              isClearable
            />
          </CCol>
          <CCol xs={12} md={3}>
            <label className="form-label fw-semibold">Statut</label>
            <Select
              options={selectOptions.statut}
              value={selectOptions.statut.find((opt) => opt.value === selectedStatut)}
              onChange={(option) => handleFilterChange('statut', option)}
              placeholder="Sélectionner un statut..."
              isClearable
            />
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol xs={12} md={6}>
            <CInputGroup>
              <CFormInput
                placeholder="Rechercher dans toutes les colonnes..."
                value={localSearchQuery}
                onChange={handleSearchChange}
              />
            </CInputGroup>
          </CCol>
          <CCol xs={12} md={6} className="d-flex justify-content-end">
            {selectedStudents.length > 0 && (
              <>
                <CButton
                  color="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleSendMail('CUCA')}
                >
                  Envoyer Mail CUCA
                </CButton>
                {!isSpecialFiliere && (
                  <CButton color="primary" size="sm" onClick={() => handleSendMail('CUO')}>
                    Envoyer Mail CUO
                  </CButton>
                )}
              </>
            )}
          </CCol>
        </CRow>

        {/* Tableau */}
        <CTable
          className="table table-bordered table-striped table-hover"
          style={{ fontSize: '0.9rem' }}
          align="middle"
          responsive
        >
          <CTableHead className="text-nowrap">
            <CTableRow>
              <CTableHeaderCell>
                <CFormCheck
                  id="selectAll"
                  checked={selectedStudents.length === editedData.length && editedData.length > 0}
                  onChange={(e) =>
                    setSelectedStudents(
                      e.target.checked ? editedData.map((student) => student.id) : [],
                    )
                  }
                />
              </CTableHeaderCell>
              <CTableHeaderCell>N°</CTableHeaderCell>
              <CTableHeaderCell>Nom et Prénoms</CTableHeaderCell>
              <CTableHeaderCell>Sexe</CTableHeaderCell>
              <CTableHeaderCell>Statut</CTableHeaderCell>
              <CTableHeaderCell>
                {isSpecialFiliere ? "Avis de la commission d'études" : 'Opinion Cuca'}
              </CTableHeaderCell>
              <CTableHeaderCell>
                {isSpecialFiliere ? "Commentaires de la commission d'études" : 'Commentaire Cuca'}
              </CTableHeaderCell>
              {!isSpecialFiliere && <CTableHeaderCell>Opinion CUO</CTableHeaderCell>}
              {!isSpecialFiliere && <CTableHeaderCell>Commentaire CUO</CTableHeaderCell>}
              <CTableHeaderCell>Mail CUCA envoyé</CTableHeaderCell>
              {!isSpecialFiliere && <CTableHeaderCell>Mail CUO envoyé</CTableHeaderCell>}
              <CTableHeaderCell>Pièces</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {editedData.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={isSpecialFiliere ? 9 : 12} className="text-center">
                  Aucun étudiant trouvé.
                </CTableDataCell>
              </CTableRow>
            ) : (
              editedData.map((student, index) => (
                <CTableRow key={student.id}>
                  <CTableDataCell>
                    <CFormCheck
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>{(currentPage - 1) * 10 + index + 1}</CTableDataCell>
                  <CTableDataCell>{student.nomPrenoms}</CTableDataCell>
                  <CTableDataCell>{student.sexe}</CTableDataCell>
                  <CTableDataCell>{student.statut}</CTableDataCell>
                  <CTableDataCell>
                    <Select
                      options={opinionOptions}
                      value={opinionOptions.find((opt) => opt.value === student.opinionCuca)}
                      onChange={(option) =>
                        handleOpinionChange(student.id, 'opinionCuca', option.value)
                      }
                      isClearable={false}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormInput
                      value={student.commentaireCuca}
                      onChange={(e) =>
                        handleCommentChange(student.id, 'commentaireCuca', e.target.value)
                      }
                    />
                  </CTableDataCell>
                  {!isSpecialFiliere && (
                    <CTableDataCell>
                      <Select
                        options={opinionOptions}
                        value={opinionOptions.find((opt) => opt.value === student.opinionCuo)}
                        onChange={(option) =>
                          handleOpinionChange(student.id, 'opinionCuo', option.value)
                        }
                        isClearable={false}
                      />
                    </CTableDataCell>
                  )}
                  {!isSpecialFiliere && (
                    <CTableDataCell>
                      <CFormInput
                        value={student.commentaireCuo}
                        onChange={(e) =>
                          handleCommentChange(student.id, 'commentaireCuo', e.target.value)
                        }
                      />
                    </CTableDataCell>
                  )}
                  <CTableDataCell>
                    <CIcon
                      icon={student.mailCucaEnvoye === 'Oui' ? cilCheckCircle : cilXCircle}
                      className={student.mailCucaEnvoye === 'Oui' ? 'text-success' : 'text-danger'}
                    />
                    ({student.mailCucaCount || 0})
                  </CTableDataCell>
                  {!isSpecialFiliere && (
                    <CTableDataCell>
                      <CIcon
                        icon={student.mailCuoEnvoye === 'Oui' ? cilCheckCircle : cilXCircle}
                        className={student.mailCuoEnvoye === 'Oui' ? 'text-success' : 'text-danger'}
                      />
                      ({student.mailCuoCount || 0})
                    </CTableDataCell>
                  )}
                  <CTableDataCell>
                    <CButton color="primary" size="sm" onClick={() => handleOpenModal(student)}>
                      Voir pièces
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

      {/* Modale pour les pièces */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Pièces du dossier de {selectedStudent?.nomPrenoms}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CListGroup>
              {pieces.map((piece, index) => (
                <CListGroupItem
                  key={index}
                  className="d-flex justify-content-between align-items-center"
                >
                  <CFormInput
                    value={piece}
                    onChange={(e) => handlePieceChange(index, e.target.value)}
                  />
                </CListGroupItem>
              ))}
            </CListGroup>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Annuler
          </CButton>
          <CButton color="primary" onClick={handleSavePieces}>
            Enregistrer
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default PendingStudents
