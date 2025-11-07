/**
 * Utilitaires de validation
 */

// Regex de validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^[\d\s+()-]+$/
const MATRICULE_REGEX = /^[A-Z0-9]+$/

/**
 * Valider une adresse email
 */
export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email)
}

/**
 * Valider un numéro de téléphone
 */
export const validatePhone = (phone: string): boolean => {
  if (!phone) return false
  const cleaned = phone.replace(/\s/g, '')
  return PHONE_REGEX.test(cleaned) && cleaned.length >= 8
}

/**
 * Valider une date
 */
export const validateDate = (date: string): boolean => {
  if (!date) return false
  const parsedDate = new Date(date)
  return parsedDate instanceof Date && !isNaN(parsedDate.getTime())
}

/**
 * Valider qu'une date n'est pas dans le futur
 */
export const validateDateNotFuture = (date: string): boolean => {
  if (!validateDate(date)) return false
  return new Date(date) <= new Date()
}

/**
 * Valider un matricule
 */
export const validateMatricule = (matricule: string): boolean => {
  return MATRICULE_REGEX.test(matricule) && matricule.length >= 4
}

/**
 * Valider qu'une chaîne n'est pas vide
 */
export const validateRequired = (value: string): boolean => {
  return value !== null && value !== undefined && value.trim().length > 0
}

/**
 * Valider la longueur minimale
 */
export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength
}

/**
 * Valider la longueur maximale
 */
export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength
}

/**
 * Valider un nombre dans une plage
 */
export const validateNumberRange = (
  value: number,
  min: number,
  max: number
): boolean => {
  return value >= min && value <= max
}

/**
 * Obtenir un message d'erreur de validation
 */
export const getValidationError = (
  field: string,
  type: 'required' | 'email' | 'phone' | 'date' | 'minLength' | 'maxLength',
  options?: { minLength?: number; maxLength?: number }
): string => {
  const errors: Record<string, string> = {
    required: `Le champ ${field} est requis.`,
    email: `Veuillez entrer une adresse email valide.`,
    phone: `Veuillez entrer un numéro de téléphone valide.`,
    date: `Veuillez entrer une date valide.`,
    minLength: `Le champ ${field} doit contenir au moins ${options?.minLength} caractères.`,
    maxLength: `Le champ ${field} ne doit pas dépasser ${options?.maxLength} caractères.`,
  }

  return errors[type] || `Le champ ${field} est invalide.`
}

/**
 * Valider un formulaire complet
 */
export interface ValidationRule {
  field: string
  value: any
  rules: Array<{
    type: 'required' | 'email' | 'phone' | 'date' | 'minLength' | 'maxLength'
    options?: { minLength?: number; maxLength?: number }
  }>
}

export const validateForm = (
  validationRules: ValidationRule[]
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {}

  validationRules.forEach(({ field, value, rules }) => {
    for (const rule of rules) {
      let isValid = true

      switch (rule.type) {
        case 'required':
          isValid = validateRequired(value)
          break
        case 'email':
          isValid = validateEmail(value)
          break
        case 'phone':
          isValid = validatePhone(value)
          break
        case 'date':
          isValid = validateDate(value)
          break
        case 'minLength':
          isValid = validateMinLength(value, rule.options?.minLength || 0)
          break
        case 'maxLength':
          isValid = validateMaxLength(value, rule.options?.maxLength || 1000)
          break
      }

      if (!isValid) {
        errors[field] = getValidationError(field, rule.type, rule.options)
        break
      }
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
