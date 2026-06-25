import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { homeStyles as styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../../component/Header';
import API from '../../../services/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigator/types';
import HomeGroups from '../HomeGroups';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../../../Redux/userSlice';
import type { RootState } from '../../../../Redux/store';

type HomeNavigationProp = NativeStackNavigationProp<MainStackParamList>;

const Home = () => {
    const navigation = useNavigation<HomeNavigationProp>();
    const dispatch = useDispatch();

    const [youOwe, setYouOwe] = useState(0);
    const [youAreOwed, setYouAreOwed] = useState(0);
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const [groupsRes, summaryRes, avatarRes] = await Promise.all([
                API.get('/groups/'),
                API.get('/summary'),
                API.get('/auth/getAvatar')
            ]);
            setGroups(groupsRes.data.groups.reverse());
            setYouOwe(summaryRes.data.youOwe || 0);
            setYouAreOwed(summaryRes.data.youAreOwed || 0);
            if (avatarRes?.data) {
                dispatch(updateUser({
                    name: avatarRes.data.name,
                    avatarUpdatedAt: avatarRes.data.avatarUpdatedAt
                }));
            }
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
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <Header title="Fair Share" showProfile={true} />

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
                        <HomeGroups showHeader={false} />
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;
