// src/views/pages/attestation/workflow/WorkflowRouter.tsx
// Point d'entrée unique : affiche le dashboard adapté au rôle connecté.

import { useContext } from 'react'
import { AuthContext } from '@/contexts'
import SecretaireDashboard       from './SecretaireDashboard'
import ChefDivisionDashboard     from './ChefDivisionDashboard'
import ComptableDashboard        from './ComptableDashboard'
import ChefCapDashboard          from './ChefCapDashboard'
import DirecteurDashboard        from './DirecteurDashboard'
import { CAlert } from '@coreui/react'

const WorkflowRouter = () => {
  const auth = useContext(AuthContext)
  const role = auth?.role ?? null

  const roleStr = role as string

switch (roleStr) {
  case 'secretaire':
    return <SecretaireDashboard />
  case 'chef-division':
    return <ChefDivisionDashboard />
  case 'comptable':
    return <ComptableDashboard />
  case 'chef-cap':
    return <ChefCapDashboard />
  case 'directeur-adjoint':
    return <DirecteurDashboard role="directeur-adjoint" />
  case 'directeur':
    return <DirecteurDashboard role="directeur" />
  case 'admin':
    return <SecretaireDashboard />
  default:
    return (
      <CAlert color="warning" className="m-4">
        Ce module n'est pas accessible avec votre rôle.
      </CAlert>
    )
}
}

export default WorkflowRouter
