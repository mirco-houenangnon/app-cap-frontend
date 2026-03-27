// src/views/pages/attestation/workflow/ChefCapDashboard.tsx
// Workflow Chef CAP :
//   - Parapher  → directeur_adjoint_review → directeur_review → ready + mail
//   - Signer    → ready + mail immédiat
//   - Rejeter   → rejected_pending_resend (retour secrétaire)

import { useState, useCallback, useEffect } from 'react'
import {
  CCard, CCardBody, CCardHeader, CRow, CCol, CTable, CTableHead,
  CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CButton, CSpinner, CFormInput, CInputGroup, CInputGroupText,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CAlert, CFormCheck,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilInbox, cilExternalLink, cilX } from '@coreui/icons'
import documentRequestService from '@/services/document-request.service'
import type { DocumentRequest } from '@/types/document-request.types'
import { TYPE_LABELS } from '@/types/document-request.types'
import { WorkflowTimeline } from '@/components/document-request/WorkflowBadge'
import MotifModal from '@/components/document-request/MotifModal'
import DossierFiles from '@/components/document-request/DossierFiles'

type CapChoice = 'paraphe' | 'signature'

const CHOICES: { value: CapChoice; label: string; desc: string; color: string; nextLabel: string }[] = [
  {
    value: 'paraphe',
    label: 'Parapher',
    desc: 'Le document passera ensuite chez la Directrice Adjointe, puis le Directeur, avant d\'être prêt.',
    color: '#7c3aed',
    nextLabel: 'Parapher & Transmettre à la Directrice Adjointe',
  },
  {
    value: 'signature',
    label: 'Signer / Valider',
    desc: 'Le document est validé directement. Il sera immédiatement prêt à retirer et l\'étudiant recevra un mail.',
    color: '#10b981',
    nextLabel: 'Signer — Document prêt immédiatement',
  },
]

