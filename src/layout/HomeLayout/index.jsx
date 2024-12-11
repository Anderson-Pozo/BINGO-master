// project imports
import Header from 'components/landing/Header';
import hero from 'assets/images/bg/bg5.jpg';
import { CssBaseline } from '@mui/material';
import Footer from 'components/landing/Footer';

const HomeLayout = () => (
  <div>
    <CssBaseline />
    <div style={{ background: 'rgba(0,0,0,0.9)' }}>
      <div
        style={{
          backgroundImage: `url(${hero})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          margin: 0,
          padding: 0
        }}
      >
        <Header />
      </div>
    </div>
    <Footer />
  </div>
);

export default HomeLayout;
