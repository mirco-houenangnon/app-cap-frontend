import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
  CFormInput,
  CAlert,
  CSpinner,
  CFormCheck
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilSave } from '@coreui/icons'
import NotesService from '@/services/notes.service'
import { LoadingSpinner } from '@/components'

interface Student {
  student_pending_student_id: number
  last_name: string
  first_names: string
}

interface ProgramInfo {
  id: number
  uuid: string
  name: string
  class_group: {
    id: number
    name: string
    level: string
  }
}

const CreateEvaluation = () => {
  const { programId } = useParams<{ programId: string }>()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [programInfo, setProgramInfo] = useState<ProgramInfo | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [notes, setNotes] = useState<Record<number, number>>({})
  const [isRetake, setIsRetake] = useState(false)

  useEffect(() => {
    loadProgramData()
  }, [programId])

  const loadProgramData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await NotesService.getStudentsForEvaluation(programId!)
      
      if (response.success) {
        setProgramInfo(response.data.program)
        setStudents(response.data.students)
        
        // Initialiser toutes les notes à -1 (non saisie)
        const initialNotes: Record<number, number> = {}
        response.data.students.forEach((student: Student) => {
          initialNotes[student.student_pending_student_id] = -1
        })
        setNotes(initialNotes)
      } else {
        setError(response.message || 'Erreur lors du chargement des données')
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const handleNoteChange = (studentId: number, value: string) => {
    const numValue = value === '' ? -1 : parseFloat(value)
    if (numValue === -1 || (!isNaN(numValue) && numValue >= 0 && numValue <= 20)) {
      setNotes(prev => ({ ...prev, [studentId]: numValue }))
    }
  }

  const handleSubmit = async () => {
    try {
      setSaving(true)
      setError(null)
      
      const response = await NotesService.createEvaluation(
        programId!,
        notes,
        isRetake
      )
      
      if (response.success) {
        setSuccess(true)
        setTimeout(() => {
          navigate(`/notes/professor/grade-sheet/${programId}`)
        }, 1500)
      } else {
        setError(response.message || 'Erreur lors de la création de l\'évaluation')
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de l\'évaluation')
    } finally {
      setSaving(false)
    }
  }

  const fillAllWithValue = (value: number) => {
    const newNotes: Record<number, number> = {}
    students.forEach(student => {
      newNotes[student.student_pending_student_id] = value
    })
    setNotes(newNotes)
  }

  if (loading) {
    return <LoadingSpinner fullPage message="Chargement des données..." />
  }

  return (
    <>
      <CRow className="mb-4">
        <CCol>
          <CButton
            color="light"
            onClick={() => navigate('/notes/professor/dashboard')}
            className="mb-3"
          >
            <CIcon icon={cilArrowLeft} className="me-2" />
            Retour au dashboard
          </CButton>
          <h2>Créer une évaluation</h2>
          {programInfo && (
            <p className="text-muted">
              {programInfo.name} - {programInfo.class_group.name}
            </p>
          )}
        </CCol>
      </CRow>

      {error && (
        <CAlert color="danger" dismissible onClose={() => setError(null)}>
          {error}
        </CAlert>
      )}

      {success && (
        <CAlert color="success">
          Évaluation créée avec succès! Redirection...
        </CAlert>
      )}

      <CCard className="mb-3">
        <CCardHeader>
          <strong>Options</strong>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md={6}>
              <CFormCheck
                id="isRetake"
                label="Évaluation de rattrapage"
                checked={isRetake}
                onChange={(e) => setIsRetake(e.target.checked)}
              />
            </CCol>
            <CCol md={6} className="text-end">
              <CButton
                color="secondary"
                size="sm"
                onClick={() => fillAllWithValue(10)}
                className="me-2"
              >
                Remplir tout avec 10
              </CButton>
              <CButton
                color="secondary"
                size="sm"
                onClick={() => fillAllWithValue(-1)}
              >
                Tout vider
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>Saisie des notes ({students.length} étudiants)</strong>
          <CButton
            color="primary"
            onClick={handleSubmit}
            disabled={saving || success}
          >
            {saving ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Enregistrement...
              </>
            ) : (
              <>
                <CIcon icon={cilSave} className="me-2" />
                Créer l'évaluation
              </>
            )}
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Nom</CTableHeaderCell>
                <CTableHeaderCell>Prénoms</CTableHeaderCell>
                <CTableHeaderCell style={{ width: '200px' }}>Note (/20)</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {students.map((student, index) => (
                <CTableRow key={student.student_pending_student_id}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{student.last_name}</CTableDataCell>
                  <CTableDataCell>{student.first_names}</CTableDataCell>
                  <CTableDataCell>
                    <CFormInput
                      type="number"
                      min="0"
                      max="20"
                      step="0.25"
                      value={notes[student.student_pending_student_id] === -1 ? '' : notes[student.student_pending_student_id]}
                      onChange={(e) => handleNoteChange(student.student_pending_student_id, e.target.value)}
                      placeholder="Non saisie"
                    />
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  )
}

export default CreateEvaluation
