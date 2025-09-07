import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { CSpinner } from '@coreui/react'

import { Dashboard, PendingStudents, AnneeAcademiques, StudentsList } from './index'

const InscriptionRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="pt-3 text-center">
          <CSpinner color="primary" variant="grow" />
        </div>
      }
    >
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pending-students" element={<PendingStudents />} />
        <Route path="/academics-years" element={<AnneeAcademiques />} />
        <Route path="/students-list" element={<StudentsList />} />
        {/* 
        
         */}
        {/* Rediriger /inscription vers /inscription/dashboard par défaut */}
        <Route path="/" element={<Navigate to="/inscription/dashboard" replace />} />
        {/* Route 404 pour les sous-routes invalides */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  )
}

export default InscriptionRoutes
