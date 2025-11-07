import React from 'react'
import { CFormSelect, CFormLabel, CFormFeedback, CFormText } from '@coreui/react'

interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

interface FormSelectProps {
  id: string
  label?: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void
  options: SelectOption[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  helpText?: string
  className?: string
}

/**
 * Composant FormSelect réutilisable
 * Gère les champs select avec validation et feedback
 */
const FormSelect: React.FC<FormSelectProps> = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  options,
  placeholder = 'Sélectionner...',
  required = false,
  disabled = false,
  error,
  helpText,
  className = '',
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
      <CFormSelect
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        invalid={hasError}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </CFormSelect>
      {hasError && <CFormFeedback invalid>{error}</CFormFeedback>}
      {helpText && !hasError && <CFormText>{helpText}</CFormText>}
    </div>
  )
}

export default FormSelect
