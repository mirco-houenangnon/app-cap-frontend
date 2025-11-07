import React from 'react'
import { Link } from 'react-router-dom'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'

interface Column {
  key: string
  label: string
  align?: 'start' | 'center' | 'end'
  render?: (value: any, item: any) => React.ReactNode
}

interface DashboardTableProps {
  title: string
  columns: Column[]
  data: any[]
  limit?: number
  linkTo?: string
  linkText?: string
}

/**
 * DashboardTable - Tableau réutilisable pour le dashboard
 */
const DashboardTable: React.FC<DashboardTableProps> = ({
  title,
  columns,
  data,
  limit = 5,
  linkTo,
  linkText = 'Voir plus',
}) => {
  const displayData = data.slice(0, limit)

  return (
    <CCard className="mb-4 shadow-sm">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <span>{title}</span>
        {linkTo && (
          <Link to={linkTo}>
            <CButton color="primary" size="sm" variant="outline">
              {linkText}
            </CButton>
          </Link>
        )}
      </CCardHeader>
      <CCardBody>
        <CTable align="middle" bordered responsive>
          <CTableHead className="text-nowrap table-light">
            <CTableRow>
              <CTableHeaderCell>N°</CTableHeaderCell>
              {columns.map((col, index) => (
                <CTableHeaderCell
                  key={index}
                  className={col.align ? `text-${col.align}` : 'text-center'}
                >
                  {col.label}
                </CTableHeaderCell>
              ))}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {displayData.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={columns.length + 1} className="text-center">
                  Aucune donnée disponible
                </CTableDataCell>
              </CTableRow>
            ) : (
              displayData.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  {columns.map((col, colIndex) => (
                    <CTableDataCell
                      key={colIndex}
                      className={col.align ? `text-${col.align}` : 'text-center'}
                    >
                      {col.render ? col.render(item[col.key], item) : item[col.key] || 'N/A'}
                    </CTableDataCell>
                  ))}
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default DashboardTable
