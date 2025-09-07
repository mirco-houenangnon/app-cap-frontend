import React, { Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import routes from '../routes'

const AppContent = ({ children }) => {
  const location = useLocation()
  const modulePrefixes = [
    '/inscription',
    '/attestation',
    '/note',
    '/rh',
    '/soutenance',
    '/emploi',
    '/cahier',
    '/presence',
    '/finance',
    '/bibliotheque',
  ]
  const isModuleRoute = modulePrefixes.some((prefix) => location.pathname.startsWith(prefix))

  return (
    <CContainer style={{ maxWidth: '1600px' }}>
      <Suspense fallback={<CSpinner color="primary" />}>
        {isModuleRoute ? (
          children
        ) : (
          <Routes>
            {routes.map((route, idx) => {
              return (
                route.element && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    element={<route.element />}
                  />
                )
              )
            })}
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        )}
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
