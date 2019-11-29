import React, { memo } from 'react';
import { Router, Redirect, RouteComponentProps } from '@reach/router';
import { Auth } from './Auth';
import { Dashboard } from './Dashboard';
import { Profile } from './Profile';
import { NewGame } from './NewGame';

export interface PrivateRouterProps {
  isLoggedIn: boolean;
  confirmEmail: boolean;
}

const NotFound: React.FC<RouteComponentProps> = () => <Redirect noThrow to="/home" />;

const PrivateRouterComponent: React.FC<PrivateRouterProps> = React.memo(({ isLoggedIn, confirmEmail }) => {
  if (isLoggedIn) {
    return (
      <Router>
        <Dashboard path="/home" />
        <Profile path="/profile" />
        <Dashboard path="/account" />
        <NewGame path="/new-game" />
        <NotFound default />
      </Router>
    );
  }

  return (
    <Router>
      <Auth path="*" confirmEmail={confirmEmail} />
    </Router>
  );
});

export const PrivateRouter = memo(PrivateRouterComponent);
