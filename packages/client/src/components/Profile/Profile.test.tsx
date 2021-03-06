import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MockedProvider } from '@apollo/react-testing';

import * as Auth from '../../hooks/Auth';
import { SHUFFLE_AVATAR, UPDATE_USERNAME } from './Profile.graphql';
import { ProfileComponent } from './ProfileComponent';
import { Profile } from './Profile';
import { GET_USER_DATA } from '../../hooks/Auth/useAuth.graph';

jest.mock('../../hooks/Auth');

describe('Profile', () => {
  const wait = (amount = 0) => new Promise(resolve => setTimeout(resolve, amount));

  let mockUserData = {};

  beforeEach(() => {
    jest.spyOn(Auth, 'useAuth').mockImplementation(() => {
      return {
        user: mockUserData,
      } as any;
    });
  });

  it('should render without crashing', () => {
    const profile = mount(
      <MockedProvider>
        <Profile />
      </MockedProvider>
    );

    expect(profile.find(ProfileComponent).exists()).toBe(true);
  });

  it('should display a loading spinner when shuffleAvatarLoading is set', async () => {
    const testAvatar = 'testAvatar';
    const updatedUser = {
      id: '123',
      username: 'testUsername',
      avatar: testAvatar,
    };
    const mocks = [
      {
        request: {
          query: SHUFFLE_AVATAR,
        },
        result: jest.fn(() => {
          mockUserData = updatedUser;
          return {
            data: {
              shuffleAvatar: { avatar: updatedUser.avatar },
            },
          };
        }),
      },
      {
        request: { query: GET_USER_DATA },
        result: jest.fn(() => ({ data: { whoAmI: updatedUser } })),
      },
    ];

    // Render the component
    const profile = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Profile />
      </MockedProvider>
    );

    // The first render should have an empty user and shuffleAvatarLoading should be false
    expect(profile.find(ProfileComponent).props().user).toEqual({});
    expect(profile.find(ProfileComponent).props().shuffleAvatarLoading).toBe(false);

    // Trigger the shuffleAvatar callback inside ProfileComponent
    act(() => {
      profile
        .find(ProfileComponent)
        .props()
        .shuffleAvatar();
    });

    // Trigger change detection in the component
    profile.update();

    // The graphql mutation should have been triggered, hence the shuffleAvatarLoading should be true
    expect(profile.find(ProfileComponent).props().shuffleAvatarLoading).toBe(true);

    // Simulate the end of the mutation operation
    await act(async () => {
      await wait();
    });
    profile.update();

    expect(mocks[0].result).toBeCalled();

    // Simulate waitRefetchQueries on GET_USER_DATA
    await act(async () => {
      await wait();
    });
    profile.update();

    expect(mocks[1].result).toBeCalled();

    // The user should be updated and shuffleAvatarLoading should be back to false
    expect(profile.find(ProfileComponent).length).toBe(1);
    expect(profile.find(ProfileComponent).props().shuffleAvatarLoading).toBe(false);
    expect(profile.find(ProfileComponent).props().user).toEqual(updatedUser);
  });

  it('should allow updating the profile information', async () => {
    let updateUserCalled = false;
    const testUserName = 'new-username';
    const expectedVariables = {
      updateUserInput: { username: testUserName },
    };
    const mocks = [
      {
        request: { query: UPDATE_USERNAME, variables: expectedVariables },
        result: () => {
          updateUserCalled = true;
          return { data: { updateUser: { username: testUserName } } };
        },
      },
      {
        request: { query: GET_USER_DATA },
        result: () => ({
          data: {
            whoAmI: {
              id: 'xx',
              avatar: 'zzz',
              username: testUserName,
            },
          },
        }),
      },
    ];

    const profile = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Profile />
      </MockedProvider>
    );

    act(() => {
      profile
        .find(ProfileComponent)
        .props()
        .saveUsername(testUserName);
    });

    await act(async () => {
      await wait();
    });
    profile.update();

    expect(updateUserCalled).toBe(true);
    expect(mocks[0].request.variables).toEqual(expectedVariables);
  });
});
