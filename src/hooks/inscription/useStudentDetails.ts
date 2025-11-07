import { useState, useCallback } from 'react'
import { useModal } from '../common'

interface UseStudentDetailsProps {
  getStudentDetails: (id: number) => Promise<any>
}

interface UseStudentDetailsReturn {
  isOpen: boolean
  open: (studentId: number) => Promise<void>
  close: () => void
  studentDetails: any
  loading: boolean
}

/**
 * Hook useStudentDetails - Gère l'affichage des détails d'un étudiant
 */
const useStudentDetails = ({
  getStudentDetails,
}: UseStudentDetailsProps): UseStudentDetailsReturn => {
  const { isOpen, open: openModal, close } = useModal()
  const [studentDetails, setStudentDetails] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const open = useCallback(
    async (studentId: number) => {
      setLoading(true)
      openModal()
      try {
        const result = await getStudentDetails(studentId)
        if (result.success && result.data) {
          setStudentDetails(result.data)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des détails:', error)
        close()
      } finally {
        setLoading(false)
      }
    },
    [getStudentDetails, openModal, close]
  )

  const handleClose = useCallback(() => {
    close()
    setStudentDetails(null)
  }, [close])

  return {
    isOpen,
    open,
    close: handleClose,
    studentDetails,
    loading,
  }
}

export default useStudentDetails
