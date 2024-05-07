// assets
import {
  IconDashboard,
  IconUsers,
  IconFriends,
  IconBell,
  IconShare,
  IconBuilding,
  IconNetwork,
  IconMoneybag,
  IconGoGame,
  IconCardboards,
  IconNotebook,
  IconDeviceGamepad
} from '@tabler/icons';

// constant
const icons = {
  IconCardboards,
  IconDashboard,
  IconUsers,
  IconFriends,
  IconBell,
  IconShare,
  IconBuilding,
  IconNetwork,
  IconMoneybag,
  IconGoGame,
  IconNotebook,
  IconDeviceGamepad
};

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
      id: 'game',
      title: 'Play BINGO',
      type: 'item',
      url: '/main/game',
      icon: icons.IconGoGame,
      breadcrumbs: false
    },
    {
      id: 'new-game',
      title: 'Crear Evento',
      type: 'item',
      url: '/main/new-game',
      icon: icons.IconDeviceGamepad,
      breadcrumbs: false
    },
    {
      id: 'cards',
      title: 'Generador de Cartas',
      type: 'item',
      url: '/main/card-game',
      icon: icons.IconCardboards,
      breadcrumbs: false
    },
    {
      id: 'cards-user',
      title: 'Asignar Cartillas',
      type: 'item',
      url: '/main/cards-user',
      icon: icons.IconNotebook,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
