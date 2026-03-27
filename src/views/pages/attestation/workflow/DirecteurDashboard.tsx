// src/views/pages/attestation/workflow/DirecteurDashboard.tsx

import { useState, useCallback, useEffect } from 'react'
import {
  CCard, CCardBody, CCardHeader, CRow, CCol, CTable, CTableHead,
  CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CButton, CSpinner, CFormInput, CInputGroup, CInputGroupText,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CAlert, CBadge, CFormCheck,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilInbox, cilExternalLink, cilX } from '@coreui/icons'
import documentRequestService from '@/services/document-request.service'
import type { DocumentRequest } from '@/types/document-request.types'
import { TYPE_LABELS } from '@/types/document-request.types'
import { WorkflowTimeline } from '@/components/document-request/WorkflowBadge'
import MotifModal from '@/components/document-request/MotifModal'
import DossierFiles from '@/components/document-request/DossierFiles'

interface Props { role: 'directeur-adjoint' | 'directeur' }

const DetailModal = ({
  demande, visible, onClose, onAction, role,
}: {
  demande: DocumentRequest | null
  visible: boolean
  onClose: () => void
  onAction: (action: string, motif?: string) => Promise<void>
  role: string
}) => {
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [rejectModal, setRejectModal] = useState(false)

  if (!demande) return null

  const action = role === 'directeur-adjoint' ? 'directeur_adjoint_sign' : 'directeur_sign'
  const label  = role === 'directeur-adjoint' ? 'Directeur Adjoint' : 'Directeur'

  const do_ = async (act: string, motif?: string) => {
    setLoading(true)
    try { await onAction(act, motif) }
    catch (e) { console.error(e) }
    finally { setLoading(false); setConfirmed(false) }
  }

  return (
    <>
      <CModal visible={visible} onClose={onClose} size="lg" alignment="center" scrollable>
        <CModalHeader>
          <CModalTitle>
            Signature <small className="text-muted">— {label}</small>
            <code className="text-muted fw-normal ms-2">#{demande.reference}</code>
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
                {demande.signature_type && (
                  <CBadge color={demande.signature_type === 'paraphe' ? 'primary' : 'success'}>
                    {demande.signature_type === 'paraphe' ? 'Paraphe Chef CAP' : 'Signature Chef CAP'}
                  </CBadge>
                )}
              </div>
            </CCol>
          </CRow>
          <div className="mt-3">
            <DossierFiles files={demande.files} />
          </div>

          <CAlert color="warning" className="mt-3 py-2 small">
            ⚠ En signant, le document sera marqué prêt à retirer par l'étudiant.
            Si vous rejetez, le dossier retourne à la secrétaire.
          </CAlert>
          <div className="d-flex align-items-center gap-2 mt-2">
            <CFormCheck id="confirm-dir" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} />
            <label htmlFor="confirm-dir" className="mb-0 small">
              J'ai examiné ce dossier et j'appose ma signature en tant que <strong>{label}</strong>.
            </label>
          </div>
        </CModalBody>

        <CModalFooter className="gap-2 bg-light">
          <CButton color="secondary" variant="ghost" onClick={onClose} disabled={loading}>Fermer</CButton>
          <CButton color="danger" variant="outline" onClick={() => setRejectModal(true)} disabled={loading}>
            <CIcon icon={cilX} className="me-1" /> Rejeter
          </CButton>
          <CButton color="success" onClick={() => do_(action)} disabled={loading || !confirmed}>
            {loading ? <CSpinner size="sm" /> : '✍ Signer — Document prêt'}
          </CButton>
        </CModalFooter>
      </CModal>

      <MotifModal
        visible={rejectModal}
        title="Rejeter — retour à la secrétaire"
        confirmLabel="Rejeter"
        confirmColor="danger"
        onClose={() => setRejectModal(false)}
        onConfirm={async (motif) => {
          const rejectAction = role === 'directeur-adjoint' ? 'directeur_adjoint_reject' : 'directeur_reject'
          await do_(rejectAction, motif)
          setRejectModal(false)
        }}
      />
    </>
  )
}

const DirecteurDashboard = ({ role }: Props) => {
  const [demandes, setDemandes] = useState<DocumentRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<DocumentRequest | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const label = role === 'directeur-adjoint' ? 'Directeur Adjoint' : 'Directeur'
  const color = role === 'directeur-adjoint' ? '#7c3aed' : '#dc2626'
  const bg    = role === 'directeur-adjoint' ? '#f5f3ff' : '#fef2f2'

  const load = useCallback(async () => {
    setLoading(true)
    try { const res = await documentRequestService.getAll({ search }); setDemandes(res.data || []) }
    catch (e) { console.error(e) }
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
          <div className="border rounded p-3" style={{ borderLeftWidth: 4, borderLeftColor: color, background: bg }}>
            <div className="text-muted small">Documents à signer</div>
            <div className="fw-bold" style={{ fontSize: '2rem', color }}>{demandes.length}</div>
          </div>
        </CCol>
      </CRow>

      <CCard className="shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center bg-white">
          <div>
            <strong>Documents à signer</strong>
            <div className="text-muted small">{label}</div>
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
              <div>Aucun document en attente</div>
            </div>
          ) : (
            <CTable hover responsive className="align-middle mb-0">
              <CTableHead style={{ background: '#f8fafc' }}>
                <CTableRow>
                  <CTableHeaderCell>Référence</CTableHeaderCell>
                  <CTableHeaderCell>Étudiant</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Type signature</CTableHeaderCell>
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
                      <small className="text-muted">{d.matricule || '—'}</small>
                    </CTableDataCell>
                    <CTableDataCell><small>{TYPE_LABELS[d.type] ?? d.type}</small></CTableDataCell>
                    <CTableDataCell>
                      {d.signature_type
                        ? <CBadge color={d.signature_type === 'paraphe' ? 'primary' : 'success'}>
                            {d.signature_type === 'paraphe' ? 'Paraphe' : 'Signature complète'}
                          </CBadge>
                        : '—'}
                    </CTableDataCell>
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
        role={role}
      />
    </div>
  )
}

export default DirecteurDashboard
