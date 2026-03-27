// src/hooks/attestation/useDocumentRequests.ts

import { useState, useEffect, useCallback, useRef } from 'react'
import documentRequestService from '@/services/document-request.service'
import type { DocumentRequest, DocumentRequestStatus } from '@/types/document-request.types'

interface Filters {
  status?: string
  type?: string
  search?: string
  department?: string
}

interface UseDocumentRequestsOptions {
  autoRefreshInterval?: number // ms, 0 = pas de refresh auto
  initialFilters?: Filters
}

interface UseDocumentRequestsReturn {
  demandes: DocumentRequest[]
  loading: boolean
  error: string | null
  reload: () => Promise<void>
  transition: (id: number, action: string, motif?: string, signatureType?: string) => Promise<void>
  transitioning: number | null
  filters: Filters
  setFilters: (f: Filters) => void
  countByStatus: Record<string, number>
}

const useDocumentRequests = (
  options: UseDocumentRequestsOptions = {}
): UseDocumentRequestsReturn => {
  const { autoRefreshInterval = 0, initialFilters = {} } = options

  const [demandes, setDemandes]       = useState<DocumentRequest[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState<string | null>(null)
  const [transitioning, setTransitioning] = useState<number | null>(null)
  const [filters, setFilters]         = useState<Filters>(initialFilters)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await documentRequestService.getAll(filters)
      setDemandes(res.data || [])
    } catch (e: any) {
      setError(e?.message || 'Erreur lors du chargement des demandes.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    load()
  }, [load])

  // Auto-refresh optionnel
  useEffect(() => {
    if (autoRefreshInterval > 0) {
      intervalRef.current = setInterval(load, autoRefreshInterval)
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }
  }, [load, autoRefreshInterval])

  const transition = useCallback(async (
    id: number,
    action: string,
    motif?: string,
    signatureType?: string
  ) => {
    setTransitioning(id)
    try {
      await documentRequestService.transition(id, {
        action,
        motif,
        signature_type: signatureType as any,
      })
      await load()
    } finally {
      setTransitioning(null)
    }
  }, [load])

  // Compteurs par statut
  const countByStatus = demandes.reduce((acc, d) => {
    acc[d.status] = (acc[d.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    demandes,
    loading,
    error,
    reload: load,
    transition,
    transitioning,
    filters,
    setFilters,
    countByStatus,
  }
}

export default useDocumentRequests
