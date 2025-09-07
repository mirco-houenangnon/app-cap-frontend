import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { CSpinner } from '@coreui/react'

// const Dashboard = React.lazy(() => import('./Dashboard'))

const FinanceRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="pt-3 text-center">
          <CSpinner color="primary" variant="grow" />
        </div>
      }
    >
      <Routes>
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/" element={<Navigate to="/finance/dashboard" replace />} />
        {/* Route 404 pour les sous-routes invalides */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  )
}

export default FinanceRoutes
