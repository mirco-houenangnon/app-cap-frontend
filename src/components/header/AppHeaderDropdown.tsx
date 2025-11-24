import {
  CAvatar,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilAccountLogout, cilUser } from '@coreui/icons'
import { getAssetUrl } from '@/utils/assets'
import { useAuth } from '@/contexts/AuthContext'

const AppHeaderDropdown = () => {
  const { logout, nom, prenoms } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <CDropdown variant="nav-item" placement="bottom-end">
      <CDropdownToggle className="py-0 pe-0" caret={false}>
        <CAvatar src={getAssetUrl('images/cap.png')} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0">
        <CDropdownItem className="bg-body-secondary fw-semibold mb-2" style={{fontWeight: 'bold'}}>
          {nom && prenoms ? `${nom} ${prenoms}` : 'Mon compte'}
        </CDropdownItem>
        <CDropdownItem href="#/profile">
          <CIcon icon={cilUser} className="me-2" />
          Profil
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Déconnexion
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
