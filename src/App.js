/* eslint-disable react-hooks/exhaustive-deps */
import React, { lazy, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
// routing
import config from './config';
import themes from 'themes';
// project imports layouts
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import MainLayout from 'layout/MainLayout';
import HomeLayout from 'layout/HomeLayout';
import DefaultLayout from 'layout/DefaultLayout';
import { genConst } from 'store/constant';
//Firebase
import { onAuthStateChanged } from 'firebase/auth';
import { authentication } from 'config/firebase';
import { getProfileUser } from 'config/firebaseEvents';

// Main Portal
const Home = Loadable(lazy(() => import('views/home/Home')));
// Error
const NotFound = Loadable(lazy(() => import('views/pages/error/NotFound')));
// dashboard Admin
const DashboardAdmin = Loadable(lazy(() => import('views/dashboard/Admin')));
// dashboard Profile
const UserProfile = Loadable(lazy(() => import('views/dashboard/Admin/Profile/UserProfile')));
const UserSecurity = Loadable(lazy(() => import('views/dashboard/Admin/Profile/UserSecurity')));
// dashboard Mail
//const Mail = Loadable(lazy(() => import('views/dashboard/Admin/Mail/Mail')));
// dashboard Users
const AdminUsers = Loadable(lazy(() => import('views/dashboard/Admin/AdminUsers/AdminUsers')));
const Users = Loadable(lazy(() => import('views/dashboard/Admin/Users/Users')));
const Payments = Loadable(lazy(() => import('views/dashboard/Admin/Payments/Payments')));
// dashboard Settings
const Share = Loadable(lazy(() => import('views/dashboard/Admin/Share/Share')));
const Settings = Loadable(lazy(() => import('views/dashboard/Admin/Settings/Settings')));
const Logs = Loadable(lazy(() => import('views/dashboard/Admin/Logs/Logs')));
const Notifications = Loadable(lazy(() => import('views/dashboard/Admin/Notifications/Notifications')));
//Game
const Game = Loadable(lazy(() => import('views/dashboard/Admin/Game/Game')));
const NewGame = Loadable(lazy(() => import('views/dashboard/Admin/Game/NewGame')));
const GameUsers = Loadable(lazy(() => import('views/dashboard/Admin/Game/GameUsers')));
const CardGame = Loadable(lazy(() => import('views/dashboard/Admin/Game/CardGame')));
const CardsUser = Loadable(lazy(() => import('views/dashboard/Admin/Game/CardsUser')));
//DEFAULT SECTION ====================================================
// default Login
const AuthSignin = Loadable(lazy(() => import('views/pages/login/login/Signin')));
const AuthSignup = Loadable(lazy(() => import('views/pages/login/login/Signup')));
const AuthRecovery = Loadable(lazy(() => import('views/pages/login/login/PasswordRecover')));
// dashboard Default
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const CardSelectorDefault = Loadable(lazy(() => import('views/dashboard/Default/Main/CardSelector')));
const PlayBingo = Loadable(lazy(() => import('views/dashboard/Default/Main/PlayBingo')));
const MyTickets = Loadable(lazy(() => import('views/dashboard/Default/MyTickets/MyTickets')));
const ConfirmationBuy = Loadable(lazy(() => import('views/dashboard/Default/Main/ConfirmationBuy')));
// dashboard Profile
const UserProfileDefault = Loadable(lazy(() => import('views/dashboard/Default/Profile/UserProfile')));
const UserSecurityDefault = Loadable(lazy(() => import('views/dashboard/Default/Profile/UserSecurity')));
// dashboard Settings
const ShareDefault = Loadable(lazy(() => import('views/dashboard/Default/Share/Share')));
const NotificationsDefault = Loadable(lazy(() => import('views/dashboard/Default/Notifications/Notifications')));
const Success = Loadable(lazy(() => import('views/dashboard/Default/Response/Success')));
const Failure = Loadable(lazy(() => import('views/dashboard/Default/Response/Failure')));

const App = () => {
  const customization = useSelector((state) => state.customization);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        getProfileUser(user.uid).then((pro) => {
          setProfile(pro);
        });
      }
    });
  }, [profile]);

  return (
    <ThemeProvider theme={themes(customization)}>
      <Router basename={config.basename}>
        <Routes>
          <Route element={<HomeLayout />} path="/" exact>
            <Route element={<Home />} path="/" exact />
          </Route>
          <Route element={<MinimalLayout />} path="/auth" exact>
            <Route element={<AuthSignin />} path="signin" exact />
            <Route element={<AuthSignup />} path="signup" exact />
            <Route element={<AuthRecovery />} path="password-recovery" exact />
            <Route element={<NotFound />} path="404" exact />
            <Route path="*" element={<Navigate to="404" />} />
          </Route>
          {profile == genConst.CONST_PRO_ADM ? (
            <Route element={<MainLayout />} path="/main" exact>
              <Route element={<DashboardAdmin />} path="dashboard" exact />
              <Route element={<AdminUsers />} path="admin-users" exact />
              <Route element={<Users />} path="users" exact />
              <Route element={<Payments />} path="payments" exact />
              <Route element={<Game />} path="game" exact />
              <Route element={<NewGame />} path="new-game" exact />
              <Route element={<GameUsers />} path="game-users" exact />
              <Route element={<CardGame />} path="card-game" exact />
              <Route element={<CardsUser />} path="cards-user" exact />
              <Route element={<Share />} path="share" exact />
              <Route element={<Settings />} path="settings" exact />
              <Route element={<Logs />} path="logs" exact />
              <Route element={<Notifications />} path="notifications" exact />
              <Route element={<UserProfile />} path="user-profile" exact />
              <Route element={<UserSecurity />} path="user-security" exact />
            </Route>
          ) : (
            <Route element={<DefaultLayout />} path="/app" exact>
              <Route element={<DashboardDefault />} path="dashboard" exact />
              <Route element={<CardSelectorDefault />} path="card-selector" exact />
              <Route element={<PlayBingo />} path="play-bingo" exact />
              <Route element={<MyTickets />} path="my-tickets" exact />
              <Route element={<ConfirmationBuy />} path="confirmation" exact />
              <Route element={<ShareDefault />} path="share" exact />
              <Route element={<NotificationsDefault />} path="notifications" exact />
              <Route element={<UserProfileDefault />} path="user-profile" exact />
              <Route element={<UserSecurityDefault />} path="user-security" exact />
              <Route element={<Success />} path="success" exact />
              <Route element={<Failure />} path="failure" exact />
            </Route>
          )}
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
