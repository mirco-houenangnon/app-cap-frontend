// src/views/pages/demandes/DemandesRoutes.tsx
// Point d'entrée du module "Gestion des demandes" accessible depuis le portail
// via les cartes "CAP Demandes d'Attestations" (/demandes-attestations)
// et "CAP Demandes de bulletin" (/demandes-bulletin)

import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LoadingSpinner } from '@/components'

const WorkflowRouter = React.lazy(() => import('../attestation/workflow/WorkflowRouter'))

const DemandesRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner fullPage message="Chargement du module Demandes..." />}>
      <Routes>
        {/* Dashboard principal (WorkflowRouter adapte l'affichage selon le rôle) */}
        <Route path="/"           element={<WorkflowRouter />} />
        <Route path="/dashboard"  element={<WorkflowRouter />} />
        <Route path="*"           element={<Navigate to="/demandes" replace />} />
      </Routes>
    </Suspense>
  )
}

export default DemandesRoutes
