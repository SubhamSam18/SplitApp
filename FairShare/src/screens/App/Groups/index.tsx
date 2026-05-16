import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../../component/Header';
import API from '../../../services/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigator/types';
import { homeStyles as styles } from '../Home/styles';

type GroupsNavigationProp = NativeStackNavigationProp<MainStackParamList>;

const Groups = () => {
  const navigation = useNavigation<GroupsNavigationProp>();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGroups = async () => {
    try {
      const res = await API.get('/groups/');
      setGroups(res.data.groups.reverse());
    } catch (e) {
      console.log('Error fetching groups:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchGroups();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Your Groups" avatar="https://cdn-icons-png.flaticon.com/512/3675/3675805.png" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4361EE" />}
        showsVerticalScrollIndicator={false}
      >
        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#4361EE" style={styles.loader} />
        ) : (
          <View style={styles.groupsSection}>
            <View style={styles.groupsGrid}>
              <TouchableOpacity style={styles.createGroupBox} onPress={() => navigation.navigate('CreateGroup')}>
                <View style={styles.createIconContainer}>
                  <Text style={styles.createIcon}>+</Text>
                </View>
                <Text style={styles.groupName}>Create Group</Text>
              </TouchableOpacity>
              {groups.map((group) => (
                <TouchableOpacity 
                  key={group._id} 
                  style={styles.groupBox}
                  onPress={() => navigation.navigate('GroupDetails', { groupId: group._id, groupName: group.name })}
                >
                  <View style={styles.groupIconContainer}>
                    <Text style={styles.groupIcon}>✈️</Text>
                  </View>
                  <Text style={styles.groupName} numberOfLines={1}>
                    {group.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Groups;
