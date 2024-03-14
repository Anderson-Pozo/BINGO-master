// assets
import { IconDashboard } from '@tabler/icons';
// constant
const icons = { IconDashboard };

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
      icon: icons.IconDashboard
    }
  ]
};

export default dashboard;
