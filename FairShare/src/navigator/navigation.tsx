import React from 'react';
import { useSelector } from 'react-redux';
import { AuthStack } from './AuthStack';
import { MainStack } from './MainStack';
import type { RootState } from '../../Redux/store';

export const RootNavigator = () => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  return isAuthenticated ? <MainStack /> : <AuthStack />;
};