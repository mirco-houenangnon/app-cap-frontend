import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
  CFormCheck,
  CAlert,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilTrash } from '@coreui/icons'
import { LoadingSpinner } from '@/components'
import academicLevelFeeService, { type AcademicLevelFee, type CreateAcademicLevelFeeData } from '@/services/academicLevelFee.service'
import inscriptionService from '@/services/inscription.service'

const Tarifs = () => {
  const [tarifs, setTarifs] = useState<AcademicLevelFee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingTarif, setEditingTarif] = useState<AcademicLevelFee | null>(null)
  const [academicYears, setAcademicYears] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  
  const [formData, setFormData] = useState<CreateAcademicLevelFeeData>({
    academic_year_id: 0,
    department_id: 0,
    study_level: '',
    registration_fee: 0,
    uemoa_training_fee: 0,
    non_uemoa_training_fee: 0,
    exempted_training_fee: 0,
    is_active: true,
  })
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([])
  const [submitting, setSubmitting] = useState(false)

  const studyLevels = [
    { value: 'L1', label: 'Licence 1' },
    { value: 'L2', label: 'Licence 2' },
    { value: 'L3', label: 'Licence 3' },
    { value: 'M1', label: 'Master 1' },
    { value: 'M2', label: 'Master 2' },
    { value: 'PREPA1', label: 'Prépa 1' },
    { value: 'PREPA2', label: 'Prépa 2' },
    { value: 'ING1', label: 'Ingénieur 1' },
    { value: 'ING2', label: 'Ingénieur 2' },
    { value: 'ING3', label: 'Ingénieur 3' },
    { value: 'ING4', label: 'Ingénieur 4' },
    { value: 'ING5', label: 'Ingénieur 5' },
  ]

  useEffect(() => {
    loadData()
    loadAcademicYears()
    loadDepartments()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await academicLevelFeeService.getAll()
      setTarifs(response.data || [])
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const loadAcademicYears = async () => {
    try {
      const response = await inscriptionService.academicYears()
      setAcademicYears(response || [])
    } catch (err) {
      console.error('Erreur chargement années:', err)
    }
  }

  const loadDepartments = async () => {
    try {
      const response = await inscriptionService.getFilieres()
      setDepartments(response || [])
    } catch (err) {
      console.error('Erreur chargement départements:', err)
    }
  }

  const getStudyLevels = () => {
    return [
      { value: '1', label: '1ère année' },
      { value: '2', label: '2ème année' },
      { value: '3', label: '3ème année' },
      { value: 'PREPA', label: 'Classes Préparatoires' },
    ]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      if (editingTarif) {
        await academicLevelFeeService.update(editingTarif.uuid, formData)
      } else {
        if (selectedDepartments.length > 0) {
          await academicLevelFeeService.createBulk({
            ...formData,
            department_ids: selectedDepartments
          })
        } else {
          await academicLevelFeeService.create(formData)
        }
      }
      
      setShowModal(false)
      resetForm()
      loadData()
      
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: editingTarif ? 'Tarif mis à jour' : 'Tarif créé',
        timer: 1500,
        showConfirmButton: false,
      })
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.message || 'Erreur lors de la sauvegarde',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      academic_year_id: 0,
      department_id: 0,
      study_level: '',
      registration_fee: 0,
      uemoa_training_fee: 0,
      non_uemoa_training_fee: 0,
      exempted_training_fee: 0,
      is_active: true,
    })
    setSelectedDepartments([])
    setEditingTarif(null)
  }

  const handleEdit = (tarif: AcademicLevelFee) => {
    setEditingTarif(tarif)
    setFormData({
      academic_year_id: tarif.academic_year_id,
      department_id: tarif.department_id,
      study_level: tarif.study_level || '',
      registration_fee: tarif.registration_fee,
      uemoa_training_fee: tarif.uemoa_training_fee,
      non_uemoa_training_fee: tarif.non_uemoa_training_fee,
      exempted_training_fee: tarif.exempted_training_fee,
      is_active: tarif.is_active,
    })
    setSelectedDepartments([])
    setShowModal(true)
  }

  const handleDelete = async (uuid: string) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    })

    if (result.isConfirmed) {
      try {
        await academicLevelFeeService.delete(uuid)
        loadData()
        Swal.fire('Supprimé !', 'Le tarif a été supprimé.', 'success')
      } catch (error: any) {
        Swal.fire('Erreur', error.message || 'Impossible de supprimer le tarif', 'error')
      }
    }
  }

  if (loading) {
    return <LoadingSpinner fullPage message="Chargement des tarifs..." />
  }

  return (
    <>
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Gestion des Tarifs par Niveau</h5>
          <CButton
            color="primary"
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
          >
            <CIcon icon={cilPlus} className="me-2" />
            Nouveau Tarif
          </CButton>
        </CCardHeader>
        <CCardBody>
          {error && (
            <CAlert color="danger" className="mb-3">
              {error}
            </CAlert>
          )}

          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Année</CTableHeaderCell>
                <CTableHeaderCell>Département</CTableHeaderCell>
                <CTableHeaderCell>Niveau</CTableHeaderCell>
                <CTableHeaderCell>Frais inscription</CTableHeaderCell>
                <CTableHeaderCell>Frais UEMOA</CTableHeaderCell>
                <CTableHeaderCell>Frais Non-UEMOA</CTableHeaderCell>
                <CTableHeaderCell>Statut</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {Array.isArray(tarifs) && tarifs.length > 0 ? tarifs.map((tarif: AcademicLevelFee) => (
                <CTableRow key={tarif.uuid}>
                  <CTableDataCell>{tarif.academic_year?.academic_year || tarif.academic_year_id}</CTableDataCell>
                  <CTableDataCell>{tarif.department?.name || tarif.department_id}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color="info">{tarif.study_level}</CBadge>
                  </CTableDataCell>
                  <CTableDataCell>{tarif.registration_fee?.toLocaleString()} FCFA</CTableDataCell>
                  <CTableDataCell>{tarif.uemoa_training_fee?.toLocaleString()} FCFA</CTableDataCell>
                  <CTableDataCell>{tarif.non_uemoa_training_fee?.toLocaleString()} FCFA</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={tarif.is_active ? 'success' : 'secondary'}>
                      {tarif.is_active ? 'Actif' : 'Inactif'}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="warning"
                      variant="ghost"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(tarif)}
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                      color="danger"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(tarif.uuid)}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              )) : (
                <CTableRow>
                  <CTableDataCell colSpan={8} className="text-center text-muted py-4">
                    Aucun tarif défini
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>
            {editingTarif ? 'Modifier le tarif' : 'Nouveau tarif'}
          </CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit}>
          <CModalBody>
            <div className="row">
              <div className="col-md-6 mb-3">
                <CFormSelect
                  label="Année académique"
                  value={formData.academic_year_id}
                  onChange={(e) => setFormData({ ...formData, academic_year_id: parseInt(e.target.value) })}
                  required
                >
                  <option value={0}>Sélectionner une année</option>
                  {academicYears.map((year: any) => (
                    <option key={year.id} value={year.id}>{year.libelle}</option>
                  ))}
                </CFormSelect>
              </div>
              <div className="col-md-6 mb-3">
                <CFormSelect
                  label="Niveau d'études"
                  value={formData.study_level}
                  onChange={(e) => setFormData({ ...formData, study_level: e.target.value })}
                  required={formData.study_level !== 'PREPA'}
                >
                  <option value="">Sélectionner un niveau</option>
                  {getStudyLevels().map((level) => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </CFormSelect>
                {formData.study_level === 'PREPA' && (
                  <small className="text-info">Les classes préparatoires n'ont pas de sous-niveau</small>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <CFormInput
                  type="number"
                  label="Frais d'inscription (FCFA)"
                  value={formData.registration_fee}
                  onChange={(e) => setFormData({ ...formData, registration_fee: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <CFormInput
                  type="number"
                  label="Frais formation UEMOA (FCFA)"
                  value={formData.uemoa_training_fee}
                  onChange={(e) => setFormData({ ...formData, uemoa_training_fee: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <CFormInput
                  type="number"
                  label="Frais formation Non-UEMOA (FCFA)"
                  value={formData.non_uemoa_training_fee}
                  onChange={(e) => setFormData({ ...formData, non_uemoa_training_fee: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <CFormInput
                  type="number"
                  label="Frais formation Exonéré (FCFA)"
                  value={formData.exempted_training_fee}
                  onChange={(e) => setFormData({ ...formData, exempted_training_fee: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="col-md-6 mb-3">
                <CFormCheck
                  id="is_active"
                  label="Tarif actif"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
              </div>
              <div className="col-12 mb-3">
                {editingTarif ? (
                  <CFormSelect
                    label="Département"
                    value={formData.department_id}
                    onChange={(e) => {
                      const deptId = parseInt(e.target.value)
                      setFormData({ ...formData, department_id: deptId, study_level: '' })
                    }}
                    required
                  >
                    <option value={0}>Sélectionner un département</option>
                    {departments.map((dept: any) => (
                      <option key={dept.id} value={dept.id}>{dept.title}</option>
                    ))}
                  </CFormSelect>
                ) : (
                  <div>
                    <label className="form-label">Départements *</label>
                    <div className="row">
                      {departments.map((dept: any) => (
                        <div key={dept.id} className="col-md-3 mb-2">
                          <CFormCheck
                            id={`dept-${dept.id}`}
                            label={dept.title}
                            checked={selectedDepartments.includes(dept.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                const newSelection = [...selectedDepartments, dept.id]
                                setSelectedDepartments(newSelection)
                                if (newSelection.length === 1) {
                                  setFormData({ ...formData, study_level: '' })
                                }
                              } else {
                                const newSelection = selectedDepartments.filter(id => id !== dept.id)
                                setSelectedDepartments(newSelection)
                                if (newSelection.length === 0) {
                                  setFormData({ ...formData, study_level: '' })
                                }
                              }
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    {selectedDepartments.length === 0 && (
                      <small className="text-danger">Veuillez sélectionner au moins un département</small>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </CButton>
            <CButton 
              color="primary" 
              type="submit"
              disabled={(!editingTarif && selectedDepartments.length === 0) || submitting}
            >
              {submitting ? 'Opération en cours...' : (editingTarif ? 'Modifier' : 'Créer')}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

export default Tarifs