import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = ({ children }) => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1" style={{ width: '100%'}}>
          <AppContent>{children}</AppContent>
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
