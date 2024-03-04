import { Outlet } from 'react-router-dom';
import Header from './Header';

const SearchLayout = () => {
  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.2)',
        margin: 0,
        padding: 0,
        height: '100vh'
      }}
    >
      <Header />
      <div style={{ marginTop: 75 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default SearchLayout;
