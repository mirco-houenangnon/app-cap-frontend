// src/views/pages/attestation/workflow/SecretaireDashboard.tsx
// NE PAS MODIFIER la logique existante — correctifs ciblés uniquement :
//  - statut rejet = secretaire_correction (conforme BD)
//  - tab "Correction" au lieu de "Rejets"
//  - resend_to accepte tout le monde (chef_division, comptable, chef_cap, directeur_adjoint, directeur)

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  CCard, CCardBody, CCardHeader, CRow, CCol, CTable, CTableHead,
  CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CButton, CSpinner, CBadge, CFormSelect, CFormInput,
  CInputGroup, CInputGroupText, CModal, CModalHeader,
  CModalTitle, CModalBody, CModalFooter, CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilSearch, cilCheckAlt, cilX, cilSend, cilExternalLink,
  cilInbox, cilReload, cilWarning,
} from '@coreui/icons'
import documentRequestService from '@/services/document-request.service'
import type { DocumentRequest, ChefDivisionType } from '@/types/document-request.types'
import { TYPE_LABELS, CHEF_DIVISION_LABELS, RESEND_OPTIONS } from '@/types/document-request.types'
import { WorkflowBadge } from '@/components/document-request/WorkflowBadge'
import { WorkflowTimeline } from '@/components/document-request/WorkflowBadge'
import MotifModal from '@/components/document-request/MotifModal'
import DossierFiles from '@/components/document-request/DossierFiles'

const TABS = [
  { key: 'pending',                  label: 'Nouvelles',       color: '#f59e0b', bg: '#fffbeb', icon: '📥' },
  { key: 'secretaire_review',        label: 'En cours',        color: '#3b82f6', bg: '#eff6ff', icon: '📋' },
  { key: 'chef_division_review',     label: 'Chef Division',   color: '#8b5cf6', bg: '#f5f3ff', icon: '👤' },
  { key: 'comptable_review',         label: 'Comptabilité',    color: '#06b6d4', bg: '#ecfeff', icon: '💰' },
  { key: 'chef_cap_review',          label: 'Chef CAP',        color: '#0ea5e9', bg: '#f0f9ff', icon: '✍️' },
  { key: 'directeur_adjoint_review', label: 'Dir. Adjoint',   color: '#7c3aed', bg: '#f5f3ff', icon: '📝' },
  { key: 'directeur_review',         label: 'Directeur',       color: '#dc2626', bg: '#fef2f2', icon: '🖊️' },
  { key: 'ready',                    label: 'Prêts',           color: '#10b981', bg: '#ecfdf5', icon: '✅' },
  { key: 'secretaire_correction',    label: 'À corriger',      color: '#ef4444', bg: '#fef2f2', icon: '⚠️' },
  { key: 'delivered',                label: 'Archivés',        color: '#6b7280', bg: '#f9fafb', icon: '📦' },
  { key: 'rejected',                 label: 'Rejetés',         color: '#1f2937', bg: '#f3f4f6', icon: '🚫' },
]

// ─── Modal choix chef division ────────────────────────────────────────────────
const ChefDivisionModal = ({
  visible, onClose, onConfirm,
}: {
  visible: boolean
  onClose: () => void
  onConfirm: (type: ChefDivisionType) => void
}) => (
  <CModal visible={visible} onClose={onClose} alignment="center">
    <CModalHeader><CModalTitle>Choisir le Chef Division</CModalTitle></CModalHeader>
    <CModalBody>
      <p className="text-muted small mb-3">Sélectionnez le chef de division concerné par ce dossier.</p>
      <div className="d-flex gap-3">
        {(['formation_distance', 'formation_continue'] as ChefDivisionType[]).map(type => (
          <CButton key={type} color="primary" variant="outline"
            className="flex-fill py-3 fw-bold" onClick={() => onConfirm(type)}>
            {CHEF_DIVISION_LABELS[type]}
          </CButton>
        ))}
      </div>
    </CModalBody>
    <CModalFooter><CButton color="secondary" onClick={onClose}>Annuler</CButton></CModalFooter>
  </CModal>
)

