import { useState, useEffect, useCallback } from 'react'
import CoursService from '@/services/cours.service'
import type {
  Program,
  CourseElement,
  Professor,
  ClassGroup,
  CourseElementProfessor,
  CreateProgramRequest,
  UpdateProgramRequest,
  ProgramFilters,
} from '@/types/cours.types'
import type { ApiResponse } from '@/types'

export const usePrograms = (initialFilters: ProgramFilters = {}) => {
  const [programs, setPrograms] = useState<Program[]>([])
  const [courseElements, setCourseElements] = useState<CourseElement[]>([])
  const [professors, setProfessors] = useState<Professor[]>([])
  const [classGroups, setClassGroups] = useState<ClassGroup[]>([])
  const [courseElementProfessors, setCourseElementProfessors] = useState<CourseElementProfessor[]>([])
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProgramFilters>(initialFilters)

  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null && value !== '')
      )
      
      const response: ApiResponse<Program[]> = await CoursService.getPrograms(cleanFilters)
      
      setPrograms(response.data || [])
      const meta = response.meta
      setPagination({
        current_page: meta?.current_page ?? 1,
        last_page: meta?.last_page ?? 1,
        per_page: meta?.per_page ?? (filters.per_page || 15),
        total: meta?.total ?? 0,
        from: meta?.from ?? 0,
        to: meta?.to ?? 0,
      })
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors du chargement des programmes')
      console.error('Erreur fetchPrograms:', err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const fetchReferenceData = useCallback(async () => {
    try {
      const [courseElementsResponse, professorsResponse, classGroupsResponse, assignmentsResponse] = await Promise.all([
        CoursService.getCourseElements({ per_page: 100 }),
        CoursService.getProfessors(),
        CoursService.getClassGroups(),
        CoursService.getCourseElementProfessorAssignments({ per_page: 100 })
      ])
      
      setCourseElements(courseElementsResponse.data || [])
      setProfessors(professorsResponse)
      setClassGroups(classGroupsResponse)
      setCourseElementProfessors(assignmentsResponse.data || [])
    } catch (err: any) {
      console.error('Erreur fetchReferenceData:', err)
    }
  }, [])

  const createProgram = useCallback(async (data: CreateProgramRequest): Promise<Program | null> => {
    try {
      const newProgram = await CoursService.createProgram(data)
      await fetchPrograms() // Refresh the list
      return newProgram
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de la création du programme')
      console.error('Erreur createProgram:', err)
      throw err
    }
  }, [fetchPrograms])

  const updateProgram = useCallback(async (id: number | string, data: UpdateProgramRequest): Promise<Program | null> => {
    try {
      const updatedProgram = await CoursService.updateProgram(id, data)
      await fetchPrograms() // Refresh the list
      return updatedProgram
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de la mise à jour du programme')
      console.error('Erreur updateProgram:', err)
      throw err
    }
  }, [fetchPrograms])

  const deleteProgram = useCallback(async (id: number | string): Promise<void> => {
    try {
      await CoursService.deleteProgram(id)
      await fetchPrograms() // Refresh the list
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de la suppression du programme')
      console.error('Erreur deleteProgram:', err)
      throw err
    }
  }, [fetchPrograms])

  const updateFilters = useCallback((newFilters: ProgramFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  const goToPage = useCallback((_page: number) => {
    updateFilters({ per_page: filters.per_page || 15 })
  }, [filters.per_page, updateFilters])

  const validateWeighting = useCallback((weighting: { [key: string]: number }) => {
    const total = Object.values(weighting).reduce((sum, value) => sum + value, 0)
    return total === 100
  }, [])

  const getTotalWeighting = useCallback((weighting: { [key: string]: number }) => {
    return Object.values(weighting).reduce((sum, value) => sum + value, 0)
  }, [])

  const renderWeightingBadges = useCallback((weighting: { [key: string]: number }) => {
    return Object.entries(weighting)
      .filter(([_, value]) => value > 0)
      .map(([key, value]) => ({ key, value, label: `${key}: ${value}%` }))
  }, [])

  useEffect(() => {
    fetchPrograms()
  }, [fetchPrograms])

  useEffect(() => {
    fetchReferenceData()
  }, [fetchReferenceData])

  return {
    // Data
    programs,
    courseElements,
    professors,
    classGroups,
    courseElementProfessors,
    pagination,
    loading,
    error,
    filters,
    
    // Actions
    createProgram,
    updateProgram,
    deleteProgram,
    fetchPrograms,
    fetchReferenceData,
    updateFilters,
    resetFilters,
    goToPage,
    
    // Utils
    setError,
    validateWeighting,
    getTotalWeighting,
    renderWeightingBadges
  }
}

export default usePrograms
