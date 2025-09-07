import React from 'react'
import Select from 'react-select'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { CChart } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilUser, cilFolderOpen, cilSchool, cilLayers } from '@coreui/icons'

import useDashboardData from '../../../hooks/inscription/useDashboardData'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const {
    stats,
    academicYears,
    pendingStudents,
    graphesData,
    selectedYear,
    setSelectedYear,
    loading,
  } = useDashboardData()

  if (loading) {
    return <div>Chargement des données...</div>
  }

  const chartData = {
    labels: graphesData.inscritsParFiliere.map((item) => item.filiere),
    datasets: [
      {
        label: "Nombre d'inscrits",
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        data: graphesData.inscritsParFiliere.map((item) => item.count),
      },
    ],
  }

  const yearOptions = academicYears.map((year) => ({
    value: year.annee,
    label: year.annee,
  }))

  return (
    <>
      {/* Cards dynamiques en haut */}
      <CRow className="mb-4">
        <CCol xs={12} sm={6} lg={3}>
          <CCard className="shadow-sm border-0 text-white bg-success">
            <CCardBody className="d-flex align-items-center justify-content-between">
              <div>
                <div className="fs-3 fw-bold">{stats.inscritsCap}</div>
                <div>Inscrits au CAP</div>
              </div>
              <CIcon icon={cilUser} size="xxl" />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CCard className="shadow-sm border-0 text-white bg-info">
            <CCardBody className="d-flex align-items-center justify-content-between">
              <div>
                <div className="fs-3 fw-bold">{stats.dossiersAttente}</div>
                <div>Dossiers en Attente</div>
              </div>
              <CIcon icon={cilFolderOpen} size="xxl" />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CCard className="shadow-sm border-0 text-white bg-warning">
            <CCardBody className="d-flex align-items-center justify-content-between">
              <div>
                <div className="fs-3 fw-bold">{stats.anneeAcademique}</div>
                <div>Année Académique</div>
              </div>
              <CIcon icon={cilSchool} size="xxl" />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CCard className="shadow-sm border-0 text-white bg-danger">
            <CCardBody className="d-flex align-items-center justify-content-between">
              <div>
                <div className="fs-3 fw-bold">{stats.nombreFilieres}</div>
                <div>Nombre de Filières</div>
              </div>
              <CIcon icon={cilLayers} size="xxl" />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Combobox avec recherche */}
      <CRow className="mb-3">
        <CCol xs={12} md={4}>
          <label className="form-label fw-semibold">Filtrer par Année Académique</label>
          <Select
            options={yearOptions}
            value={yearOptions.find((opt) => opt.value === selectedYear)}
            onChange={(option) => setSelectedYear(option.value)}
            placeholder="Sélectionner une année..."
            isSearchable
          />
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol xs={12} md={6}>
          <CCard>
            <CCardHeader>Nombre d'inscrits par Filière ({selectedYear})</CCardHeader>
            <CCardBody>
              <CChart type="bar" data={chartData} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={6}>
          <CCard>
            <CCardHeader>Graphe Second (à venir)</CCardHeader>
            <CCardBody>
              <div className="text-center text-muted">Contenu à ajouter plus tard.</div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Premier tableau : Années Académiques */}
      <CCard className="mb-4 shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <span>Années Académiques</span>
          <Link to="/inscription/academics-years">
            <CButton color="primary" size="sm" variant="outline">
              Voir plus
            </CButton>
          </Link>
        </CCardHeader>
        <CCardBody>
          <CTable align="middle" bordered responsive>
            <CTableHead className="text-nowrap table-light">
              <CTableRow>
                <CTableHeaderCell>N°</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Année Académique</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Début</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Fin</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Périodes de Dépôt</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {academicYears.slice(0, 5).map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.annee}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.debut}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.fin}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.periodesDepot}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      <CCard className="mb-4 shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <span>Étudiants en Attente</span>
          <Link to="/inscription/pending-students">
            <CButton color="primary" size="sm" variant="outline">
              Voir plus
            </CButton>
          </Link>
        </CCardHeader>
        <CCardBody>
          <CTable align="middle" bordered responsive>
            <CTableHead className="text-nowrap table-light">
              <CTableRow>
                <CTableHeaderCell>N°</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Nom et Prénoms</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Filière</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Date de Dépôt</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Sexe</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {pendingStudents.slice(0, 5).map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.nomPrenoms}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.filiere}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.dateDepot}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.sexe}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard
