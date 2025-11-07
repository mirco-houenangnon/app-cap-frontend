import React from 'react'
import { CCard, CCardHeader, CCardBody, CCol } from '@coreui/react'
import { CChart } from '@coreui/react-chartjs'

interface ChartCardProps {
  title: string
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea'
  data: any
  options?: any
  height?: string
  xs?: number
  md?: number
  lg?: number
}

/**
 * ChartCard - Carte avec graphique intégré
 */
const ChartCard: React.FC<ChartCardProps> = ({
  title,
  type,
  data,
  options,
  height = '500px',
  xs = 12,
  md,
  lg,
}) => {
  return (
    <CCol xs={xs} md={md} lg={lg}>
      <CCard>
        <CCardHeader>{title}</CCardHeader>
        <CCardBody>
          <CChart type={type} data={data} options={options} style={{ height }} />
        </CCardBody>
      </CCard>
    </CCol>
  )
}

export default ChartCard
