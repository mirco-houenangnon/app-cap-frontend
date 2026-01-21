import HttpService from './http.service'

export interface AcademicLevelFee {
  uuid: string
  academic_year_id: number
  department_id: number
  study_level: string | null
  registration_fee: number
  uemoa_training_fee: number
  non_uemoa_training_fee: number
  exempted_training_fee: number
  is_active: boolean
  academic_year?: any
  department?: any
}

export interface CreateAcademicLevelFeeData {
  academic_year_id: number
  department_id: number
  study_level: string
  registration_fee: number
  uemoa_training_fee: number
  non_uemoa_training_fee: number
  exempted_training_fee: number
  is_active: boolean
}

class AcademicLevelFeeService {
  private baseUrl = 'finance/academic-level-fees'

  async getAll(filters?: any) {
    const params = new URLSearchParams(filters).toString()
    const url = params ? `${this.baseUrl}?${params}` : this.baseUrl
    return HttpService.get(url)
  }

  async create(data: CreateAcademicLevelFeeData) {
    return HttpService.post(this.baseUrl, data)
  }

  async createBulk(data: CreateAcademicLevelFeeData & { department_ids: number[] }) {
    return HttpService.post(`${this.baseUrl}/bulk`, data)
  }

  async update(uuid: string, data: Partial<CreateAcademicLevelFeeData>) {
    return HttpService.put(`${this.baseUrl}/${uuid}`, data)
  }

  async delete(uuid: string) {
    return HttpService.delete(`${this.baseUrl}/${uuid}`)
  }

  async getStudentFee(data: {
    academic_year_id: number
    department_id: number
    study_level: string
    origin: 'uemoa' | 'non_uemoa' | 'exempted'
  }) {
    return HttpService.post(`${this.baseUrl}/student-fee`, data)
  }
}

export default new AcademicLevelFeeService()