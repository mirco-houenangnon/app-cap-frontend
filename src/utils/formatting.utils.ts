/**
 * Utilitaires de formatage
 */

/**
 * Formater un nom d'étudiant (Nom Prénom1 Prénom2...)
 */
export const formatStudentName = (
  firstName: string,
  lastName: string,
  order: 'lastFirst' | 'firstLast' = 'lastFirst'
): string => {
  const cleanFirst = firstName?.trim() || ''
  const cleanLast = lastName?.trim() || ''

  if (!cleanFirst && !cleanLast) return ''
  if (!cleanFirst) return cleanLast
  if (!cleanLast) return cleanFirst

  return order === 'lastFirst'
    ? `${cleanLast} ${cleanFirst}`
    : `${cleanFirst} ${cleanLast}`
}

/**
 * Formater une date au format français (JJ/MM/AAAA)
 */
export const formatDate = (date: string | Date | null): string => {
  if (!date) return '-'

  try {
    const d = typeof date === 'string' ? new Date(date) : date
    if (isNaN(d.getTime())) return '-'

    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()

    return `${day}/${month}/${year}`
  } catch {
    return '-'
  }
}

/**
 * Formater une date et heure au format français
 */
export const formatDateTime = (date: string | Date | null): string => {
  if (!date) return '-'

  try {
    const d = typeof date === 'string' ? new Date(date) : date
    if (isNaN(d.getTime())) return '-'

    const dateStr = formatDate(d)
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')

    return `${dateStr} ${hours}:${minutes}`
  } catch {
    return '-'
  }
}

/**
 * Formater une année académique (2023-2024)
 */
export const formatAcademicYear = (startYear: number): string => {
  return `${startYear}-${startYear + 1}`
}

/**
 * Parser une année académique (2023-2024 → 2023)
 */
export const parseAcademicYear = (academicYear: string): number | null => {
  const match = academicYear.match(/^(\d{4})-\d{4}$/)
  return match ? parseInt(match[1], 10) : null
}

/**
 * Formater un numéro de téléphone
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '-'

  // Retirer tous les caractères non numériques sauf +
  const cleaned = phone.replace(/[^\d+]/g, '')

  // Formater selon le pattern standard
  if (cleaned.startsWith('+')) {
    // Format international
    return cleaned
  } else if (cleaned.length === 10) {
    // Format français: 06 12 34 56 78
    return cleaned.replace(/(\d{2})(?=\d)/g, '$1 ')
  }

  return cleaned
}

/**
 * Formater un email (tronquer si trop long)
 */
export const formatEmail = (email: string, maxLength = 30): string => {
  if (!email) return '-'
  if (email.length <= maxLength) return email

  return `${email.substring(0, maxLength - 3)}...`
}

/**
 * Formater un montant en CFA
 */
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Formater un pourcentage
 */
export const formatPercentage = (value: number, decimals = 2): string => {
  return `${value.toFixed(decimals)}%`
}

/**
 * Formater une durée en heures et minutes
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) return `${mins}min`
  if (mins === 0) return `${hours}h`
  return `${hours}h${mins.toString().padStart(2, '0')}`
}

/**
 * Capitaliser la première lettre
 */
export const capitalize = (text: string): string => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Capitaliser chaque mot
 */
export const capitalizeWords = (text: string): string => {
  if (!text) return ''
  return text
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ')
}

/**
 * Tronquer un texte avec ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text
  return `${text.substring(0, maxLength - 3)}...`
}

/**
 * Formater un statut (redoublant/normal)
 */
export const formatStudentStatus = (isRedoublant: boolean): string => {
  return isRedoublant ? 'Redoublant' : 'Normal'
}

/**
 * Formater le sexe
 */
export const formatGender = (gender: string): string => {
  const genderMap: Record<string, string> = {
    M: 'Masculin',
    F: 'Féminin',
  }
  return genderMap[gender] || gender
}

/**
 * Générer des initiales à partir d'un nom
 */
export const getInitials = (name: string, maxLength = 2): string => {
  if (!name) return ''

  const words = name.trim().split(/\s+/)
  const initials = words.map((word) => word.charAt(0).toUpperCase()).join('')

  return initials.substring(0, maxLength)
}

/**
 * Formater un numéro avec des zéros devant
 */
export const padNumber = (num: number, length = 2): string => {
  return String(num).padStart(length, '0')
}
