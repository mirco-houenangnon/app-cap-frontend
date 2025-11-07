import { useState, useEffect } from 'react'

/**
 * Hook useDebounce - Retarde la mise à jour d'une valeur
 * @param value - Valeur à debouncer
 * @param delay - Délai en millisecondes (par défaut 500ms)
 * @returns Valeur debouncée
 */
function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
