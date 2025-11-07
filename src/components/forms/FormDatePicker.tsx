import React from 'react'
import DatePicker from 'react-datepicker'
import { CFormLabel, CFormFeedback, CFormText } from '@coreui/react'
import 'react-datepicker/dist/react-datepicker.css'

interface FormDatePickerProps {
  id: string
  label?: string
  selected: Date | null
  onChange: (date: Date | null) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  helpText?: string
  className?: string
  dateFormat?: string
  minDate?: Date
  maxDate?: Date
  showTimeSelect?: boolean
  timeFormat?: string
  timeIntervals?: number
}

/**
 * Composant FormDatePicker réutilisable
 * Gère les champs de date avec validation et feedback
 */
const FormDatePicker: React.FC<FormDatePickerProps> = ({
  id,
  label,
  selected,
  onChange,
  placeholder = 'Sélectionner une date',
  required = false,
  disabled = false,
  error,
  helpText,
  className = '',
  dateFormat = 'dd/MM/yyyy',
  minDate,
  maxDate,
  showTimeSelect = false,
  timeFormat = 'HH:mm',
  timeIntervals = 15,
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
      <DatePicker
        id={id}
        selected={selected}
        onChange={onChange}
        dateFormat={dateFormat}
        placeholderText={placeholder}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        showTimeSelect={showTimeSelect}
        timeFormat={timeFormat}
        timeIntervals={timeIntervals}
        className={`form-control ${hasError ? 'is-invalid' : ''}`}
        wrapperClassName="d-block"
      />
      {hasError && (
        <CFormFeedback invalid className="d-block">
          {error}
        </CFormFeedback>
      )}
      {helpText && !hasError && <CFormText>{helpText}</CFormText>}
    </div>
  )
}

export default FormDatePicker
