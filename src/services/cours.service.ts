import HttpService from './http.service'
import { COURS_ROUTES } from '@/constants/routes.constants'
import type {
  TeachingUnit,
  CourseElement,
  CourseResource,
  Program,
  CreateTeachingUnitRequest,
  UpdateTeachingUnitRequest,
  CreateCourseElementRequest,
  UpdateCourseElementRequest,
  CreateCourseResourceRequest,
  UpdateCourseResourceRequest,
  CreateProgramRequest,
  UpdateProgramRequest,
  BulkCreateProgramsRequest,
  CopyProgramsRequest,
  AttachProfessorRequest,
  TeachingUnitFilters,
  CourseElementFilters,
  CourseResourceFilters,
  ProgramFilters,
  Professor,
  ClassGroup,
  CourseElementProfessor,
} from '@/types/cours.types'
import type { ApiResponse } from '@/types'

/**
 * Service pour le module Cours
 * Gestion des UE, ECUE, Ressources et Programmes
 */
class CoursService {

  // ==================== TEACHING UNITS ====================

  /**
   * Récupère la liste des unités d'enseignement avec pagination et filtres
   */
  getTeachingUnits = async (filters: TeachingUnitFilters = {}): Promise<ApiResponse<TeachingUnit[]>> => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })
    
    const url = params.toString() 
      ? `${COURS_ROUTES.TEACHING_UNITS}?${params.toString()}`
      : COURS_ROUTES.TEACHING_UNITS
    
    // La réponse du backend suit la structure ApiResponse<{data: TeachingUnit[], meta}>
    const response = await HttpService.get<ApiResponse<TeachingUnit[]>>(url)
    return response
  }

  /**
   * Récupère une unité d'enseignement par ID
   */
  getTeachingUnit = async (id: number | string): Promise<TeachingUnit | undefined> => {
    const response = await HttpService.get<ApiResponse<TeachingUnit>>(COURS_ROUTES.TEACHING_UNIT(id))
    return response.data
  }

  /**
   * Crée une nouvelle unité d'enseignement
   */
  createTeachingUnit = async (data: CreateTeachingUnitRequest): Promise<TeachingUnit> => {
    const response = await HttpService.post<ApiResponse<TeachingUnit>>(COURS_ROUTES.TEACHING_UNITS, data)
    return response.data!
  }

  /**
   * Met à jour une unité d'enseignement
   */
  updateTeachingUnit = async (id: number | string, data: UpdateTeachingUnitRequest): Promise<TeachingUnit> => {
    const response = await HttpService.put<ApiResponse<TeachingUnit>>(COURS_ROUTES.TEACHING_UNIT(id), data)
    return response.data!
  }

  /**
   * Supprime une unité d'enseignement
   */
  deleteTeachingUnit = async (id: number | string): Promise<void> => {
    await HttpService.delete(COURS_ROUTES.TEACHING_UNIT(id))
  }

  /**
   * Récupère les ECUE d'une unité d'enseignement
   */
  getTeachingUnitCourseElements = async (id: number | string): Promise<CourseElement[]> => {
    const response = await HttpService.get<ApiResponse<CourseElement[]>>(COURS_ROUTES.TEACHING_UNIT_COURSE_ELEMENTS(id))
    return response.data || []
  }

  // ==================== COURSE ELEMENTS ====================

  /**
   * Récupère la liste des éléments de cours avec pagination et filtres
   */
  getCourseElements = async (filters: CourseElementFilters = {}): Promise<ApiResponse<CourseElement[]>> => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })
    
    const url = params.toString() 
      ? `${COURS_ROUTES.COURSE_ELEMENTS}?${params.toString()}`
      : COURS_ROUTES.COURSE_ELEMENTS
    
    // Le backend retourne ApiResponse<CourseElement[]> avec meta à la racine
    const response = await HttpService.get<ApiResponse<CourseElement[]>>(url)
    return response
  }

  /**
   * Récupère un élément de cours par ID
   */
  getCourseElement = async (id: number | string): Promise<CourseElement | undefined> => {
    const response = await HttpService.get<ApiResponse<CourseElement>>(COURS_ROUTES.COURSE_ELEMENT(id))
    return response.data
  }

  /**
   * Crée un nouvel élément de cours
   */
  createCourseElement = async (data: CreateCourseElementRequest): Promise<CourseElement> => {
    const response = await HttpService.post<ApiResponse<CourseElement>>(COURS_ROUTES.COURSE_ELEMENTS, data)
    return response.data!
  }

  /**
   * Met à jour un élément de cours
   */
  updateCourseElement = async (id: number | string, data: UpdateCourseElementRequest): Promise<CourseElement> => {
    const response = await HttpService.put<ApiResponse<CourseElement>>(COURS_ROUTES.COURSE_ELEMENT(id), data)
    return response.data!
  }

  /**
   * Supprime un élément de cours
   */
  deleteCourseElement = async (id: number | string): Promise<void> => {
    await HttpService.delete(COURS_ROUTES.COURSE_ELEMENT(id))
  }

  /**
   * Attache un professeur à un élément de cours
   */
  attachProfessor = async (courseElementId: number | string, data: AttachProfessorRequest): Promise<void> => {
    await HttpService.post(COURS_ROUTES.COURSE_ELEMENT_PROFESSORS_ATTACH(courseElementId), data)
  }

  /**
   * Détache un professeur d'un élément de cours
   */
  detachProfessor = async (courseElementId: number | string, data: AttachProfessorRequest): Promise<void> => {
    await HttpService.post(COURS_ROUTES.COURSE_ELEMENT_PROFESSORS_DETACH(courseElementId), data)
  }

  /**
   * Récupère les professeurs d'un élément de cours
   */
  getCourseElementProfessors = async (id: number | string): Promise<Professor[]> => {
    const response = await HttpService.get<ApiResponse<Professor[]>>(COURS_ROUTES.COURSE_ELEMENT_PROFESSORS(id))
    return response.data || []
  }

  /**
   * Récupère les ressources d'un élément de cours
   */
  getCourseElementResources = async (id: number | string): Promise<CourseResource[]> => {
    const response = await HttpService.get<ApiResponse<CourseResource[]>>(COURS_ROUTES.COURSE_ELEMENT_RESOURCES(id))
    return response.data || []
  }

  // ==================== COURSE RESOURCES ====================

  /**
   * Récupère la liste des ressources avec pagination et filtres
   */
  getCourseResources = async (filters: CourseResourceFilters = {}): Promise<ApiResponse<CourseResource[]>> => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })
    
    const url = params.toString() 
      ? `${COURS_ROUTES.COURSE_RESOURCES}?${params.toString()}`
      : COURS_ROUTES.COURSE_RESOURCES
    
    // Le backend retourne ApiResponse<CourseResource[]> avec meta pour la pagination
    const response = await HttpService.get<ApiResponse<CourseResource[]>>(url)
    return response
  }

  /**
   * Récupère une ressource par ID
   */
  getCourseResource = async (id: number | string): Promise<CourseResource | undefined> => {
    const response = await HttpService.get<ApiResponse<CourseResource>>(COURS_ROUTES.COURSE_RESOURCE(id))
    return response.data
  }

  /**
   * Crée une nouvelle ressource (avec upload de fichier)
   */
