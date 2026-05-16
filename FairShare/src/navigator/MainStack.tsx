import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import CreateGroup from '../screens/App/CreateGroup';
import Groups from '../screens/App/Groups';
import GroupDetails from '../screens/App/GroupDetails';
import CreateExpense from '../screens/App/CreateExpense';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={TabNavigator} />
            <Stack.Screen name="CreateGroup" component={CreateGroup} />
            <Stack.Screen name="Groups" component={Groups} />
            <Stack.Screen name="GroupDetails" component={GroupDetails} />
            <Stack.Screen name="CreateExpense" component={CreateExpense} />
        </Stack.Navigator>
    );
};
