import { useState, useEffect } from 'react'
import InscriptionService from '@/services/inscription.service'

const useFiltersData = (academicYearId?: number | null) => {
  const [departments, setDepartments] = useState<any[]>([])
  const [levels, setLevels] = useState<any[]>([])
  const [cohorts, setCohorts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadFilters = async () => {
      setLoading(true)
      setError(null)
      try {
        const [deptRes, levelRes] = await Promise.all([
          InscriptionService.getFilieres(),
          InscriptionService.getAllNiveaux()
        ])
        setDepartments(deptRes || [])
        setLevels(levelRes || [])
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des filtres')
      } finally {
        setLoading(false)
      }
    }
    loadFilters()
  }, [])

  useEffect(() => {
    const loadCohorts = async () => {
      if (!academicYearId) {
        setCohorts([])
        return
      }
      try {
        const cohortRes = await InscriptionService.getCohorts(academicYearId)
        setCohorts(cohortRes || [])
      } catch (err: any) {
        console.error('Erreur chargement cohortes:', err)
        setCohorts([])
      }
    }
    loadCohorts()
  }, [academicYearId])

  return { departments, levels, cohorts, loading, error }
}

export default useFiltersData
