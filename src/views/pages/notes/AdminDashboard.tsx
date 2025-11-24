import { useState, useEffect, useMemo } from 'react'
import Select from 'react-select'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CAlert,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
  cilChart, 
  cilPeople, 
  cilBook, 
  cilCheckCircle,
  cilCloudDownload,
  cilFilter
} from '@coreui/icons'
import { LoadingSpinner } from '@/components'
import { StatsCard } from '@/components/dashboard'
import useAdminGrades from '@/hooks/notes/useAdminGrades'
import useAnneeAcademiquesData from '@/hooks/inscription/useAnneeAcademiqueData'

const AdminDashboard = () => {
  const {
    dashboardStats,
    gradesByFilters,
    loading,
    error,
    loadDashboard,
    loadGradesByFilters,
    exportByDepartment
  } = useAdminGrades()

  const { academicYears } = useAnneeAcademiquesData()
  const [departments, setDepartments] = useState<any[]>([])
  const [levels, setLevels] = useState<any[]>([])
  const [cohorts, setCohorts] = useState<any[]>([])

  // États pour les filtres
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<number | null>(null)
  const [selectedCohort, setSelectedCohort] = useState<string | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null)

  // Charger les filières et niveaux
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const inscriptionService = (await import('@/services/inscription.service')).default
        const [deptData, levelData] = await Promise.all([
          inscriptionService.getFilieres(),
          inscriptionService.getAllNiveaux()
        ])
        setDepartments(deptData || [])
        setLevels(levelData || [])
      } catch (err) {
        console.error('Erreur chargement filtres:', err)
      }
    }
    loadFilters()
  }, [])

  // Charger les cohortes quand l'année change
  useEffect(() => {
    if (!selectedAcademicYear) return
    const loadCohorts = async () => {
      try {
        const inscriptionService = (await import('@/services/inscription.service')).default
        const cohortData = await inscriptionService.getCohorts(selectedAcademicYear)
        setCohorts(cohortData || [])
      } catch (err) {
        console.error('Erreur chargement cohortes:', err)
      }
    }
    loadCohorts()
  }, [selectedAcademicYear])

  // Options pour les sélecteurs
  const yearOptions = useMemo(() => {
    return academicYears.map((year: any) => ({
      value: year.id,
      label: year.libelle
    }))
  }, [academicYears])

  const cohortOptions = useMemo(() => {
    return cohorts.map((cohort: any) => {
      const cohortValue = typeof cohort === 'string' ? cohort : (cohort.cohort || cohort.value || cohort)
      return {
        value: cohortValue,
        label: cohortValue
      }
    })
  }, [cohorts])

  const departmentOptions = useMemo(() => {
    return departments.map((dept: any) => ({
      value: dept.id,
      label: dept.name
    }))
  }, [departments])

  const levelOptions = useMemo(() => {
    return levels.map((level: any) => ({
      value: level.value,
      label: level.label
    }))
  }, [levels])

  const programOptions = [
    { value: null, label: 'Tous les programmes' }
  ]

  // Charger le dashboard au montage
  useEffect(() => {
    // Sélectionner l'année académique courante par défaut
    const currentYear = academicYears.find((year: any) => year.is_current)
    if (currentYear) {
      setSelectedAcademicYear(currentYear.id)
    }
  }, [academicYears])

  useEffect(() => {
    if (selectedAcademicYear) {
      loadDashboard(selectedAcademicYear)
    }
  }, [selectedAcademicYear])

  // Charger les données filtrées
  useEffect(() => {
    if (!selectedAcademicYear) return
    
    const filters: any = { academic_year_id: selectedAcademicYear }
    if (selectedCohort) filters.cohort = selectedCohort
    if (selectedDepartment) filters.department_id = selectedDepartment
    if (selectedLevel) filters.level = selectedLevel
    if (selectedProgram) filters.program_id = selectedProgram
    
    loadGradesByFilters(filters)
  }, [selectedAcademicYear, selectedCohort, selectedDepartment, selectedLevel, selectedProgram])

  const handleExport = async (format: 'pdf' | 'excel') => {
    if (!selectedAcademicYear) {
      alert('Veuillez sélectionner une année académique')
      return
    }

    const params: any = { academic_year_id: selectedAcademicYear, format }
    if (selectedDepartment) params.department_id = selectedDepartment
    if (selectedLevel) params.level = selectedLevel

    const result = await exportByDepartment(params)

    if (result.success) {
      console.log('Export réussi:', result.data)
    }
  }

  if (loading && !dashboardStats) {
    return <LoadingSpinner fullPage message="Chargement du dashboard..." />
  }

  return (
    <>
      <CRow className="mb-4">
        <CCol>
          <h2>Dashboard des Notes</h2>
          <p className="text-muted">
            Vue d'ensemble des évaluations et des résultats par filière
          </p>
        </CCol>
      </CRow>

      {/* Statistiques */}
      {gradesByFilters && gradesByFilters.length > 0 && (
        <CRow className="mb-4">
          <StatsCard
            value={gradesByFilters.length}
            label="Total Étudiants"
            icon={cilPeople}
            color="primary"
          />
          <StatsCard
            value={gradesByFilters.filter((s: any) => s.validated).length}
            label="Étudiants Validés"
            icon={cilCheckCircle}
            color="success"
          />
          <StatsCard
            value={gradesByFilters.filter((s: any) => s.programs_count).reduce((sum: number, s: any) => sum + (s.programs_count || 0), 0)}
            label="Total Programmes"
            icon={cilBook}
            color="info"
          />
          <StatsCard
            value={`${((gradesByFilters.filter((s: any) => s.validated).length / gradesByFilters.length) * 100).toFixed(1)}%`}
            label="Taux de Réussite"
            icon={cilChart}
            color="warning"
          />
        </CRow>
      )}

      {/* Filtres */}
      <CCard className="mb-4">
        <CCardHeader>
          <CIcon icon={cilFilter} className="me-2" />
          <strong>Filtres</strong>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol md={3}>
              <label className="form-label">Année Académique</label>
              <Select
                options={yearOptions}
                value={yearOptions.find(opt => opt.value === selectedAcademicYear)}
                onChange={(option: any) => {
                  setSelectedAcademicYear(option?.value || null)
                  setSelectedCohort(null)
                }}
                placeholder="Sélectionner..."
                isSearchable
              />
            </CCol>
            <CCol md={3}>
              <label className="form-label">Cohorte</label>
              <Select
                options={cohortOptions}
                value={cohortOptions.find(opt => opt.value === selectedCohort)}
                onChange={(option: any) => setSelectedCohort(option?.value || null)}
                placeholder="Sélectionner..."
                isSearchable
                isClearable
                isDisabled={!selectedAcademicYear}
              />
            </CCol>
            <CCol md={3}>
              <label className="form-label">Filière</label>
              <Select
                options={departmentOptions}
                value={departmentOptions.find(opt => opt.value === selectedDepartment)}
                onChange={(option: any) => setSelectedDepartment(option?.value || null)}
                placeholder="Sélectionner..."
                isSearchable
                isClearable
              />
            </CCol>
            <CCol md={3}>
              <label className="form-label">Niveau</label>
              <Select
                options={levelOptions}
                value={levelOptions.find(opt => opt.value === selectedLevel)}
                onChange={(option: any) => setSelectedLevel(option?.value || null)}
                placeholder="Sélectionner..."
                isSearchable
                isClearable
              />
            </CCol>
          </CRow>
          
          <CRow className="mt-3">
            <CCol>
              <CDropdown>
                <CDropdownToggle color="primary">
                  <CIcon icon={cilCloudDownload} className="me-1" />
                  Exporter
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem onClick={() => handleExport('pdf')}>
                    Export PDF
                  </CDropdownItem>
                  <CDropdownItem onClick={() => handleExport('excel')}>
                    Export Excel
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {error && (
        <CAlert color="danger" className="mb-4">
          {error}
        </CAlert>
      )}

      {/* Tableau des résultats */}
      <CCard>
        <CCardHeader>
          <strong>Résultats par Programme</strong>
          {selectedProgram === null && (
            <span className="ms-2 text-muted">(Vue d'ensemble)</span>
          )}
        </CCardHeader>
        <CCardBody>
          {selectedProgram === null ? (
            // Vue d'ensemble - tous les programmes
            <div className="table-responsive">
              <CTable striped hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Matricule</CTableHeaderCell>
                    <CTableHeaderCell>Nom et Prénoms</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Programmes</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Moyenne Générale</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Statut</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {gradesByFilters && gradesByFilters.length > 0 ? (
                    gradesByFilters.map((student: any) => (
                      <CTableRow key={student.id}>
                        <CTableDataCell>{student.matricule || 'N/A'}</CTableDataCell>
                        <CTableDataCell>
                          <strong>{student.nom} {student.prenoms}</strong>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {student.programs_count || 0}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CBadge color={student.average >= 12 ? 'success' : student.average >= 10 ? 'info' : 'danger'}>
                            {student.average ? student.average.toFixed(2) : '-'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CBadge color={student.validated ? 'success' : 'danger'}>
                            {student.validated ? 'Validé' : 'Non validé'}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={5} className="text-center">
                        {loading ? 'Chargement...' : 'Aucune donnée disponible. Sélectionnez des filtres.'}
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </div>
          ) : (
            // Vue détaillée d'un programme spécifique
            <div className="table-responsive">
              <CTable striped hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Matricule</CTableHeaderCell>
                    <CTableHeaderCell>Nom et Prénoms</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Eval 1 (30%)</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Eval 2 (40%)</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Eval 3 (30%)</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Moyenne</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Rattrapage</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Moy. Finale</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Professeur</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {/* Données simulées */}
                  <CTableRow>
                    <CTableDataCell>2024001</CTableDataCell>
                    <CTableDataCell>
                      <strong>DUPONT Jean</strong>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">15.0</CTableDataCell>
                    <CTableDataCell className="text-center">14.0</CTableDataCell>
                    <CTableDataCell className="text-center">14.5</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge color="success">14.3</CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge color="success">V</CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge color="success">14.3</CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <small>Prof. BERNARD</small>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>2024002</CTableDataCell>
                    <CTableDataCell>
                      <strong>MARTIN Marie</strong>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">8.0</CTableDataCell>
                    <CTableDataCell className="text-center">9.0</CTableDataCell>
                    <CTableDataCell className="text-center">7.5</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge color="danger">8.2</CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">12.0</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge color="success">12.0</CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <small>Prof. BERNARD</small>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </div>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default AdminDashboard