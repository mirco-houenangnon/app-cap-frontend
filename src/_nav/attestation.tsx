// src/_nav/attestation.tsx (version mise à jour)
// Ajouter l'entrée "Gestion des demandes" pour les rôles concernés.

import CIcon from '@coreui/icons-react'
import {
  cilCheckAlt,
  cilEducation,
  cilNotes,
  cilFile,
  cilDescription,
  cilCreditCard,
  cilTask,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

// Navigation pour les rôles du workflow (secretaire, chef-division, comptable, chef-cap, directeur)
// Ces rôles voient UNIQUEMENT le module workflow dans ce nav.
export const workflowOnlyAttestationNav = [
  {
    component: CNavTitle,
    name: 'Demandes d\'attestation',
  },
  {
    component: CNavItem,
    name: 'Tableau de bord',
    to: '/attestations/demandes',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
  },
]

// Navigation complète pour admin/chef-cap qui ont aussi accès aux générateurs
const attestationNavigation = [
  {
    component: CNavTitle,
    name: 'Attestations',
  },
  {
    component: CNavItem,
    name: 'Attestation de passage',
    to: '/attestations/passage',
    icon: <CIcon icon={cilCheckAlt} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Certificat classes préparatoires',
    to: '/attestations/preparatory',
    icon: <CIcon icon={cilEducation} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Bulletins',
    to: '/attestations/bulletins',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Attestation de Licence',
    to: '/attestations/licence',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Attestation de fin de cycle',
    to: '/attestations/definitive',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Attestation d'inscription",
    to: '/attestations/inscription',
    icon: <CIcon icon={cilCreditCard} customClassName="nav-icon" />,
  },
]

export default attestationNavigation
