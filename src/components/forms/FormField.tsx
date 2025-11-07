import React from 'react'
import { CFormInput, CFormLabel, CFormFeedback, CFormText } from '@coreui/react'

interface FormFieldProps {
  id: string
  label?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date'
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  helpText?: string
  className?: string
  autoComplete?: string
}

/**
 * Composant FormField réutilisable
 * Gère les champs de formulaire avec validation et feedback
 */
const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  error,
  helpText,
  className = '',
  autoComplete,
}) => {
  const hasError = !!error

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <CFormLabel htmlFor={id}>
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </CFormLabel>
      )}
      <CFormInput
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        invalid={hasError}
        autoComplete={autoComplete}
      />
      {hasError && <CFormFeedback invalid>{error}</CFormFeedback>}
      {helpText && !hasError && <CFormText>{helpText}</CFormText>}
    </div>
  )
}

export default FormField