const DetailModal = ({
  demande, visible, onClose, onAction,
}: {
  demande: DocumentRequest | null
  visible: boolean
  onClose: () => void
  onAction: (action: string, extra?: Record<string, any>) => Promise<void>
}) => {
  const [choice, setChoice] = useState<CapChoice>('paraphe')
  const [actionLoading, setActionLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [rejectModal, setRejectModal] = useState(false)

  if (!demande) return null

  const selectedChoice = CHOICES.find(c => c.value === choice)!

  const runAction = async (action: string, extra?: Record<string, any>) => {
    setActionLoading(true)
    try {
      await onAction(action, extra)
    } catch (e) {
      console.error(e)
    } finally {
      setActionLoading(false)
      setConfirmed(false)
    }
  }

  const handleValidate = () => {
    if (choice === 'paraphe') {
      runAction('chef_cap_sign', { signature_type: 'paraphe' })
    } else {
      // Signer = valide directement → ready + mail
      runAction('chef_cap_sign', { signature_type: 'signature' })
    }
  }

  return (
    <>
      <CModal visible={visible} onClose={onClose} size="lg" alignment="center" scrollable>
        <CModalHeader>
          <CModalTitle>
            Traitement — <code className="text-muted fw-normal">#{demande.reference}</code>
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
                <p className="small text-muted mb-0">Filière : {demande.department || '—'}</p>
              </div>
            </CCol>
            <CCol md={6}>
              <div className="border rounded p-3 bg-light h-100">
                <p className="fw-semibold mb-2 text-uppercase small text-muted">Document</p>
                <p className="fw-bold mb-1">{TYPE_LABELS[demande.type] ?? demande.type}</p>
                <p className="small text-muted mb-0">
                  Soumis le : {demande.submitted_at
                    ? new Date(demande.submitted_at).toLocaleDateString('fr-FR') : '—'}
                </p>
              </div>
            </CCol>
          </CRow>

          <div className="mt-3">
            <p className="fw-semibold small text-muted text-uppercase mb-2">Pièces du dossier</p>
            <DossierFiles files={demande.files} />
          </div>

          {/* Choix paraphe ou signature */}
          <div className="mt-4">
            <p className="fw-semibold mb-3">Quelle action souhaitez-vous effectuer ?</p>
            <div className="d-flex flex-column gap-3">
              {CHOICES.map(opt => (
                <div
                  key={opt.value}
                  onClick={() => { setChoice(opt.value); setConfirmed(false) }}
                  style={{
                    border: `2px solid ${choice === opt.value ? opt.color : '#e5e7eb'}`,
                    borderRadius: 10,
                    padding: '14px 16px',
                    cursor: 'pointer',
                    background: choice === opt.value ? opt.color + '10' : 'white',
                    transition: 'all 0.15s',
                  }}
                >
                  <div className="d-flex align-items-start gap-3">
                    {/* Radio visuel */}
                    <div style={{
                      marginTop: 2,
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${choice === opt.value ? opt.color : '#d1d5db'}`,
                      background: choice === opt.value ? opt.color : 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {choice === opt.value && (
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />
                      )}
                    </div>
                    <div>
                      <div className="fw-bold mb-1" style={{ color: choice === opt.value ? opt.color : '#111827' }}>
                        {opt.label}
                      </div>
                      <div className="text-muted" style={{ fontSize: '0.82rem', lineHeight: 1.4 }}>
                        {opt.desc}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <CAlert color="warning" className="mt-4 py-2 small mb-0">
            ⚠ Votre décision est définitive. En cas de rejet, le dossier retourne à la secrétaire avec votre motif.
          </CAlert>

          <div className="d-flex align-items-center gap-2 mt-3">
            <CFormCheck
              id="confirm-cap"
              checked={confirmed}
              onChange={e => setConfirmed(e.target.checked)}
            />
            <label htmlFor="confirm-cap" className="mb-0 small">
              J'ai vérifié le dossier et je confirme ma décision.
            </label>
          </div>
        </CModalBody>

        <CModalFooter className="flex-wrap gap-2" style={{ background: '#f8fafc' }}>
          <CButton color="secondary" variant="ghost" onClick={onClose} disabled={actionLoading}>
            Fermer
          </CButton>
          <CButton
            color="danger"
            variant="outline"
            onClick={() => setRejectModal(true)}
            disabled={actionLoading}
          >
            <CIcon icon={cilX} className="me-1" />Rejeter
          </CButton>
          <CButton
            style={{
              background: confirmed ? selectedChoice.color : '#9ca3af',
              borderColor: confirmed ? selectedChoice.color : '#9ca3af',
              color: 'white',
              opacity: actionLoading ? 0.7 : 1,
            }}
            onClick={handleValidate}
            disabled={actionLoading || !confirmed}
          >
            {actionLoading
              ? <><CSpinner size="sm" className="me-1" />En cours…</>
              : selectedChoice.nextLabel
            }
          </CButton>
        </CModalFooter>
      </CModal>

      <MotifModal
        visible={rejectModal}
        title="Rejeter — retour à la secrétaire"
        confirmLabel="Rejeter"
        confirmColor="danger"
        placeholder="Indiquer le motif du rejet…"
        onClose={() => setRejectModal(false)}
        onConfirm={async (motif) => {
          setRejectModal(false)
          await runAction('chef_cap_reject', { motif })
        }}
      />
    </>
  )
}

// ─── Vue principale ───────────────────────────────────────────────────────────
const ChefCapDashboard = () => {
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

  const handleAction = async (action: string, extra?: Record<string, any>) => {
    if (!selected) return
    await documentRequestService.transition(selected.id, { action, ...extra })
    setDetailOpen(false)
    setSelected(null)
    await load()
  }

  return (
    <div>
      <CRow className="mb-4">
        <CCol md={4}>
          <div className="border rounded p-3" style={{ borderLeft: '4px solid #0ea5e9', background: '#f0f9ff' }}>
            <div className="text-muted small">Documents à traiter</div>
            <div className="fw-bold" style={{ fontSize: '2rem', color: '#0ea5e9' }}>{demandes.length}</div>
          </div>
        </CCol>
      </CRow>

      <CCard className="shadow-sm border-0">
        <CCardHeader className="d-flex justify-content-between align-items-center bg-white">
          <div>
            <strong>Documents à traiter</strong>
            <div className="text-muted small">Chef CAP</div>
          </div>
          <CInputGroup size="sm" style={{ width: 220 }}>
            <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
            <CFormInput
              placeholder="Référence, nom…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </CInputGroup>
        </CCardHeader>

        <CCardBody className="p-0">
          {loading ? (
            <div className="text-center py-5"><CSpinner color="primary" /></div>
          ) : demandes.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <CIcon icon={cilInbox} size="3xl" className="mb-2 d-block mx-auto opacity-25" />
              <div className="fw-semibold">Aucun document en attente</div>
            </div>
          ) : (
            <CTable hover responsive className="align-middle mb-0">
              <CTableHead style={{ background: '#f8fafc', fontSize: '0.8rem' }}>
                <CTableRow>
                  <CTableHeaderCell>Référence</CTableHeaderCell>
                  <CTableHeaderCell>Étudiant</CTableHeaderCell>
                  <CTableHeaderCell>Filière</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                  <CTableHeaderCell style={{ width: 50 }}></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {demandes.map(d => (
                  <CTableRow
                    key={d.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => { setSelected(d); setDetailOpen(true) }}
                  >
                    <CTableDataCell>
                      <code className="text-primary" style={{ fontSize: '0.82rem' }}>{d.reference}</code>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="fw-semibold">{d.last_name} {d.first_names}</div>
                      <small className="text-muted">{d.matricule || '—'}</small>
                    </CTableDataCell>
                    <CTableDataCell><small>{d.department || '—'}</small></CTableDataCell>
                    <CTableDataCell><small>{TYPE_LABELS[d.type] ?? d.type}</small></CTableDataCell>
                    <CTableDataCell>
                      <small className="text-muted">
                        {d.submitted_at ? new Date(d.submitted_at).toLocaleDateString('fr-FR') : '—'}
                      </small>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton color="primary" size="sm" variant="ghost">
                        <CIcon icon={cilExternalLink} />
                      </CButton>
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

export default ChefCapDashboard
