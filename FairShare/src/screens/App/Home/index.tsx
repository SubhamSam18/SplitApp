import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { homeStyles as styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../../component/Header';
import API from '../../../services/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigator/types';
import Groups from '../Groups';

type HomeNavigationProp = NativeStackNavigationProp<MainStackParamList>;

const Home = () => {
    const navigation = useNavigation<HomeNavigationProp>();

    const [youOwe, setYouOwe] = useState(0);
    const [youAreOwed, setYouAreOwed] = useState(0);
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const [groupsRes, summaryRes] = await Promise.all([
                API.get('/groups/'),
                API.get('/summary')
            ]);
            setGroups(groupsRes.data.groups.reverse());
            setYouOwe(summaryRes.data.youOwe || 0);
            setYouAreOwed(summaryRes.data.youAreOwed || 0);
        } catch (error) {
            console.log('Error fetching home data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const totalBalance = youAreOwed - youOwe;

    return (
        <SafeAreaView style={styles.container}>
            <Header title="SplitAura" avatar="https://cdn-icons-png.flaticon.com/512/3675/3675805.png" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4361EE" />}
                showsVerticalScrollIndicator={false}
            >
                {loading && !refreshing ? (
                    <ActivityIndicator size="large" color="#4361EE" style={styles.loader} />
                ) : (
                    <>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryTitle}>Total Balance</Text>
                            <Text style={[styles.totalAmount, { color: totalBalance >= 0 ? '#28a745' : '#dc3545' }]}>
                                {totalBalance < 0 ? '-' : ''}₹{Math.abs(totalBalance)}
                            </Text>

                            <View style={styles.splitSection}>
                                <View style={styles.moneyBox}>
                                    <Text style={styles.moneyLabel}>You'll Receive</Text>
                                    <Text style={[styles.moneyValue, { color: '#28a745' }]}>₹{youAreOwed}</Text>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.moneyBox}>
                                    <Text style={styles.moneyLabel}>You'll Pay</Text>
                                    <Text style={[styles.moneyValue, { color: '#dc3545' }]}>₹{youOwe}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.groupsSection}>
                            <View style={styles.groupsHeader}>
                                <Text style={styles.groupsTitle}>Your Groups</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('GroupsTab' as never)}>
                                    <Text style={styles.seeAllText}>See All</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.groupsGrid}>
                                <TouchableOpacity style={styles.createGroupBox} onPress={() => navigation.navigate('CreateGroup')}>
                                    <View style={styles.createIconContainer}>
                                        <Text style={styles.createIcon}>+</Text>
                                    </View>
                                    <Text style={styles.groupName}>Create Group</Text>
                                </TouchableOpacity>

                                {groups.slice(0, 3).map((group) => (
                                    <TouchableOpacity
                                        key={group._id}
                                        style={styles.groupBox}
                                        onPress={() => navigation.navigate('GroupDetails', { groupId: group._id, groupName: group.name })}
                                    >
                                        <View style={styles.groupIconContainer}>
                                            <Text style={styles.groupIcon}>✈️</Text>
                                        </View>
                                        <Text style={styles.groupName} numberOfLines={1}>{group.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;
