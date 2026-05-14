import React from 'react';
import { useSelector } from 'react-redux';
import { AuthStack } from './AuthStack';
import { MainStack } from './MainStack';

export const RootNavigator = () => {
    const isAuthenticated = useSelector((state:any)=>state.user.isAuthenticated)

    if (isAuthenticated) {
        return <MainStack />;
    }

    return <AuthStack />;
};