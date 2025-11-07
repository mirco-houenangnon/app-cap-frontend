import React from 'react'
import { CCard, CCardBody, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'

interface StatsCardProps {
  value: string | number
  label: string
  icon: any
  color: 'success' | 'info' | 'warning' | 'danger' | 'primary' | 'secondary'
  xs?: number
  sm?: number
  lg?: number
}

/**
 * StatsCard - Carte d'affichage de statistique
 */
const StatsCard: React.FC<StatsCardProps> = ({
  value,
  label,
  icon,
  color,
  xs = 12,
  sm = 6,
  lg = 3,
}) => {
  return (
    <CCol xs={xs} sm={sm} lg={lg}>
      <CCard className={`shadow-sm border-0 text-white bg-${color}`}>
        <CCardBody className="d-flex align-items-center justify-content-between">
          <div>
            <div className="fs-3 fw-bold">{value}</div>
            <div>{label}</div>
          </div>
          <CIcon icon={icon} size="xxl" />
        </CCardBody>
      </CCard>
    </CCol>
  )
}

export default StatsCard
