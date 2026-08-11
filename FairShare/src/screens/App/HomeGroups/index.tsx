import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../../component/Header';
import API from '../../../services/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigator/types';
import { homeStyles as styles } from '../Home/styles';
import assets from '../../../assets/asset';

type GroupsNavigationProp = NativeStackNavigationProp<MainStackParamList>;
interface IProps {
  showHeader?: boolean;
}

const HomeGroups = ({ showHeader = true }: IProps) => {
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

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'travel': return assets.travelIcon;
      case 'mountain': return assets.mountainIcon;
      case 'roadTrip': return assets.roadTripIcon;
      case 'international': return assets.internationalIcon;
      case 'beach': return assets.beachIcon;
      default: return assets.travelIcon;
    }
  };

  const content = loading && !refreshing ? (
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
              <Image source={getIcon(group.groupAvatar)} style={styles.groupIcon} />
            </View>
            <Text style={styles.groupName} numberOfLines={1}>
              {group.name}
            </Text>
            <Text style={{ color: 'grey', fontSize: 12, marginTop: 5 }}>{group.createdAt.slice(0, 10).split('-').reverse().join('-')}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (!showHeader) {
    return content;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header title="Groups" showProfile={true} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4361EE" />}
        showsVerticalScrollIndicator={false}
      >
        {content}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeGroups;
