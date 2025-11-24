import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LoadingSpinner } from '@/components'
import { useAuth } from '@/contexts'

const ProfessorDashboard = React.lazy(() => import('./ProfessorDashboard'))
const GradeSheet = React.lazy(() => import('./GradeSheet'))
const CreateEvaluation = React.lazy(() => import('./CreateEvaluation'))
const AdminDashboard = React.lazy(() => import('./AdminDashboard'))
const AdminConsultation = React.lazy(() => import('./AdminConsultation'))
const DecisionSemester = React.lazy(() => import('./DecisionSemester'))
const DecisionYear = React.lazy(() => import('./DecisionYear'))

const NoteRoutes = () => {
  const { role } = useAuth()
  
  // Déterminer la route par défaut selon le rôle
  const defaultRoute = (role as any) === 'professeur' 
    ? '/notes/professor/dashboard' 
    : '/notes/admin/dashboard'
  
  return (
    <Suspense fallback={<LoadingSpinner fullPage message="Chargement du module Notes..." />}>
      <Routes>
        {/* Routes Professeur */}
        <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
        <Route path="/professor/grade-sheet/:programId" element={<GradeSheet />} />
        <Route path="/professor/evaluation/:programId" element={<CreateEvaluation />} />
        
        {/* Routes Administration */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/consultation" element={<AdminConsultation />} />
        
        {/* Routes Décisions */}
        <Route path="/decisions/semester" element={<DecisionSemester />} />
        <Route path="/decisions/year" element={<DecisionYear />} />
        
        {/* Redirection par défaut selon le rôle */}
        <Route path="/" element={<Navigate to={defaultRoute} replace />} />
        
        {/* Route 404 pour les sous-routes invalides */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  )
}

export default NoteRoutes
