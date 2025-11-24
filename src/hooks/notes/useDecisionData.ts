import { useState, useEffect } from 'react'
import notesService from '@/services/notes.service'

interface DecisionStudent {
  id: number
  matricule: string
  nom: string
  prenoms: string
  moyenne: number
  credits: number
  totalCredits: number
  level?: string
  moyenneS1?: number
  moyenneS2?: number
  moyenneAnnuelle?: number
  creditsS1?: number
  creditsS2?: number
}

const useDecisionData = (
  academicYearId: number | null,
  departmentId: number | null,
  level: string | null,
  cohort: string | null,
  semester?: number
) => {
  const [students, setStudents] = useState<DecisionStudent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadStudents = async () => {
      if (!academicYearId || !departmentId || !level || !cohort) {
        setStudents([])
        return
      }

      setLoading(true)
      setError(null)
      try {
        let response
        if (semester !== undefined) {
          response = await notesService.getStudentsBySemester({
            academic_year_id: academicYearId,
            department_id: departmentId,
            level,
            cohort,
            semester
          })
        } else {
          response = await notesService.getStudentsByYear({
            academic_year_id: academicYearId,
            department_id: departmentId,
            level,
            cohort
          })
        }
        setStudents(response.data || [])
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des étudiants')
        setStudents([])
      } finally {
        setLoading(false)
      }
    }

    loadStudents()
  }, [academicYearId, departmentId, level, cohort, semester])

  return { students, loading, error, setStudents }
}

export default useDecisionData
