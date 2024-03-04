import { Outlet } from 'react-router-dom';
// project imports
import Social from '../Social';

const MinimalLayout = () => (
  <>
    <Outlet />
    <Social />
  </>
);

export default MinimalLayout;
