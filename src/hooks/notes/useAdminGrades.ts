import { useState, useEffect } from 'react'
import notesService from '@/services/notes.service'

interface DashboardStats {
  total_evaluations: number
  completed_evaluations: number
  pending_evaluations: number
  average_success_rate: number
  programs_by_department: any[]
  recent_activities: any[]
}

const useAdminGrades = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [gradesByFilters, setGradesByFilters] = useState<any[]>([])
  const [programDetails, setProgramDetails] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Charger le dashboard
  const loadDashboard = async (academicYearId?: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await notesService.getDashboard(academicYearId)
      setDashboardStats(response.data)
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement du dashboard')
    } finally {
      setLoading(false)
    }
  }

  // Charger les notes par filtres
  const loadGradesByFilters = async (filters: {
    academic_year_id?: number
    department_id?: number
    level?: string
    program_id?: number
    cohort?: string
  }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await notesService.getGradesByDepartmentLevel(filters)
      setGradesByFilters(response.data || [])
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des notes')
    } finally {
      setLoading(false)
    }
  }

  // Charger les détails d'un programme
  const loadProgramDetails = async (programId: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await notesService.getProgramDetails(programId)
      setProgramDetails(response.data)
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des détails')
    } finally {
      setLoading(false)
    }
  }

  // Exporter par filière
  const exportByDepartment = async (params: {
    academic_year_id: number
    department_id: number
    level?: string
    format?: 'pdf' | 'excel'
  }) => {
    try {
      const response = await notesService.exportGradesByDepartment(params)
      return { success: true, data: response.data }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'export')
      return { success: false, error: err.message }
    }
  }

  const exportPVFinAnnee = async (params: {
    academic_year_id: number
    department_id: number
    level?: string
    cohort?: string
    validation_average: number
  }) => {
    try {
      return await notesService.exportPVFinAnnee(params)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'export')
      throw err
    }
  }

  const exportPVDeliberation = async (params: {
    academic_year_id: number
    department_id: number
    level?: string
    cohort?: string
    semester: number
  }) => {
    try {
      return await notesService.exportPVDeliberation(params)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'export')
      throw err
    }
  }

  const exportRecapNotes = async (params: {
    academic_year_id: number
    department_id: number
    level?: string
    cohort?: string
  }) => {
    try {
      return await notesService.exportRecapNotes({...params, semester: 1})
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'export')
      throw err
    }
  }

  return {
    dashboardStats,
    gradesByFilters,
    programDetails,
    loading,
    error,
    loadDashboard,
    loadGradesByFilters,
    loadProgramDetails,
    exportByDepartment,
    exportPVFinAnnee,
    exportPVDeliberation,
    exportRecapNotes,
    setError
  }
}

export default useAdminGrades