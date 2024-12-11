import PropTypes from 'prop-types';
// material-ui
import { Typography } from '@mui/material';
// project imports
import NavGroup from './NavGroup';
import menuItem from 'layout/menu-admin-items';

const MenuList = () => {
  const navItems = menuItem.items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

MenuList.propTypes = {
  user: PropTypes.number
};

export default MenuList;
