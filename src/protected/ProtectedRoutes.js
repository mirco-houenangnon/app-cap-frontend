import { useContext, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from "../context/index"
import { useNavigate } from "react-router-dom";
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react';

const rolePermissions = {
  'chef_cap': {
  },
  'secretaire': {
    bibliotheque: false,
    cahier: false,
    cours: false,
    emploi: false,
    notes: false,
    presence: false,
    finance: false
  },
  'chef_division': {
    finance: false,
    rh: false
  },
  'comptable': {
    attestation: false,
    bibliotheque: false,
    cahier: false,
    cours: false,
    emploi: false,
    inscription: false,
    notes: false,
    presence: false,
    soutenance: false
  }
};

const isAllowed = (role, module) => {
  if (!role) return false;
  const perms = rolePermissions[role] || {};
  return perms[module] !== false; 
};

const ProtectedRoute = ({ children, module }) => {
  const { isAuthenticated, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (module && !isAllowed(role, module)) {
    setShowModal(true);
    return (
      <CModal visible={showModal} onClose={() => {
        setShowModal(false);
        navigate('/portail');
      }}>
        <CModalHeader>
          <CModalTitle>Accès non autorisé</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Vous n'avez pas les droits nécessaires pour accéder à ce module ({module}).
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => {
            setShowModal(false);
            navigate('/portail');
          }}>
            Retour au portail
          </CButton>
        </CModalFooter>
      </CModal>
    );
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