createCourseResource = async (data: CreateCourseResourceRequest): Promise<CourseResource> => {
  const formData = new FormData()

  formData.append('title', data.title)
  formData.append('pedagogical_type', data.pedagogical_type)
  if (data.description) formData.append('description', data.description)
  formData.append('is_public', data.is_public ? '1' : '0')
  formData.append('course_element_id', data.course_element_id.toString())

  // SEULEMENT si le fichier existe
  if (data.file instanceof File) {
    formData.append('file', data.file)
  }

  const response = await HttpService.post<ApiResponse<CourseResource>>(
    COURS_ROUTES.COURSE_RESOURCES,
    formData
  )
  return response.data!
}

  /**
   * Met à jour une ressource
   */
  updateCourseResource = async (id: number | string, data: UpdateCourseResourceRequest): Promise<CourseResource> => {
    const response = await HttpService.put<ApiResponse<CourseResource>>(COURS_ROUTES.COURSE_RESOURCE(id), data)
    return response.data!
  }

  /**
   * Supprime une ressource
   */
  deleteCourseResource = async (id: number | string): Promise<void> => {
    await HttpService.delete(COURS_ROUTES.COURSE_RESOURCE(id))
  }

  // ==================== PROGRAMS ====================

  /**
   * Récupère la liste des programmes avec pagination et filtres
   */
  getPrograms = async (filters: ProgramFilters = {}): Promise<ApiResponse<Program[]>> => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })
    
    const url = params.toString() 
      ? `${COURS_ROUTES.PROGRAMS}?${params.toString()}`
      : COURS_ROUTES.PROGRAMS
    
    // Le backend retourne ApiResponse<Program[]> avec meta pour la pagination
    const response = await HttpService.get<ApiResponse<Program[]>>(url)
    return response
  }

  /**
   * Récupère un programme par ID
   */
  getProgram = async (id: number | string): Promise<Program | undefined> => {
    const response = await HttpService.get<ApiResponse<Program>>(COURS_ROUTES.PROGRAM(id))
    return response.data
  }

  /**
   * Crée un nouveau programme
   */
  createProgram = async (data: CreateProgramRequest): Promise<Program> => {
    const response = await HttpService.post<ApiResponse<Program>>(COURS_ROUTES.PROGRAMS, data)
    return response.data!
  }

  /**
   * Met à jour un programme
   */
  updateProgram = async (id: number | string, data: UpdateProgramRequest): Promise<Program> => {
    const response = await HttpService.put<ApiResponse<Program>>(COURS_ROUTES.PROGRAM(id), data)
    return response.data!
  }

  /**
   * Supprime un programme
   */
  deleteProgram = async (id: number | string): Promise<void> => {
    await HttpService.delete(COURS_ROUTES.PROGRAM(id))
  }

  /**
   * Reconduit un programme pour la prochaine année académique
   * TODO: Implémenter quand la logique backend sera finalisée
   */
  renewProgram = async (id: number | string): Promise<Program> => {
    const response = await HttpService.post(`${COURS_ROUTES.PROGRAM(id)}/renew`)
    return response.data
  }

  /**
   * Crée plusieurs programmes en masse
   */
  bulkCreatePrograms = async (data: BulkCreateProgramsRequest) => {
    const response = await HttpService.post(COURS_ROUTES.PROGRAMS_BULK, data)
    return response.data
  }

  /**
   * Copie les programmes d'une classe vers une autre
   */
  copyPrograms = async (data: CopyProgramsRequest) => {
    const response = await HttpService.post(COURS_ROUTES.PROGRAMS_COPY, data)
    return response.data
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Récupère les programmes d'un groupe de classe
   */
  getClassGroupPrograms = async (classGroupId: number | string): Promise<Program[]> => {
    const response = await HttpService.get<ApiResponse<Program[]>>(COURS_ROUTES.CLASS_GROUP_PROGRAMS(classGroupId))
    return response.data || []
  }

  /**
   * Récupère les programmes d'un professeur
   */
  getProfessorPrograms = async (professorId: number | string): Promise<Program[]> => {
    const response = await HttpService.get<ApiResponse<Program[]>>(COURS_ROUTES.PROFESSOR_PROGRAMS(professorId))
    return response.data || []
  }

  /**
   * Récupère les programmes d'un élément de cours
   */
  getCourseElementPrograms = async (courseElementId: number | string): Promise<Program[]> => {
    const response = await HttpService.get<ApiResponse<Program[]>>(COURS_ROUTES.COURSE_ELEMENT_PROGRAMS(courseElementId))
    return response.data || []
  }

  // ==================== COURSE ELEMENT PROFESSOR ASSIGNMENTS ====================

  /**
   * Récupère toutes les associations Matière-Professeur
   */
  getCourseElementProfessorAssignments = async (filters: any = {}): Promise<ApiResponse<CourseElementProfessor[]>> => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })
    
    const url = params.toString() 
      ? `${COURS_ROUTES.COURSE_ELEMENT_PROFESSORS_ASSIGNMENTS}?${params.toString()}`
      : COURS_ROUTES.COURSE_ELEMENT_PROFESSORS_ASSIGNMENTS
    
    const response = await HttpService.get<ApiResponse<CourseElementProfessor[]>>(url)
    return response
  }

  /**
   * Récupère une association par ID
   */
  getCourseElementProfessorAssignment = async (id: number | string): Promise<CourseElementProfessor | undefined> => {
    const response = await HttpService.get<ApiResponse<CourseElementProfessor>>(COURS_ROUTES.COURSE_ELEMENT_PROFESSOR_ASSIGNMENT(id))
    return response.data
  }

  /**
   * Crée une nouvelle association Matière-Professeur
   */
  createCourseElementProfessorAssignment = async (data: { course_element_id: number; professor_id: number }): Promise<CourseElementProfessor> => {
    const response = await HttpService.post<ApiResponse<CourseElementProfessor>>(COURS_ROUTES.COURSE_ELEMENT_PROFESSORS_ASSIGNMENTS, data)
    return response.data!
  }

  /**
   * Met à jour une association Matière-Professeur
   */
  updateCourseElementProfessorAssignment = async (id: number | string, data: { course_element_id?: number; professor_id?: number }): Promise<CourseElementProfessor> => {
    const response = await HttpService.put<ApiResponse<CourseElementProfessor>>(COURS_ROUTES.COURSE_ELEMENT_PROFESSOR_ASSIGNMENT(id), data)
    return response.data!
  }

  /**
   * Supprime une association Matière-Professeur
   */
  deleteCourseElementProfessorAssignment = async (id: number | string): Promise<void> => {
    await HttpService.delete(COURS_ROUTES.COURSE_ELEMENT_PROFESSOR_ASSIGNMENT(id))
  }

  // ==================== REFERENCE DATA ====================

  /**
   * Récupère la liste des professeurs (pour les selects)
   */
  getProfessors = async (): Promise<Professor[]> => {
    const response = await HttpService.get<ApiResponse<Professor[]>>('rh/professors')
    return response.data || []
  }

  /**
   * Récupère la liste des groupes de classe (pour les selects)
   */
  getClassGroups = async (): Promise<ClassGroup[]> => {
    try {
      // Récupérer toutes les classes (table class_groups dans Inscription)
      const response = await HttpService.get<ApiResponse<any[]>>('cours/class-groups')
      return response.data || []
    } catch (error) {
      console.error('Erreur getClassGroups:', error)
      return []
    }
  }

  /**
   * Reconduit les associations matière-professeur pour l'année suivante
   */
  renewCourseElementProfessors = async (currentYearId: number, nextYearId: number) => {
    const response = await HttpService.post(COURS_ROUTES.COURSE_ELEMENT_PROFESSORS_RENEW, {
      current_academic_year_id: currentYearId,
      next_academic_year_id: nextYearId,
    })
    return response.data
  }

  /**
   * Reconduit les programmes pour l'année suivante
   */
  renewPrograms = async (currentYearId: number, nextYearId: number) => {
    const response = await HttpService.post(COURS_ROUTES.PROGRAMS_RENEW, {
      current_academic_year_id: currentYearId,
      next_academic_year_id: nextYearId,
    })
    return response.data
  }

  /**
   * Récupère les années académiques
   */
  getAcademicYears = async () => {
    const response = await HttpService.get<ApiResponse<any[]>>('inscription/academic-years')
    return response.data || []
  }
}

export default new CoursService()
