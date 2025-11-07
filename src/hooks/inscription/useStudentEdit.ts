import { useState, useCallback } from 'react'
import { useModal } from '../common'
import Swal from 'sweetalert2'

interface EditFormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  gender: string
  date_of_birth: string
}

interface UseStudentEditProps {
  studentDetails: any
  updateStudent: (id: number, data: any) => Promise<any>
  onSuccess?: () => void
}

interface UseStudentEditReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  formData: EditFormData
  loading: boolean
  handleChange: (field: string, value: string) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  initializeForm: (student: any) => void
}

/**
 * Hook useStudentEdit - Gère la logique d'édition d'un étudiant
 */
const useStudentEdit = ({
  studentDetails,
  updateStudent,
  onSuccess,
}: UseStudentEditProps): UseStudentEditReturn => {
  const { isOpen, open, close } = useModal()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<EditFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: '',
    date_of_birth: '',
  })

  const initializeForm = useCallback((student: any) => {
    if (student) {
      // Extraire prénom et nom du nomPrenoms
      const [nom, ...prenoms] = student.nomPrenoms.split(' ')
      setFormData({
        first_name: prenoms.join(' ') || '',
        last_name: nom || '',
        email: student.email || '',
        phone: student.telephone || '',
        gender: student.sexe || '',
        date_of_birth: student.dateNaissance || '',
      })
      open()
    }
  }, [open])

  const handleChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!studentDetails) return

      setLoading(true)
      try {
        const result = await updateStudent(studentDetails.id, formData)
        if (result.success) {
          await Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: "Les informations de l'étudiant ont été mises à jour avec succès.",
          })
          close()
          onSuccess?.()
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: result.error || 'Échec de la mise à jour des informations.',
          })
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour:', error)
        await Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la mise à jour.',
        })
      } finally {
        setLoading(false)
      }
    },
    [studentDetails, formData, updateStudent, close, onSuccess]
  )

  return {
    isOpen,
    open,
    close,
    formData,
    loading,
    handleChange,
    handleSubmit,
    initializeForm,
  }
}

export default useStudentEdit
