// project imports
import Header from 'components/landing/Header';
import hero from 'assets/images/bg/hero.jpg';
import about from 'assets/images/bg/about.jpg';
import contacts from 'assets/images/bg/contacts.jpg';
import { CssBaseline } from '@mui/material';
import About from 'components/landing/About';
import Contacts from 'components/landing/Contacts';
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
    <div
      style={{
        backgroundImage: `url(${about})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        margin: 0,
        padding: 0
      }}
    >
      <About />
    </div>
    <div
      style={{
        backgroundImage: `url(${contacts})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        margin: 0,
        padding: 0
      }}
    >
      <Contacts />
    </div>
    <Footer />
  </div>
);

export default HomeLayout;
