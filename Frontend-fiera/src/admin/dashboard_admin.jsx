import PanelProducts from './panel_products/panel_products';
import { FaSignOutAlt } from 'react-icons/fa';
const DashboardAdmin = ({ onLogout }) => {

    return (
        <>
            <PanelProducts onLogout={onLogout} />;
        </>
    )
};

export default DashboardAdmin;
