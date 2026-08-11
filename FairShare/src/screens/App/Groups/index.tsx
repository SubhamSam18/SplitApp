import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../../component/Header';
import API from '../../../services/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigator/types';
import { styles } from './styles';
import assets from '../../../assets/asset';

type GroupsNavigationProp = NativeStackNavigationProp<MainStackParamList>;

const getGroupIcon = (groupAvatar: string) => {
  switch (groupAvatar) {
    case 'beach': return assets.beachIcon;
    case 'mountain': return assets.mountainIcon;
    case 'roadTrip': return assets.roadTripIcon;
    case 'international': return assets.internationalIcon;
    default: return assets.travelIcon;
  }
};

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

  const totalGroups = groups.length;
  const totalOwed = groups.reduce((sum, g) => sum + (g.youOwe || 0), 0);
  const totalReceive = groups.reduce((sum, g) => sum + (g.youReceive || 0), 0);
  const totalExpenses = groups.reduce((sum, g) => sum + (g.totalExpense || 0), 0);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header title="GROUPS" showProfile={true} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4361EE" />}
        showsVerticalScrollIndicator={false}
      >
        {!loading && (
          <View style={styles.summaryBanner}>
            <Text style={styles.summaryBannerTitle}>Total Group Spending</Text>
            <Text style={styles.summaryBannerCount}>₹{totalExpenses.toLocaleString()}</Text>
            <View style={styles.summaryStatsRow}>
              <View style={styles.summaryStatBox}>
                <Text style={styles.summaryStatLabel}>You Owe</Text>
                <Text style={styles.summaryStatValue}>₹{totalOwed.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryStatBox}>
                <Text style={styles.summaryStatLabel}>You Receive</Text>
                <Text style={styles.summaryStatValue}>₹{totalReceive.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryStatBox}>
                <Text style={styles.summaryStatLabel}>Groups</Text>
                <Text style={styles.summaryStatValue}>{totalGroups}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.listSection}>

          {loading && !refreshing ? (
            <ActivityIndicator size="large" color="#4361EE" style={styles.loader} />
          ) : (
            <>
              <TouchableOpacity
                style={styles.createGroupCard}
                onPress={() => navigation.navigate('CreateGroup')}
                activeOpacity={1}
              >
                <View style={styles.createIconBubble}>
                  <Text style={styles.createIconText}>+</Text>
                </View>
                <View style={styles.createTextBlock}>
                  <Text style={styles.createGroupTitle}>Create New Group</Text>
                  <Text style={styles.createGroupSubtitle}>Split expenses with friends & family</Text>
                </View>
                <Text style={styles.createArrow}>›</Text>
              </TouchableOpacity>

              {groups.length > 0 && (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>My Groups</Text>
                  <View style={styles.groupCountBadge}>
                    <Text style={styles.groupCountBadgeText}>{totalGroups}</Text>
                  </View>
                </View>
              )}
              {groups.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                  <Text style={styles.emptyStateSubtitle}>
                    Create your first group and start{'\n'}splitting expenses with ease!
                  </Text>
                </View>
              ) : (
                groups.map((group, index) => {
                  const isSettled = group.youOwe === 0 && group.youReceive === 0;
                  const memberCount = group.members?.length ?? 0;

                  return (
                    <TouchableOpacity
                      key={group._id}
                      style={styles.groupCard}
                      onPress={() =>
                        navigation.navigate('GroupDetails', {
                          groupId: group._id,
                          groupName: group.name,
                        })
                      }
                      activeOpacity={0.82}
                    >
                      <View style={[styles.cardAccentBar]} />

                      <View style={styles.cardBody}>
                        <View style={styles.cardTopRow}>
                          <View style={[styles.groupIconBubble]}>
                            <Image
                              source={getGroupIcon(group.groupAvatar)}
                              style={[styles.groupIconImg]}
                            />
                          </View>

                          <View style={styles.groupTitleBlock}>
                            <Text style={styles.groupName} numberOfLines={1}>
                              {group.name}
                            </Text>
                            <Text style={styles.memberCount}>
                              {memberCount} member{memberCount !== 1 ? 's' : ''}
                            </Text>
                          </View>

                          <View style={styles.totalExpenseContainer}>
                            <Text style={styles.totalExpenseLabel}>Total Spent</Text>
                            <Text style={styles.totalExpense}>
                              ₹{(group.totalExpense || 0).toLocaleString()}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.separator} />

                        {isSettled ? (
                          <View style={styles.settledBadge}>
                            <Text style={styles.settledBadgeText}>✓  All Settled Up</Text>
                          </View>
                        ) : (
                          <View style={styles.cardBottomRow}>
                            <View style={styles.balanceBlock}>
                              <Text style={styles.balanceLabel}>You Owe</Text>
                              <Text style={[
                                styles.balanceValue,
                                { color: group.youOwe > 0 ? '#E63946' : '#888888' }
                              ]}>
                                ₹{(group.youOwe || 0).toLocaleString()}
                              </Text>
                            </View>
                            <View style={[styles.balanceBlock, { alignItems: 'flex-end' }]}>
                              <Text style={styles.balanceLabel}>You Receive</Text>
                              <Text style={[
                                styles.balanceValue,
                                { color: group.youReceive > 0 ? '#28a745' : '#888888' }
                              ]}>
                                ₹{(group.youReceive || 0).toLocaleString()}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Groups;
