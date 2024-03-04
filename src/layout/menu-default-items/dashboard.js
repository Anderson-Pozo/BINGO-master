// assets
import { IconDashboard, IconUsers, IconFriends, IconShare, IconBuilding, IconNetwork, IconMoneybag } from '@tabler/icons';

// constant
const icons = { IconDashboard, IconUsers, IconFriends, IconShare, IconBuilding, IconNetwork, IconMoneybag };

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
      url: '/app/dashboard',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'business',
      title: 'Negocios',
      type: 'item',
      url: '/app/business',
      icon: icons.IconBuilding
    },
    {
      id: 'network',
      title: 'Red de Negocios',
      type: 'item',
      url: '/app/network',
      icon: icons.IconNetwork
    },
    {
      id: 'benefits',
      title: 'Beneficios',
      type: 'item',
      url: '/app/benefits',
      icon: icons.IconMoneybag
    },
    {
      id: 'share',
      title: 'Compartir',
      type: 'item',
      url: '/app/share',
      icon: icons.IconShare
    }
  ]
};

export default dashboard;
