import { useState, useEffect } from 'react'
import notesService from '@/services/notes.service'

interface Student {
  student_pending_student_id: number
  last_name: string
  first_names: string
  grades: number[]
  average?: number
  retake_grades?: number[]
  retake_average?: number
  validated?: boolean
}

interface Program {
  id: number
  uuid: string
  name: string
  class_group: {
    id: number
    name: string
    level: string
  }
  weighting: number[]
  retake_weighting: number[]
  column_count: number
  retake_column_count: number
  validation_average: number
}

interface GradeSheet {
  program: Program
  students: Student[]
  total_students: number
  completed_students: number
}

const useProfessorGrades = () => {
  const [classes, setClasses] = useState<any[]>([])
  const [programs, setPrograms] = useState<any[]>([])
  const [gradeSheet, setGradeSheet] = useState<GradeSheet | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Charger les classes du professeur
  const loadMyClasses = async (filters?: { academic_year_id?: number; department_id?: number; cohort?: string }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await notesService.getMyClasses(filters)
      setClasses(response.data || [])
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des classes')
    } finally {
      setLoading(false)
    }
  }

  // Charger les programmes d'une classe
  const loadProgramsByClass = async (classGroupId: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await notesService.getProgramsByClass(classGroupId)
      console.log('Programs response:', response.data)
      setPrograms(response.data?.programs || [])
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des programmes')
    } finally {
      setLoading(false)
    }
  }

  // Charger la fiche de notation
  const loadGradeSheet = async (programUuid: string | number, cohort?: string) => {
    const uuid = typeof programUuid === 'string' ? programUuid : programUuid.toString()
    setLoading(true)
    setError(null)
    try {
      const response = await notesService.getGradeSheet(uuid, cohort)
      setGradeSheet(response.data)
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement de la fiche de notation')
    } finally {
      setLoading(false)
    }
  }

  // Créer une évaluation
  const createEvaluation = async (programId: string | number, isRetake = false) => {
    setLoading(true)
    setError(null)
    try {
      // Initialiser toutes les notes à -1
      const notes: Record<number, number> = {}
      gradeSheet?.students.forEach(student => {
        notes[student.student_pending_student_id] = -1
      })

      await notesService.createEvaluation(programId, notes, isRetake)
      // Recharger la fiche
      await loadGradeSheet(programId)
      return { success: true }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de l\'évaluation')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Mettre à jour une note
  const updateGrade = async (
    studentId: number,
    programId: string | number,
    position: number,
    value: number
  ) => {
    try {
      await notesService.updateGrade({
        student_pending_student_id: studentId,
        program_id: programId,
        position,
        value
      })
      
      return { success: true }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour de la note')
      return { success: false, error: err.message }
    }
  }

  // Dupliquer une note
  const duplicateGrade = async (programId: string | number, columnIndex: number, sessionNormale = true) => {
    setLoading(true)
    setError(null)
    try {
      await notesService.duplicateGrade(programId, columnIndex, sessionNormale)
      // Recharger la fiche
      await loadGradeSheet(programId)
      return { success: true }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la duplication de la note')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Définir la pondération
  const setWeighting = async (programId: string | number, weighting: number[]) => {
    setLoading(true)
    setError(null)
    try {
      await notesService.setWeighting(programId, weighting)
      // Recharger la fiche
      await loadGradeSheet(programId)
      return { success: true }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la définition de la pondération')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Exporter la fiche
  const exportGradeSheet = async (programId: string | number, includeRetake = false, cohort?: string) => {
    try {
      const response = await notesService.exportGradeSheet(programId.toString(), includeRetake, cohort)
      if (response.success && response.url) {
        return { success: true, url: response.url, filename: response.filename }
      }
      return { success: false, error: 'Erreur lors de l\'export' }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'export')
      return { success: false, error: err.message }
    }
  }

  // Vérifier si toutes les notes sont renseignées
  const areAllGradesCompleted = (student: Student, columnCount: number): boolean => {
    if (!student.grades || student.grades.length !== columnCount) return false
    return !student.grades.includes(-1)
  }

  // Calculer le pourcentage de completion
  const getCompletionPercentage = (): number => {
    if (!gradeSheet || !gradeSheet.students.length) return 0
    
    const columnCount = gradeSheet.program.column_count
    if (columnCount === 0) return 100
    
    const completedStudents = gradeSheet.students.filter(student => 
      areAllGradesCompleted(student, columnCount)
    ).length
    
    return Math.round((completedStudents / gradeSheet.students.length) * 100)
  }

  // Supprimer une évaluation
  const deleteEvaluation = async (programId: string | number, columnIndex: number, sessionNormale = true) => {
    setLoading(true)
    setError(null)
    try {
      await notesService.deleteEvaluation(programId, columnIndex, sessionNormale)
      // Recharger la fiche
      await loadGradeSheet(programId)
      return { success: true }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression de l\'évaluation')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  return {
    classes,
    programs,
    gradeSheet,
    loading,
    error,
    loadMyClasses,
    loadProgramsByClass,
    loadGradeSheet,
    createEvaluation,
    updateGrade,
    duplicateGrade,
    setWeighting,
    exportGradeSheet,
    deleteEvaluation,
    areAllGradesCompleted,
    getCompletionPercentage,
    setError
  }
}

export default useProfessorGrades