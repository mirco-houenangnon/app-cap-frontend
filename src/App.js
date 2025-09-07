import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
import ProtectedRoute from './protected/ProtectedRoutes'
import { AuthContextProvider } from '../src/context/index'

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Portail = React.lazy(() => import('./views/pages/portail/Portail'))
const InscriptionRoutes = React.lazy(() => import('./views/pages/inscription/InscriptionRoutes'))
const AttestationRoutes = React.lazy(() => import('./views/pages/attestation/AttestationRoutes'))
const NoteRoutes = React.lazy(() => import('./views/pages/notes/NoteRoutes'))
const RhRoutes = React.lazy(() => import('./views/pages/rh/RhRoutes'))
const CoursRoutes = React.lazy(() => import('./views/pages/cours/CoursRoutes'))
const SoutenanceRoutes = React.lazy(() => import('./views/pages/soutenance/SoutenanceRoutes'))
const EmploiRoutes = React.lazy(() => import('./views/pages/emploi-du-temps/EmploiRoutes'))
const CahierRoutes = React.lazy(() => import('./views/pages/cahier-texte/CahierRoutes'))
const PresenceRoutes = React.lazy(() => import('./views/pages/presence/PresenceRoutes'))
const FinanceRoutes = React.lazy(() => import('./views/pages/finance/FinanceRoutes'))
const BibliothequeRoutes = React.lazy(() => import('./views/pages/bibliotheque/BibliothequeRoutes'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <AuthContextProvider>
        <Suspense
          fallback={
            <div className="pt-3 text-center">
              <CSpinner color="primary" variant="grow" />
            </div>
          }
        >
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route
              exact
              path="/portail"
              name="Portail Page"
              element={
                <ProtectedRoute module="portail">
                  <Portail />
                </ProtectedRoute>
              }
            />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />

            <Route
              path="/inscription/*"
              element={
                <ProtectedRoute module="inscription">
                  <DefaultLayout>
                    <InscriptionRoutes />
                  </DefaultLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/attestation/*"
              element={
                <ProtectedRoute module="attestation">
                  <DefaultLayout>
                    <AttestationRoutes />
                  </DefaultLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes/*"
              element={
                <ProtectedRoute module="notes">
                  <DefaultLayout>
                    <NoteRoutes />
                  </DefaultLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cours/*"
              element={
                <ProtectedRoute module="cours">
                  <DefaultLayout>
                    <CoursRoutes />
                  </DefaultLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/rh/*"
              element={
                <ProtectedRoute module="rh">
                  <DefaultLayout>
                    <RhRoutes />
                  </DefaultLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/soutenance/*"
              element={
                <ProtectedRoute module="soutenance">
                  <DefaultLayout>
                    <SoutenanceRoutes />
                  </DefaultLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/emploi/*"
              element={
                <ProtectedRoute module="emploi">
                  <DefaultLayout>
                    <EmploiRoutes />
                  </DefaultLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cahier/*"
              element={
                <ProtectedRoute module="cahier">
                  <DefaultLayout>
                    <CahierRoutes />
                  </DefaultLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/presence/*"
              element={
                <ProtectedRoute module="presence">
                  <DefaultLayout>
                    <PresenceRoutes />
                  </DefaultLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/finance/*"
              element={
                <ProtectedRoute module="finance">
                  <DefaultLayout>
                    <FinanceRoutes />
                  </DefaultLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/bibliotheque/*"
              element={
                <ProtectedRoute module="bibliotheque">
                  <DefaultLayout>
                    <BibliothequeRoutes />
                  </DefaultLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/portail" replace />} />
          </Routes>
        </Suspense>
      </AuthContextProvider>
    </HashRouter>
  )
}

export default App
