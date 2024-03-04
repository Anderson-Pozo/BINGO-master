// assets
import { IconDashboard, IconUsers, IconFriends, IconBell, IconShare, IconBuilding, IconNetwork, IconMoneybag } from '@tabler/icons';

// constant
const icons = { IconDashboard, IconUsers, IconFriends, IconBell, IconShare, IconBuilding, IconNetwork, IconMoneybag };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Panel Principal',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Panel Principal',
      type: 'item',
      url: '/main/dashboard',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'admins',
      title: 'Administradores',
      type: 'item',
      url: '/main/admin-users',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'users',
      title: 'Usuarios',
      type: 'item',
      url: '/main/users',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'benefits',
      title: 'Beneficios',
      type: 'item',
      url: '/main/benefits',
      icon: icons.IconMoneybag
    },
    {
      id: 'business',
      title: 'Negocios',
      type: 'item',
      url: '/main/business',
      icon: icons.IconBuilding
    }
  ]
};

export default dashboard;
