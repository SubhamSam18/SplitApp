import React from 'react';
import { Image, Platform, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from "@react-navigation/native";

import Home from '../screens/App/Home';
import Groups from '../screens/App/Groups';
import Analytics from '../screens/App/Analytics';
import Friends from '../screens/App/Friends';
import Activity from '../screens/App/Activity';

import assets from '../assets/asset';
import { TabStyles as styles } from './styles';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setHidden(true);
      return () => {
        StatusBar.setHidden(false);
      };
    }, [])
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#1A1A1A',
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          height: Platform.OS === 'ios' ? 85 : 70,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          elevation: 15,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={Home}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Image 
              source={assets.homeIcon} 
              style={[
                styles.IconTabBar, 
                { tintColor: color }, 
                focused && { transform: [{ scale: 1.25 }] }
              ]} 
            />
          )
        }}
      />
      <Tab.Screen
        name="GroupsTab"
        component={Groups}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Image 
              source={assets.groupIcon} 
              style={[
                styles.IconTabBar, 
                { tintColor: color }, 
                focused && { transform: [{ scale: 1.25 }] }
              ]} 
            />
          )
        }}
      />
      <Tab.Screen
        name="AnalyticsTab"
        component={Analytics}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Image 
              source={assets.analyticsIcon} 
              style={[
                styles.IconTabBar, 
                { tintColor: color }, 
                focused && { transform: [{ scale: 1.25 }] }
              ]} 
            />
          )
        }}
      />
      <Tab.Screen
        name="FriendsTab"
        component={Friends}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Image 
              source={assets.friendsIcon} 
              style={[
                styles.IconTabBar, 
                { tintColor: color }, 
                focused && { transform: [{ scale: 1.25 }] }
              ]} 
            />
          )
        }}
      />
      <Tab.Screen
        name="ActivityTab"
        component={Activity}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Image 
              source={assets.activityIcon} 
              style={[
                styles.IconTabBar, 
                { tintColor: color }, 
                focused && { transform: [{ scale: 1.25 }] }
              ]} 
            />
          )
        }}
      />
    </Tab.Navigator>
  );
};
