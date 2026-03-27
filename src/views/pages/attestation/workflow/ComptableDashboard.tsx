// src/views/pages/attestation/workflow/ComptableDashboard.tsx

import { useState, useCallback, useEffect } from 'react'
import {
  CCard, CCardBody, CCardHeader, CRow, CCol, CTable, CTableHead,
  CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CButton, CSpinner, CFormInput, CInputGroup, CInputGroupText,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CAlert, CBadge, CProgress,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilCheckAlt, cilX, cilInbox, cilExternalLink, cilMoney } from '@coreui/icons'
import documentRequestService from '@/services/document-request.service'
import { financeService } from '@/services/finance.service'
import type { DocumentRequest } from '@/types/document-request.types'
import { TYPE_LABELS } from '@/types/document-request.types'
import { WorkflowTimeline } from '@/components/document-request/WorkflowBadge'
import MotifModal from '@/components/document-request/MotifModal'
import DossierFiles from '@/components/document-request/DossierFiles'

// ─── Panneau situation financière ─────────────────────────────────────────────
const FinancialPanel = ({ demande }: { demande: DocumentRequest }) => {
  const [finData, setFinData] = useState<any>(null)
  const [finLoading, setFinLoading] = useState(true)
  const [finError, setFinError] = useState('')

  useEffect(() => {
    if (!demande.student_pending_student_id) {
      setFinLoading(false)
      setFinError('Identifiant étudiant introuvable.')
      return
    }
    setFinLoading(true)
    financeService.getStudentBalance(demande.student_pending_student_id)
      .then((res: any) => setFinData(res.data || res))
      .catch(() => setFinError('Impossible de charger la situation financière.'))
      .finally(() => setFinLoading(false))
  }, [demande.student_pending_student_id])

  if (finLoading) return (
    <div className="text-center py-3">
      <CSpinner size="sm" color="primary" className="me-2" />
      <small className="text-muted">Chargement situation financière…</small>
    </div>
  )

  if (finError) return (
    <CAlert color="warning" className="py-2 small mb-0">
      <CIcon icon={cilMoney} className="me-1" /> {finError}
    </CAlert>
  )

  const totalDue  = finData?.total_due   ?? finData?.montant_total  ?? 0
  const totalPaid = finData?.total_paid  ?? finData?.montant_paye   ?? 0
  const balance   = finData?.balance     ?? finData?.solde          ?? (totalDue - totalPaid)
  const isSolde   = balance <= 0
  const pct       = totalDue > 0 ? Math.min(100, Math.round((totalPaid / totalDue) * 100)) : 0

  return (
    <div className="border rounded p-3 mt-3" style={{ background: isSolde ? '#f0fdf4' : '#fff7ed' }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <p className="fw-semibold small text-muted text-uppercase mb-0">Situation financière</p>
        <CBadge color={isSolde ? 'success' : 'warning'} style={{ fontSize: '0.75rem' }}>
          {isSolde ? '✅ Soldé' : '⚠️ Reste à payer'}
        </CBadge>
      </div>
      <CRow className="g-2 mb-2">
        <CCol xs={4}>
          <div className="text-center">
            <div className="small text-muted">Total dû</div>
            <div className="fw-bold" style={{ fontSize: '1.1rem' }}>
              {Number(totalDue).toLocaleString('fr-FR')} <span className="small">FCFA</span>
            </div>
          </div>
        </CCol>
        <CCol xs={4}>
          <div className="text-center">
            <div className="small text-muted">Payé</div>
            <div className="fw-bold text-success" style={{ fontSize: '1.1rem' }}>
              {Number(totalPaid).toLocaleString('fr-FR')} <span className="small">FCFA</span>
            </div>
          </div>
        </CCol>
        <CCol xs={4}>
          <div className="text-center">
            <div className="small text-muted">Restant</div>
            <div className={`fw-bold ${isSolde ? 'text-success' : 'text-danger'}`} style={{ fontSize: '1.1rem' }}>
              {Math.abs(Number(balance)).toLocaleString('fr-FR')} <span className="small">FCFA</span>
            </div>
          </div>
        </CCol>
      </CRow>
      <CProgress
        value={pct}
        color={isSolde ? 'success' : pct > 50 ? 'warning' : 'danger'}
        style={{ height: 6 }}
      />
      <div className="text-end mt-1">
        <small className="text-muted">{pct}% réglé</small>
      </div>
    </div>
  )
}

// ─── Modal de détail ──────────────────────────────────────────────────────────
const DetailModal = ({
  demande, visible, onClose, onAction,
}: {
  demande: DocumentRequest | null
  visible: boolean
  onClose: () => void
  onAction: (action: string, motif?: string) => Promise<void>
}) => {
  const [rejectModal, setRejectModal] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!demande) return null

  const do_ = async (action: string, motif?: string) => {
    setLoading(true)
    try { await onAction(action, motif) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  return (
    <>
      <CModal visible={visible} onClose={onClose} size="lg" alignment="center" scrollable>
        <CModalHeader>
          <CModalTitle>
            Dossier <code className="text-muted fw-normal ms-1">#{demande.reference}</code>
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          <WorkflowTimeline currentStatus={demande.status} />

          <CRow className="mt-3 g-2">
            <CCol md={6}>
              <div className="border rounded p-3 bg-light h-100">
                <p className="fw-semibold mb-2 text-uppercase small text-muted">Étudiant</p>
                <p className="fw-bold mb-1">{demande.last_name} {demande.first_names}</p>
                <p className="small text-muted mb-1">Matricule : {demande.matricule || '—'}</p>
                <p className="small text-muted mb-1">Filière : {demande.department || '—'}</p>
                <p className="small text-muted mb-0">Année : {demande.academic_year || '—'}</p>
              </div>
            </CCol>
            <CCol md={6}>
              <div className="border rounded p-3 bg-light h-100">
                <p className="fw-semibold mb-2 text-uppercase small text-muted">Document demandé</p>
                <p className="fw-bold mb-1">{TYPE_LABELS[demande.type] ?? demande.type}</p>
                <p className="small text-muted mb-1">
                  Soumis le : {demande.submitted_at ? new Date(demande.submitted_at).toLocaleDateString('fr-FR') : '—'}
                </p>
                {demande.chef_division_reviewed_at && (
                  <p className="small mb-0">
                    <CBadge color="success">✓ Validé par Chef Division</CBadge>
                  </p>
                )}
              </div>
            </CCol>
          </CRow>

          {/* Situation financière */}
          <FinancialPanel demande={demande} />

          <div className="mt-3">
            <p className="fw-semibold small text-muted text-uppercase mb-2">Pièces jointes (quittances, reçus…)</p>
            <DossierFiles files={demande.files} />
          </div>

          <CAlert color="info" className="mt-3 py-2 small">
            <strong>ℹ</strong> Si la situation financière est en ordre, validez.
            Si vous rejetez, le dossier retourne à la secrétaire avec votre commentaire.
          </CAlert>
        </CModalBody>

        <CModalFooter className="gap-2 bg-light">
          <CButton color="secondary" variant="ghost" onClick={onClose} disabled={loading}>Fermer</CButton>
          <CButton color="danger" variant="outline" onClick={() => setRejectModal(true)} disabled={loading}>
            <CIcon icon={cilX} className="me-1" /> Rejeter
          </CButton>
          <CButton color="success" onClick={() => do_('comptable_validate')} disabled={loading}>
            <CIcon icon={cilCheckAlt} className="me-1" /> Valider → Chef CAP
          </CButton>
        </CModalFooter>
      </CModal>

      <MotifModal
        visible={rejectModal}
        title="Rejeter et retourner à la secrétaire"
        confirmLabel="Rejeter"
        confirmColor="danger"
        placeholder="Décrire le problème financier ou la pièce manquante…"
        onClose={() => setRejectModal(false)}
        onConfirm={async (motif) => { await do_('comptable_reject', motif); setRejectModal(false) }}
      />
    </>
  )
}

// ─── Vue principale ───────────────────────────────────────────────────────────
const ComptableDashboard = () => {
  const [demandes, setDemandes] = useState<DocumentRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<DocumentRequest | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await documentRequestService.getAll({ search })
      setDemandes(res.data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [search])

  useEffect(() => { load() }, [load])

  const handleAction = async (action: string, motif?: string) => {
    if (!selected) return
    await documentRequestService.transition(selected.id, { action, motif })
    setDetailOpen(false)
    setSelected(null)
    await load()
  }

  return (
    <div>
      <CRow className="mb-4">
        <CCol md={4}>
          <div className="border rounded p-3" style={{ borderLeftWidth: 4, borderLeftColor: '#8b5cf6', background: '#f5f3ff' }}>
            <div className="text-muted small">Dossiers à vérifier</div>
            <div className="fw-bold" style={{ fontSize: '2rem', color: '#8b5cf6' }}>{demandes.length}</div>
          </div>
        </CCol>
      </CRow>

      <CCard className="shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center bg-white">
          <div>
            <strong>Vérification financière</strong>
            <div className="text-muted small">Comptabilité</div>
          </div>
          <CInputGroup size="sm" style={{ width: 220 }}>
            <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
            <CFormInput placeholder="Référence, nom…" value={search} onChange={e => setSearch(e.target.value)} />
          </CInputGroup>
        </CCardHeader>

        <CCardBody className="p-0">
          {loading ? (
            <div className="text-center py-5"><CSpinner color="primary" /></div>
          ) : demandes.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <CIcon icon={cilInbox} size="3xl" className="mb-2 d-block mx-auto opacity-25" />
              <div>Aucun dossier en attente de vérification</div>
            </div>
          ) : (
            <CTable hover responsive className="align-middle mb-0">
              <CTableHead style={{ background: '#f8fafc' }}>
                <CTableRow>
                  <CTableHeaderCell>Référence</CTableHeaderCell>
                  <CTableHeaderCell>Étudiant</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                  <CTableHeaderCell style={{ width: 60 }}></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {demandes.map(d => (
                  <CTableRow key={d.id} style={{ cursor: 'pointer' }} onClick={() => { setSelected(d); setDetailOpen(true) }}>
                    <CTableDataCell><code className="text-primary" style={{ fontSize: '0.82rem' }}>{d.reference}</code></CTableDataCell>
                    <CTableDataCell>
                      <div className="fw-semibold">{d.last_name} {d.first_names}</div>
                      <small className="text-muted">{d.matricule || '—'} · {d.department || '—'}</small>
                    </CTableDataCell>
                    <CTableDataCell><small>{TYPE_LABELS[d.type] ?? d.type}</small></CTableDataCell>
                    <CTableDataCell>
                      <small className="text-muted">
                        {d.submitted_at ? new Date(d.submitted_at).toLocaleDateString('fr-FR') : '—'}
                      </small>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton color="primary" size="sm" variant="ghost"><CIcon icon={cilExternalLink} /></CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      <DetailModal
        demande={selected}
        visible={detailOpen}
        onClose={() => { setDetailOpen(false); setSelected(null) }}
        onAction={handleAction}
      />
    </div>
  )
}

export default ComptableDashboard
