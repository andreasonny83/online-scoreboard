import React from 'react';
import { shallow } from 'enzyme';
import * as Auth from './components/Auth';
import * as Notification from './components/Notification';
import { Loading } from './components/Loading';

import { App } from './App';

jest.mock('./components/Auth/useAuth');
jest.mock('./components/Notification');

describe('App', () => {
  let mockLoading = false;
  const isLoggedIn = true;
  const mockOperationLoading = false;
  const testUser = {
    email: 'fake@mail.com',
    error: '',
    isLoggedIn,
    username: 'test user',
    __typename: 'UserSession',
  };

  jest.spyOn(Auth, 'useAuth').mockImplementation(() => ({
    user: testUser,
    error: undefined,
    loading: mockLoading,
    operationLoading: mockOperationLoading,
    isLoggedIn,
    success: false,
    logIn: jest.fn(),
    logOut: jest.fn(),
  }));

  jest.spyOn(Notification, 'useNotification').mockImplementation(() => ({
    openNotification: jest.fn(),
    dismissNotification: jest.fn(),
    message: '',
    variant: 'info',
    open: false,
  }));
  // Mock the Notification component
  jest.spyOn(Notification, 'Notification').mockImplementation(() => null);

  it('should render without crashing', () => {
    // Act
    const app = shallow(<App />);

    // Assert
    expect(app.find('div').hasClass('App')).toBe(true);
  });

  it('should display a loading spinner while fetching the initial data', () => {
    // Arrange
    mockLoading = true;

    // Act
    const app = shallow(<App />);

    // Assert
    expect(app.find(Loading).exists()).toBe(true);
  });

  it('should remove the loading spinner after the initial data has been fetched', () => {
    // Arrange
    mockLoading = false;

    // Act
    const app = shallow(<App />);

    // Assert
    expect(app.find(Loading).exists()).toBe(false);
  });
});
