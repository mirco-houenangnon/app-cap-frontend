import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
  CNavItem
} from '@coreui/react'
import { cilHome } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'
import {
  mainNavigation,
  emploiNavigation,
  inscriptionNavigation,
  attestationNavigation,
  noteNavigation,
  rhNavigation,
  soutenanceNavigation,
  coursNavigation,
  bibliothequeNavigation,
  financeNavigation,
  presenceNavigation,
  cahierNavigation,
} from '../_nav/index'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const getNavigationForPath = () => {
    const path = location.pathname

    if (path.startsWith('/inscription')) return inscriptionNavigation
    if (path.startsWith('/attestation')) return attestationNavigation
    if (path.startsWith('/notes')) return noteNavigation
    if (path.startsWith('/rh')) return rhNavigation
    if (path.startsWith('/soutenance')) return soutenanceNavigation
    if (path.startsWith('/emploi')) return emploiNavigation
    if (path.startsWith('/cahier')) return cahierNavigation
    if (path.startsWith('/presence')) return presenceNavigation
    if (path.startsWith('/finance')) return financeNavigation
    if (path.startsWith('/bibliotheque')) return bibliothequeNavigation
    if (path.startsWith('/cours')) return coursNavigation

    return mainNavigation
  }

  const currentNavigation = getNavigationForPath()
  const isModule =
    location.pathname !== '/' &&
    !location.pathname.startsWith('/dashboard') &&
    !location.pathname.startsWith('/portail') &&
    location.pathname !== '/login' &&
    location.pathname !== '/register' &&
    location.pathname !== '/404' &&
    location.pathname !== '/500'

  const navigationWithHomeLink = isModule
    ? [
        ...currentNavigation,
        {
          component: CNavItem,
          name: 'Retour au Portail',
          to: '/portail',
          icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
        },
      ]
    : currentNavigation

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigationWithHomeLink} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
