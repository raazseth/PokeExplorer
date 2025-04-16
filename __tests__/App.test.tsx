/**
 * @format
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

jest.useFakeTimers();

jest.mock('@redux/Auth/helper', () => ({
  getUserFromLocal: jest.fn(() => Promise.resolve(null)),
  getWishlistFromLocal: jest.fn(() => Promise.resolve([])),
  getTabFromLocal: jest.fn(() => Promise.resolve(undefined)),
}));

jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    onForegroundEvent: jest.fn(() => () => { }),
    cancelNotification: jest.fn(),
  },
  EventType: {
    PRESS: 'PRESS',
    ACTION_PRESS: 'ACTION_PRESS',
  },
}));

describe('App', () => {
  it('renders correctly without crashing', () => {
    const { toJSON } = render(<App />);
    expect(toJSON()).toBeTruthy();
  });

  it('shows loader initially', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('screen-loader')).toBeTruthy();
  });
});
