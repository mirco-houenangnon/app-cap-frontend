// src/components/document-request/index.ts
export { WorkflowBadge, WorkflowTimeline } from './WorkflowBadge'
export { default as MotifModal }            from './MotifModal'
export { default as DossierFiles }          from './DossierFiles'

// src/hooks/attestation/index.ts — ajouter à l'export existant :
// export { default as useDocumentRequests } from './useDocumentRequests'

// src/views/pages/attestation/workflow/index.ts
export { default as WorkflowRouter }          from './WorkflowRouter'
export { default as SecretaireDashboard }      from './SecretaireDashboard'
export { default as ChefDivisionDashboard }    from './ChefDivisionDashboard'
export { default as ComptableDashboard }       from './ComptableDashboard'
export { default as ChefCapDashboard }         from './ChefCapDashboard'
export { default as DirecteurDashboard }       from './DirecteurDashboard'
