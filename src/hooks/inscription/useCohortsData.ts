import { useState, useEffect } from 'react'
import InscriptionService from '@/services/inscription.service'

interface CohortOption {
  value: string
  label: string
}

const useCohortsData = (academicYearId?: number | null) => {
  const [cohorts, setCohorts] = useState<CohortOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCohorts = async () => {
      if (academicYearId) {
        setLoading(true)
        setError(null)
        try {
          const filterData = await InscriptionService.filterOptions(academicYearId.toString())
          setCohorts(filterData.cohorts || [])
        } catch (err: any) {
          setError(err.message || 'Erreur lors du chargement des cohortes')
          setCohorts([])
        } finally {
          setLoading(false)
        }
      } else {
        setCohorts([])
      }
    }

    fetchCohorts()
  }, [academicYearId])

  return { cohorts, loading, error }
}

export default useCohortsData
