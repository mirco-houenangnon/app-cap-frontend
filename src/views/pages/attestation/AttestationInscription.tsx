import { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CSpinner,
  CPagination,
  CPaginationItem,
  CFormCheck,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilCheckAlt, cilSearch } from '@coreui/icons'
import { useFiltersData, useAnneeAcademiqueData } from '@/hooks/inscription'
import { AttestationFilters, PreviewModal } from '@/components/attestation'
import useDebounce from '@/hooks/common/useDebounce'
import usePagination from '@/hooks/common/usePagination'
import useModal from '@/hooks/common/useModal'
import type { EligibleStudent } from '@/types/attestation.types'
import attestationService from '@/services/attestation.service'

const AttestationInscription = () => {
  const { academicYears } = useAnneeAcademiqueData()

  const [students, setStudents]                 = useState<EligibleStudent[]>([])
  const [loading, setLoading]                   = useState(false)
  const [generating, setGenerating]             = useState<number | null>(null)
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])
  const [generatingBulk, setGeneratingBulk]     = useState(false)

  const previewModal = useModal()
  const [previewStudent, setPreviewStudent]               = useState<EligibleStudent | null>(null)
  const [attestationPreviewUrl, setAttestationPreviewUrl] = useState<string | undefined>()
  const [birthCertUrl, setBirthCertUrl]                   = useState<string | undefined>()

  const [selectedYear, setSelectedYear]       = useState('all')
  const [selectedFiliere, setSelectedFiliere] = useState('all')
  const [selectedCohort, setSelectedCohort]   = useState('all')
  const [searchQuery, setSearchQuery]         = useState('')
  const debouncedSearch                       = useDebounce(searchQuery, 500)

  const { currentPage, totalPages, goToPage, nextPage, previousPage,
          canGoNext, canGoPrevious, startIndex, endIndex } = usePagination({
    totalItems: students.length,
    itemsPerPage: 10,
  })

  const { departments } = useFiltersData(
    selectedYear !== 'all' ? parseInt(selectedYear) : null
  )

  // ── Chargement ──────────────────────────────────────────────────────────────
  const loadStudents = async (filters: Record<string, any> = {}) => {
    setLoading(true)
    try {
      const response = await attestationService.getEligibleForInscription(filters)
      setStudents(response.data.students || [])
    } catch (err: any) {
      const Swal = (await import('sweetalert2')).default
      Swal.fire({ icon: 'error', title: 'Erreur', text: err?.message || 'Chargement impossible' })
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadStudents({}) }, [])

  useEffect(() => {
    const filters: Record<string, any> = {}
    if (selectedYear    !== 'all') filters.academic_year_id = parseInt(selectedYear)
    if (selectedFiliere !== 'all') filters.department_id    = parseInt(selectedFiliere)
    if (debouncedSearch)           filters.search           = debouncedSearch
    loadStudents(filters)
  }, [debouncedSearch])

  // ── Filtres ─────────────────────────────────────────────────────────────────
  const handleFilterChange = (name: string, option: any) => {
    const value = option?.value || 'all'
    if (name === 'year')    setSelectedYear(value)
    if (name === 'filiere') setSelectedFiliere(value)
    if (name === 'cohort')  setSelectedCohort(value)

    const newYear    = name === 'year'    ? value : selectedYear
    const newFiliere = name === 'filiere' ? value : selectedFiliere

    const filters: Record<string, any> = {}
    if (newYear    !== 'all') filters.academic_year_id = parseInt(newYear)
    if (newFiliere !== 'all') filters.department_id    = parseInt(newFiliere)
    if (searchQuery)          filters.search           = searchQuery
    loadStudents(filters)
  }

  // ── Aperçu ──────────────────────────────────────────────────────────────────
  const handlePreview = async (student: EligibleStudent) => {
    setPreviewStudent(student)
    previewModal.open()
    try {
      const [attestationUrl, birthCertResponse] = await Promise.all([
        attestationService.generateInscription(student.student_pending_student_id),
        attestationService.getBirthCertificate(student.student_pending_student_id).catch(() => null),
      ])
      setAttestationPreviewUrl(attestationUrl)
      if (birthCertResponse?.data?.url) setBirthCertUrl(birthCertResponse.data.url)
    } catch {
      const Swal = (await import('sweetalert2')).default
      Swal.fire({ icon: 'error', title: 'Erreur', text: "Erreur lors de la génération de l'aperçu" })
    }
  }

  // ── Génération unitaire ─────────────────────────────────────────────────────
  const handleGenerate = async (studentPendingStudentId: number) => {
    setGenerating(studentPendingStudentId)
    try {
      const url = await attestationService.generateInscription(studentPendingStudentId)
      const link = document.createElement('a')
      link.href = url
      link.download = 'attestation-inscription.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      const Swal = (await import('sweetalert2')).default
      Swal.fire({ icon: 'success', title: 'Succès', text: 'Attestation générée avec succès', timer: 2000, showConfirmButton: false })
    } catch (err: any) {
      const Swal = (await import('sweetalert2')).default
      Swal.fire({ icon: 'error', title: 'Erreur', text: err?.message || 'Erreur lors de la génération' })
    } finally {
      setGenerating(null)
    }
  }

  // ── Modification des noms + re-preview ──────────────────────────────────────
  const handleUpdateNames = async (lastName: string, firstNames: string) => {
    if (!previewStudent) return
    await attestationService.updateStudentNames(previewStudent.student_pending_student_id, lastName, firstNames)
    const url = await attestationService.generateInscription(previewStudent.student_pending_student_id)
    setAttestationPreviewUrl(url)
  }

  const handleValidateAndDownload = async () => {
    if (!previewStudent) return
    await handleGenerate(previewStudent.student_pending_student_id)
  }

  // ── Sélection multiple ──────────────────────────────────────────────────────
  const handleSelectStudent = (id: number) =>
    setSelectedStudents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) setSelectedStudents([])
    else setSelectedStudents(students.map(s => s.student_pending_student_id))
  }

  // ── Génération en masse ─────────────────────────────────────────────────────
  const handleGenerateBulk = async () => {
    if (selectedStudents.length === 0) return
    setGeneratingBulk(true)
    try {
      const Swal = (await import('sweetalert2')).default
      const url  = await attestationService.generateMultipleInscription(selectedStudents)

      const link = document.createElement('a')
      link.href = url
      link.download = 'attestations-inscription.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: `${selectedStudents.length} attestation(s) générée(s) avec succès`,
        timer: 2000,
        showConfirmButton: false,
      })
      setSelectedStudents([])
    } catch (err: any) {
      const Swal = (await import('sweetalert2')).default
      Swal.fire({ icon: 'error', title: 'Erreur', text: err?.message || 'Erreur lors de la génération en masse' })
    } finally {
      setGeneratingBulk(false)
    }
  }

  // ── Rendu ───────────────────────────────────────────────────────────────────
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Attestations d'Inscription</strong>
              <small className="text-muted ms-2">— Étudiants avec inscription approuvée</small>
            </div>
            {students.length > 0 && (
              <CBadge color="primary" shape="rounded-pill">{students.length} étudiant(s)</CBadge>
            )}
          </CCardHeader>

          <CCardBody>
            {/* Barre d'actions masse */}
            {students.length > 0 && (
              <CRow className="mb-3">
                <CCol>
                  <CButton color="primary" onClick={handleSelectAll} className="me-2">
                    <CIcon icon={cilCheckAlt} className="me-1" />
                    {selectedStudents.length === students.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                  </CButton>
                  {selectedStudents.length > 0 && (
                    <CButton color="success" onClick={handleGenerateBulk} disabled={generatingBulk}>
                      {generatingBulk
                        ? <CSpinner size="sm" className="me-1" />
                        : <CIcon icon={cilCloudDownload} className="me-1" />}
                      Générer {selectedStudents.length} attestation(s)
                    </CButton>
                  )}
                </CCol>
              </CRow>
            )}

            {/* Filtres — pas de cohorte pour l'inscription */}
            <AttestationFilters
              filterOptions={{ years: academicYears, filieres: departments, cohorts: [] }}
              selectedYear={selectedYear}
              selectedFiliere={selectedFiliere}
              selectedCohort={selectedCohort}
              searchQuery={searchQuery}
              onFilterChange={handleFilterChange}
              onSearchChange={(e) => setSearchQuery(e.target.value)}
              showSearch
            />

            {/* Tableau */}
            {loading ? (
              <div className="text-center py-4">
                <CSpinner color="primary" />
              </div>
            ) : (
              <CTable striped hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell style={{ width: 50 }}>
                      <CFormCheck
                        checked={selectedStudents.length === students.length && students.length > 0}
                        onChange={handleSelectAll}
                      />
                    </CTableHeaderCell>
                    <CTableHeaderCell>Matricule</CTableHeaderCell>
                    <CTableHeaderCell>Nom</CTableHeaderCell>
                    <CTableHeaderCell>Prénoms</CTableHeaderCell>
                    <CTableHeaderCell>Filière</CTableHeaderCell>
                    <CTableHeaderCell>Niveau</CTableHeaderCell>
                    <CTableHeaderCell>Année académique</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {students.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan={8} className="text-center py-4 text-muted">
                        Aucun étudiant éligible à l'attestation d'inscription
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    students.slice(startIndex, endIndex).map((student) => (
                      <CTableRow key={student.id}>
                        <CTableDataCell>
                          <CFormCheck
                            checked={selectedStudents.includes(student.student_pending_student_id)}
                            onChange={() => handleSelectStudent(student.student_pending_student_id)}
                          />
                        </CTableDataCell>
                        <CTableDataCell>{student.student_id}</CTableDataCell>
                        <CTableDataCell className="fw-semibold">{student.last_name}</CTableDataCell>
                        <CTableDataCell>{student.first_names}</CTableDataCell>
                        <CTableDataCell>{student.department}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="info" shape="rounded-pill">
                            {(student as any).study_level || '—'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="text-muted">
                            {student.academic_year || '—'}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="info"
                            size="sm"
                            onClick={() => handlePreview(student)}
                            className="me-1"
                            title="Aperçu"
                          >
                            <CIcon icon={cilSearch} />
                          </CButton>
                          <CButton
                            color="success"
                            size="sm"
                            onClick={() => handleGenerate(student.student_pending_student_id)}
                            disabled={generating === student.student_pending_student_id}
                            title="Télécharger"
                          >
                            {generating === student.student_pending_student_id
                              ? <CSpinner size="sm" />
                              : <CIcon icon={cilCloudDownload} />}
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  )}
                </CTableBody>
              </CTable>
            )}

            {/* Pagination */}
            {students.length > 10 && (
              <CPagination align="center" className="mt-3">
                <CPaginationItem disabled={!canGoPrevious} onClick={previousPage}>Précédent</CPaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <CPaginationItem key={i + 1} active={currentPage === i + 1} onClick={() => goToPage(i + 1)}>
                    {i + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem disabled={!canGoNext} onClick={nextPage}>Suivant</CPaginationItem>
              </CPagination>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal aperçu */}
      <PreviewModal
        visible={previewModal.isOpen}
        onClose={() => {
          previewModal.close()
          setPreviewStudent(null)
          setAttestationPreviewUrl(undefined)
          setBirthCertUrl(undefined)
        }}
        birthCertificateUrl={birthCertUrl}
        attestationUrl={attestationPreviewUrl}
        studentName={previewStudent?.last_name || ''}
        studentFirstNames={previewStudent?.first_names || ''}
        onUpdateNames={handleUpdateNames}
        onValidateAndDownload={handleValidateAndDownload}
      />
    </CRow>
  )
}

export default AttestationInscription