// ─── Modal renvoi depuis secretaire_correction (vers tout le monde) ───────────
const ResendModal = ({
  demande, visible, onClose, onConfirm,
}: {
  demande: DocumentRequest | null
  visible: boolean
  onClose: () => void
  onConfirm: (resendTo: string, chefDivType?: ChefDivisionType) => void
}) => {
  const [resendTo, setResendTo] = useState('')
  const [chefDivType, setChefDivType] = useState<ChefDivisionType>('formation_distance')

  if (!demande) return null

  return (
    <CModal visible={visible} onClose={onClose} alignment="center">
      <CModalHeader><CModalTitle>Renvoyer le dossier</CModalTitle></CModalHeader>
      <CModalBody>
        {demande.rejected_by && (
          <CAlert color="danger" className="py-2 mb-3 small">
            <strong>Rejeté par :</strong> {demande.rejected_by}<br />
            {demande.rejected_reason && <><strong>Motif :</strong> {demande.rejected_reason}</>}
            {demande.chef_division_comment && !demande.rejected_by?.includes('Division') && (
              <><br /><strong>Commentaire :</strong> {demande.chef_division_comment}</>
            )}
          </CAlert>
        )}
        <p className="fw-semibold small mb-2">Renvoyer à quel niveau ?</p>
        <div className="d-flex flex-column gap-2 mb-3">
          {RESEND_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => setResendTo(opt.value)}
              style={{
                border: `2px solid ${resendTo === opt.value ? '#3b82f6' : '#e5e7eb'}`,
                background: resendTo === opt.value ? '#eff6ff' : 'white',
                borderRadius: 6, padding: '10px 14px', cursor: 'pointer',
                textAlign: 'left', fontWeight: resendTo === opt.value ? 600 : 400,
                color: resendTo === opt.value ? '#1d4ed8' : '#374151',
              }}>
              {resendTo === opt.value ? '● ' : '○ '}{opt.label}
            </button>
          ))}
        </div>
        {resendTo === 'chef_division' && (
          <div>
            <p className="fw-semibold small mb-2">Quel chef division ?</p>
            <div className="d-flex gap-2">
              {(['formation_distance', 'formation_continue'] as ChefDivisionType[]).map(t => (
                <CButton key={t} size="sm" color={chefDivType === t ? 'primary' : 'light'}
                  onClick={() => setChefDivType(t)}>
                  {CHEF_DIVISION_LABELS[t]}
                </CButton>
              ))}
            </div>
          </div>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>Annuler</CButton>
        <CButton color="primary"
          onClick={() => resendTo && onConfirm(resendTo, resendTo === 'chef_division' ? chefDivType : undefined)}
          disabled={!resendTo}>
          Renvoyer
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

// ─── Modal de détail ──────────────────────────────────────────────────────────
const DetailModal = ({
  demande, visible, onClose, onAction,
}: {
  demande: DocumentRequest | null
  visible: boolean
  onClose: () => void
  onAction: (action: string, extra?: Record<string, any>) => Promise<void>
}) => {
  const [actionLoading, setActionLoading] = useState(false)
  const [chefDivModal, setChefDivModal] = useState(false)
  const [resendModal, setResendModal] = useState(false)
  const [rejectModal, setRejectModal] = useState(false)
  const [rejectFinalModal, setRejectFinalModal] = useState(false)

  if (!demande) return null
  const s = demande.status

  const runAction = async (action: string, extra?: Record<string, any>) => {
    setActionLoading(true)
    try { await onAction(action, extra) }
    catch (e) { console.error('Action failed:', e) }
    finally { setActionLoading(false) }
  }

  return (
    <>
      <CModal visible={visible} onClose={onClose} size="lg" alignment="center" scrollable>
        <CModalHeader className="border-bottom">
          <CModalTitle className="d-flex align-items-center gap-2 flex-wrap">
            <span>Demande</span>
            <code className="text-muted" style={{ fontSize: '0.85rem' }}>#{demande.reference}</code>
            <WorkflowBadge status={demande.status} size="sm" />
            {demande.chef_division_type && (
              <CBadge color="info" style={{ fontSize: '0.7rem' }}>
                {CHEF_DIVISION_LABELS[demande.chef_division_type]}
              </CBadge>
            )}
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          <WorkflowTimeline
            currentStatus={demande.status}
            isRejected={s === 'rejected' || s === 'secretaire_correction'}
          />

          <CRow className="mt-3 g-2">
            <CCol md={6}>
              <div className="border rounded p-3 h-100" style={{ background: '#f8fafc' }}>
                <p className="fw-semibold mb-2 text-uppercase small text-muted">Étudiant</p>
                <p className="fw-bold mb-1">{demande.last_name} {demande.first_names}</p>
                <p className="small text-muted mb-1">Matricule : {demande.matricule || '—'}</p>
                <p className="small text-muted mb-1">Filière : {demande.department || '—'}</p>
                <p className="small text-muted mb-0">Année : {demande.academic_year || '—'}</p>
              </div>
            </CCol>
            <CCol md={6}>
              <div className="border rounded p-3 h-100" style={{ background: '#f8fafc' }}>
                <p className="fw-semibold mb-2 text-uppercase small text-muted">Demande</p>
                <p className="fw-bold mb-1">{TYPE_LABELS[demande.type] ?? demande.type}</p>
                <p className="small text-muted mb-0">
                  Soumis le : {demande.submitted_at
                    ? new Date(demande.submitted_at).toLocaleDateString('fr-FR') : '—'}
                </p>
              </div>
            </CCol>
          </CRow>

          <div className="mt-3">
            <p className="fw-semibold small text-muted text-uppercase mb-2">Pièces jointes</p>
            <DossierFiles files={demande.files} />
          </div>

          {demande.chef_division_comment && (
            <CAlert color="warning" className="mt-3 py-2 small mb-0">
              <strong>Chef Division :</strong> {demande.chef_division_comment}
            </CAlert>
          )}
          {demande.comptable_comment && (
            <CAlert color="info" className="mt-2 py-2 small mb-0">
              <strong>Comptable :</strong> {demande.comptable_comment}
            </CAlert>
          )}
          {s === 'secretaire_correction' && (demande.rejected_by || demande.rejected_reason) && (
            <CAlert color="danger" className="mt-2 py-2 small mb-0">
              <CIcon icon={cilWarning} className="me-1" />
              {demande.rejected_by && <><strong>Rejeté par {demande.rejected_by} :</strong> </>}
              {demande.rejected_reason}
            </CAlert>
          )}
        </CModalBody>

        <CModalFooter className="flex-wrap gap-2" style={{ background: '#f8fafc' }}>
          <CButton color="secondary" variant="ghost" onClick={onClose} disabled={actionLoading}>
            Fermer
          </CButton>

          {/* Nouvelle → prendre en charge */}
          {s === 'pending' && (
            <CButton color="success" onClick={() => runAction('secretaire_accept')} disabled={actionLoading}>
              {actionLoading ? <CSpinner size="sm" /> : <><CIcon icon={cilCheckAlt} className="me-1" />Prendre en charge</>}
            </CButton>
          )}

          {/* En cours → envoyer chef division ou rejeter */}
          {s === 'secretaire_review' && (
            <>
              <CButton color="danger" variant="outline" onClick={() => setRejectModal(true)} disabled={actionLoading}>
                <CIcon icon={cilX} className="me-1" />Rejeter
              </CButton>
              <CButton color="primary" onClick={() => setChefDivModal(true)} disabled={actionLoading}>
                <CIcon icon={cilSend} className="me-1" />Envoyer au Chef Division
              </CButton>
            </>
          )}

          {/* secretaire_correction → renvoyer à n'importe qui ou rejeter définitivement */}
          {s === 'secretaire_correction' && (
            <>
              <CButton color="danger" onClick={() => setRejectFinalModal(true)} disabled={actionLoading}>
                <CIcon icon={cilX} className="me-1" />Rejeter définitivement
              </CButton>
              <CButton color="primary" onClick={() => setResendModal(true)} disabled={actionLoading}>
                <CIcon icon={cilReload} className="me-1" />Renvoyer
              </CButton>
            </>
          )}

          {/* Prêt → marquer retiré */}
          {s === 'ready' && (
            <CButton color="success" onClick={() => runAction('secretaire_deliver')} disabled={actionLoading}>
              {actionLoading ? <CSpinner size="sm" /> : <><CIcon icon={cilCheckAlt} className="me-1" />Marquer comme retiré</>}
            </CButton>
          )}
        </CModalFooter>
      </CModal>

      <ChefDivisionModal
        visible={chefDivModal}
        onClose={() => setChefDivModal(false)}
        onConfirm={(type) => {
          setChefDivModal(false)
          runAction('secretaire_send_chef_division', { chef_division_type: type })
        }}
      />

      <ResendModal
        demande={demande}
        visible={resendModal}
        onClose={() => setResendModal(false)}
        onConfirm={(resendTo, chefDivType) => {
          setResendModal(false)
          runAction('secretaire_resend', { resend_to: resendTo, chef_division_type: chefDivType })
        }}
      />

      <MotifModal
        visible={rejectModal}
        title="Rejeter la demande"
        confirmLabel="Rejeter"
        confirmColor="danger"
        onClose={() => setRejectModal(false)}
        onConfirm={async (motif) => {
          setRejectModal(false)
          await runAction('secretaire_reject', { motif })
        }}
      />

      <MotifModal
        visible={rejectFinalModal}
        title="Rejeter définitivement"
        confirmLabel="Rejeter définitivement"
        confirmColor="danger"
        onClose={() => setRejectFinalModal(false)}
        onConfirm={async (motif) => {
          setRejectFinalModal(false)
          await runAction('secretaire_reject_final', { motif })
        }}
      />
    </>
  )
}

// ─── Vue principale ───────────────────────────────────────────────────────────
const SecretaireDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'pending'

  const [demandes, setDemandes]     = useState<DocumentRequest[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [selected, setSelected]     = useState<DocumentRequest | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await documentRequestService.getAll({ search, type: typeFilter })
      setDemandes(res.data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [search, typeFilter])

  useEffect(() => { load() }, [load])

  const switchTab = (key: string) => setSearchParams({ tab: key })
  const filtered = demandes.filter(d => d.status === activeTab)
  const counts = TABS.reduce((acc, tab) => {
    acc[tab.key] = demandes.filter(d => d.status === tab.key).length
    return acc
  }, {} as Record<string, number>)

  const handleAction = async (action: string, extra?: Record<string, any>) => {
    if (!selected) return
    await documentRequestService.transition(selected.id, { action, ...extra })
    setDetailOpen(false)
    setSelected(null)
    await load()
  }

  return (
    <div>
      <CRow className="mb-4 g-3">
        {[
          { key: 'pending',               label: 'Nouvelles demandes', color: '#f59e0b', bg: '#fffbeb' },
          { key: 'secretaire_correction', label: 'À corriger',         color: '#ef4444', bg: '#fef2f2' },
          { key: 'ready',                 label: 'Prêts à retirer',   color: '#10b981', bg: '#ecfdf5' },
          { key: 'delivered',             label: 'Archivés',          color: '#6b7280', bg: '#f9fafb' },
        ].map(s => (
          <CCol key={s.key} md={3} sm={6}>
            <div onClick={() => switchTab(s.key)}
              style={{
                background: s.bg, borderLeft: `4px solid ${s.color}`,
                borderRadius: 8, padding: '12px 16px', cursor: 'pointer',
                border: `1px solid ${s.color}22`, borderLeftWidth: 4, borderLeftColor: s.color,
                transition: 'transform 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
              <div className="text-muted small mb-1">{s.label}</div>
              <div className="fw-bold" style={{ fontSize: '2rem', color: s.color, lineHeight: 1 }}>
                {counts[s.key] || 0}
              </div>
            </div>
          </CCol>
        ))}
      </CRow>

      <CCard className="shadow-sm border-0">
        <CCardHeader className="bg-white border-bottom">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <div>
              <strong className="fs-5">Gestion des demandes</strong>
              <div className="text-muted small">Tableau de bord — Secrétariat</div>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <CInputGroup size="sm" style={{ width: 200 }}>
                <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
                <CFormInput placeholder="Référence, nom…" value={search}
                  onChange={e => setSearch(e.target.value)} />
              </CInputGroup>
              <CFormSelect size="sm" style={{ width: 170 }} value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}>
                <option value="">Tous les types</option>
                {Object.entries(TYPE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </CFormSelect>
            </div>
          </div>

          <div className="d-flex gap-1 flex-wrap">
            {TABS.map(tab => {
              const isActive = activeTab === tab.key
              const count = counts[tab.key] || 0
              return (
                <button key={tab.key} onClick={() => switchTab(tab.key)}
                  style={{
                    border: `2px solid ${isActive ? tab.color : '#e5e7eb'}`,
                    background: isActive ? tab.color : 'white',
                    color: isActive ? 'white' : '#374151',
                    borderRadius: 6, padding: '5px 10px',
                    fontSize: '0.75rem', fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                    transition: 'all 0.15s',
                  }}>
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {count > 0 && (
                    <span style={{
                      background: isActive ? 'rgba(255,255,255,0.3)' : '#f3f4f6',
                      color: isActive ? 'white' : '#374151',
                      borderRadius: 10, padding: '0 5px',
                      fontSize: '0.68rem', fontWeight: 700,
                    }}>{count}</span>
                  )}
                </button>
              )
            })}
          </div>
        </CCardHeader>

        <CCardBody className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <div className="text-muted small mt-2">Chargement…</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <CIcon icon={cilInbox} size="3xl" className="mb-2 d-block mx-auto opacity-25" />
              <div className="fw-semibold">Aucune demande dans cette catégorie</div>
            </div>
          ) : (
            <CTable hover responsive className="align-middle mb-0">
              <CTableHead style={{ background: '#f8fafc', fontSize: '0.8rem' }}>
                <CTableRow>
                  <CTableHeaderCell>Référence</CTableHeaderCell>
                  <CTableHeaderCell>Étudiant</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Statut</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                  <CTableHeaderCell style={{ width: 50 }}></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filtered.map(d => (
                  <CTableRow key={d.id} style={{ cursor: 'pointer' }}
                    onClick={() => { setSelected(d); setDetailOpen(true) }}>
                    <CTableDataCell>
                      <code className="text-primary" style={{ fontSize: '0.82rem' }}>{d.reference}</code>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>
                        {d.last_name} {d.first_names}
                      </div>
                      <small className="text-muted">{d.matricule || '—'} · {d.department || '—'}</small>
                    </CTableDataCell>
                    <CTableDataCell><small>{TYPE_LABELS[d.type] ?? d.type}</small></CTableDataCell>
                    <CTableDataCell>
                      <small className="text-muted">
                        {d.submitted_at ? new Date(d.submitted_at).toLocaleDateString('fr-FR') : '—'}
                      </small>
                    </CTableDataCell>
                    <CTableDataCell>
                      <WorkflowBadge status={d.status} size="sm" />
                      {d.chef_division_type && (
                        <div className="mt-1">
                          <CBadge color="light" textColor="dark" style={{ fontSize: '0.62rem' }}>
                            {CHEF_DIVISION_LABELS[d.chef_division_type]}
                          </CBadge>
                        </div>
                      )}
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

export default SecretaireDashboard
