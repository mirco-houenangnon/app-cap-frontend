import { useState, useCallback } from 'react'
import InscriptionService from '../../services/inscription.service'
import Swal from 'sweetalert2'

interface Group {
  name: string
  students: any[]
}

interface UseGroupCreationProps {
  selectedYear: string
  selectedFiliere: string
  selectedNiveau: string
  selectedEntryDiploma: string
  selectedRedoublant: string
  filterOptions: any
}

interface UseGroupCreationReturn {
  groups: Group[]
  currentGroupIndex: number
  selectedStudents: number[]
  allStudentsForGrouping: any[]
  loading: boolean
  initializeGroups: () => Promise<void>
  selectStudent: (studentId: number) => void
  selectAll: () => void
  deselectAll: () => void
  selectFirst: () => void
  selectLast: () => void
  selectOneInTwo: () => void
  validateGroup: () => void
  cancelGroupCreation: () => Promise<boolean>
  reset: () => void
}

/**
 * Hook useGroupCreation - Gère la logique de création de groupes de classe
 */
const useGroupCreation = ({
  selectedYear,
  selectedFiliere,
  selectedNiveau,
  selectedEntryDiploma,
  selectedRedoublant,
  filterOptions,
}: UseGroupCreationProps): UseGroupCreationReturn => {
  const [groups, setGroups] = useState<Group[]>([])
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0)
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])
  const [allStudentsForGrouping, setAllStudentsForGrouping] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const initializeGroups = useCallback(async () => {
    if (selectedYear === 'all' || selectedFiliere === 'all' || selectedNiveau === 'all') {
      Swal.fire({
        icon: 'warning',
        title: 'Sélection requise',
        text: "Veuillez sélectionner une année académique, une filière et un niveau d'études avant de créer des groupes.",
      })
      return
    }

    setLoading(true)
    try {
      const response = await InscriptionService.studentsList(
        selectedYear,
        selectedFiliere,
        selectedEntryDiploma,
        selectedRedoublant,
        selectedNiveau,
        1,
        '',
        1000
      )
      const allStudents = response.data || []
      const approvedStudents = allStudents.filter((s: any) => s.student_id !== null)

      if (approvedStudents.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Aucun étudiant',
          text: 'Aucun étudiant approuvé trouvé pour cette classe.',
        })
        return
      }

      setAllStudentsForGrouping(approvedStudents)
      setGroups([{ name: 'A', students: [] }])
      setCurrentGroupIndex(0)
      setSelectedStudents([])
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les étudiants.',
      })
    } finally {
      setLoading(false)
    }
  }, [selectedYear, selectedFiliere, selectedNiveau, selectedEntryDiploma, selectedRedoublant])

  const selectStudent = useCallback((studentId: number) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    )
  }, [])

  const selectAll = useCallback(() => {
    const assignedStudentIds = groups.flatMap((g) =>
      g.students.map((s: any) => s.id)
    )
    const availableStudents = allStudentsForGrouping.filter(
      (s) => !assignedStudentIds.includes(s.id)
    )
    setSelectedStudents(availableStudents.map((s) => s.id))
  }, [groups, allStudentsForGrouping])

  const deselectAll = useCallback(() => {
    setSelectedStudents([])
  }, [])

  const selectFirst = useCallback(() => {
    Swal.fire({
      title: 'Sélectionner les N premiers',
      input: 'number',
      inputLabel: "Nombre d'étudiants à sélectionner",
      inputPlaceholder: 'Entrez un nombre',
      showCancelButton: true,
      confirmButtonText: 'Valider',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const n = parseInt(result.value)
        const assignedStudentIds = groups.flatMap((g) =>
          g.students.map((s: any) => s.id)
        )
        const availableStudents = allStudentsForGrouping.filter(
          (s) => !assignedStudentIds.includes(s.id)
        )
        setSelectedStudents(availableStudents.slice(0, n).map((s) => s.id))
      }
    })
  }, [groups, allStudentsForGrouping])

  const selectLast = useCallback(() => {
    Swal.fire({
      title: 'Sélectionner les N derniers',
      input: 'number',
      inputLabel: "Nombre d'étudiants à sélectionner",
      inputPlaceholder: 'Entrez un nombre',
      showCancelButton: true,
      confirmButtonText: 'Valider',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const n = parseInt(result.value)
        const assignedStudentIds = groups.flatMap((g) =>
          g.students.map((s: any) => s.id)
        )
        const availableStudents = allStudentsForGrouping.filter(
          (s) => !assignedStudentIds.includes(s.id)
        )
        setSelectedStudents(availableStudents.slice(-n).map((s) => s.id))
      }
    })
  }, [groups, allStudentsForGrouping])

  const selectOneInTwo = useCallback(() => {
    const assignedStudentIds = groups.flatMap((g) =>
      g.students.map((s: any) => s.id)
    )
    const availableStudents = allStudentsForGrouping.filter(
      (s) => !assignedStudentIds.includes(s.id)
    )
    setSelectedStudents(
      availableStudents.filter((_, index) => index % 2 === 0).map((s) => s.id)
    )
  }, [groups, allStudentsForGrouping])

  const saveGroups = useCallback(
    async (groupsToSave: Group[]) => {
      try {
        const academicYear = filterOptions.years.find(
          (y: any) =>
            (typeof y === 'object' && y !== null && 'libelle' in y && y.libelle === selectedYear) || y === selectedYear
        )
        const department = filterOptions.filieres.find(
          (f: any) =>
            (typeof f === 'object' &&
              f !== null &&
              (('title' in f && f.title === selectedFiliere) ||
                ('libelle' in f && f.libelle === selectedFiliere) ||
                ('name' in f && f.name === selectedFiliere))) ||
            f === selectedFiliere
        )

        const academicYearId =
          typeof academicYear === 'object' && academicYear !== null && 'id' in academicYear
            ? academicYear.id
            : academicYear
        const departmentId =
          typeof department === 'object' && department !== null && 'id' in department
            ? department.id
            : department

        const academicYearIdNum =
          typeof academicYearId === 'string' ? parseInt(academicYearId, 10) : Number(academicYearId)
        const departmentIdNum =
          typeof departmentId === 'string' ? parseInt(departmentId, 10) : Number(departmentId)

        if (!academicYearIdNum || !departmentIdNum || isNaN(academicYearIdNum) || isNaN(departmentIdNum)) {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Impossible de récupérer les informations de la classe.',
          })
          return
        }

        const data = {
          academic_year_id: academicYearIdNum,
          department_id: departmentIdNum,
          study_level: selectedNiveau,
          replace_existing: true,
          groups: groupsToSave.map((g) => ({
            name: g.name,
            student_ids: g.students
              .map((s: any) => s.student_id)
              .filter((id: any) => id !== null),
          })),
        }

        const response = await InscriptionService.createClassGroups(data)

        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Groupes créés',
            text: `${groupsToSave.length} groupe(s) créé(s) avec succès !`,
            html: groupsToSave
              .map(
                (g) =>
                  `<div><strong>Groupe ${g.name}:</strong> ${g.students.length} étudiant(s)</div>`
              )
              .join(''),
          })
          reset()
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Échec de la création des groupes.',
          })
        }
      } catch (error: any) {
        console.error('Erreur lors de la sauvegarde des groupes:', error)
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error?.message || 'Une erreur est survenue lors de la sauvegarde des groupes.',
        })
      }
    },
    [selectedYear, selectedFiliere, selectedNiveau, filterOptions]
  )

  const validateGroup = useCallback(() => {
    if (selectedStudents.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Veuillez sélectionner au moins un étudiant pour ce groupe.',
      })
      return
    }

    const studentsToAdd = allStudentsForGrouping.filter((s) =>
      selectedStudents.includes(s.id)
    )
    const updatedGroups = [...groups]
    updatedGroups[currentGroupIndex].students = studentsToAdd
    setGroups(updatedGroups)

    const assignedStudentIds = updatedGroups.flatMap((g) =>
      g.students.map((s: any) => s.id)
    )
    const remainingStudents = allStudentsForGrouping.filter(
      (s) => !assignedStudentIds.includes(s.id)
    )

    if (remainingStudents.length > 0) {
      const nextGroupName = String.fromCharCode(65 + updatedGroups.length)
      const newGroup = { name: nextGroupName, students: [] }
      setGroups([...updatedGroups, newGroup])
      setCurrentGroupIndex(updatedGroups.length)
      setSelectedStudents([])
    } else {
      saveGroups(updatedGroups)
    }
  }, [
    selectedStudents,
    allStudentsForGrouping,
    groups,
    currentGroupIndex,
    saveGroups,
  ])

  const cancelGroupCreation = useCallback(async (): Promise<boolean> => {
    const result = await Swal.fire({
      title: 'Annuler la création de groupes ?',
      text: 'Tous les groupes en cours seront perdus.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, annuler',
      cancelButtonText: 'Non, continuer',
    })

    if (result.isConfirmed) {
      reset()
      return true
    }
    return false
  }, [])

  const reset = useCallback(() => {
    setGroups([])
    setSelectedStudents([])
    setAllStudentsForGrouping([])
    setCurrentGroupIndex(0)
  }, [])

  return {
    groups,
    currentGroupIndex,
    selectedStudents,
    allStudentsForGrouping,
    loading,
    initializeGroups,
    selectStudent,
    selectAll,
    deselectAll,
    selectFirst,
    selectLast,
    selectOneInTwo,
    validateGroup,
    cancelGroupCreation,
    reset,
  }
}

export default useGroupCreation
