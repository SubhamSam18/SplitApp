import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from './types';

import { TabNavigator } from './TabNavigator';
import CreateGroup from '../screens/App/CreateGroup';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={TabNavigator} />
            <Stack.Screen name="CreateGroup" component={CreateGroup} />
        </Stack.Navigator>
    );
};
