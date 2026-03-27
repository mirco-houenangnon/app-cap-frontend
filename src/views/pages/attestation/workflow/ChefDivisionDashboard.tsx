// src/views/pages/attestation/workflow/ChefDivisionDashboard.tsx

import { useState, useCallback, useEffect } from 'react'
import {
  CCard, CCardBody, CCardHeader, CRow, CCol, CTable, CTableHead,
  CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CButton, CSpinner, CFormInput, CInputGroup, CInputGroupText,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CAlert, CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilCheckAlt, cilX, cilInbox, cilExternalLink } from '@coreui/icons'
import documentRequestService from '@/services/document-request.service'
import type { DocumentRequest } from '@/types/document-request.types'
import { TYPE_LABELS, CHEF_DIVISION_LABELS } from '@/types/document-request.types'
import { WorkflowTimeline } from '@/components/document-request/WorkflowBadge'
import MotifModal from '@/components/document-request/MotifModal'
import DossierFiles from '@/components/document-request/DossierFiles'

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
            {demande.chef_division_type && (
              <CBadge color="info" className="ms-2">{CHEF_DIVISION_LABELS[demande.chef_division_type]}</CBadge>
            )}
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
                <p className="small text-muted mb-0">
                  Soumis le : {demande.submitted_at ? new Date(demande.submitted_at).toLocaleDateString('fr-FR') : '—'}
                </p>
              </div>
            </CCol>
          </CRow>

          <div className="mt-3">
            <p className="fw-semibold small text-muted text-uppercase mb-2">Pièces jointes</p>
            <DossierFiles files={demande.files} />
          </div>

          <CAlert color="info" className="mt-3 py-2 small">
            <strong>ℹ</strong> Si vous validez, le dossier passe directement à la comptable.
            Si vous rejetez, il retourne à la secrétaire avec votre motif.
          </CAlert>
        </CModalBody>

        <CModalFooter className="gap-2 bg-light">
          <CButton color="secondary" variant="ghost" onClick={onClose} disabled={loading}>Fermer</CButton>
          <CButton color="danger" variant="outline" onClick={() => setRejectModal(true)} disabled={loading}>
            <CIcon icon={cilX} className="me-1" /> Rejeter
          </CButton>
          <CButton color="success" onClick={() => do_('chef_division_validate')} disabled={loading}>
            <CIcon icon={cilCheckAlt} className="me-1" /> Valider → Comptable
          </CButton>
        </CModalFooter>
      </CModal>

      <MotifModal
        visible={rejectModal}
        title="Rejeter et retourner à la secrétaire"
        confirmLabel="Rejeter"
        confirmColor="danger"
        placeholder="Motif du rejet / correction à apporter…"
        onClose={() => setRejectModal(false)}
        onConfirm={async (motif) => { await do_('chef_division_reject', motif); setRejectModal(false) }}
      />
    </>
  )
}

const ChefDivisionDashboard = () => {
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
      {/* Stats card */}
      <CRow className="mb-4">
        <CCol md={4}>
          <div className="border rounded p-3" style={{ borderLeftWidth: 4, borderLeftColor: '#3b82f6', background: '#eff6ff' }}>
            <div className="text-muted small">En attente de validation</div>
            <div className="fw-bold" style={{ fontSize: '2rem', color: '#3b82f6' }}>{demandes.length}</div>
          </div>
        </CCol>
      </CRow>

      <CCard className="shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center bg-white">
          <div>
            <strong>Dossiers à valider</strong>
            <div className="text-muted small">Chef Division</div>
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
              <div>Aucun dossier en attente</div>
            </div>
          ) : (
            <CTable hover responsive className="align-middle mb-0">
              <CTableHead style={{ background: '#f8fafc' }}>
                <CTableRow>
                  <CTableHeaderCell>Référence</CTableHeaderCell>
                  <CTableHeaderCell>Étudiant</CTableHeaderCell>
                  <CTableHeaderCell>Filière</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Formation</CTableHeaderCell>
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
                    <CTableDataCell><small>{d.department || '—'}</small></CTableDataCell>
                    <CTableDataCell><small>{TYPE_LABELS[d.type] ?? d.type}</small></CTableDataCell>
                    <CTableDataCell>
                      {d.chef_division_type
                        ? <CBadge color="info">{CHEF_DIVISION_LABELS[d.chef_division_type]}</CBadge>
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
      />
    </div>
  )
}

export default ChefDivisionDashboard
