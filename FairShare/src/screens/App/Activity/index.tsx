import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Header } from '../../../component/Header';
import API from '../../../services/api';
import { styles } from './styles';

interface Split {
    user: string;
    name: string;
    amount: number;
}

interface ActivityItem {
    _id: string;
    groupId: string;
    description: string;
    amount: number;
    paidBy: string;
    createdBy: string;
    splits: Split[];
    createdAt: string;
}

const Activity = () => {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [currentUserId, setCurrentUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchActivities = async () => {
        try {
            const res = await API.get('/activity/getActivities');
            setActivities(res.data.activities || []);
            setCurrentUserId(res.data.currentUserId || '');
        } catch (error) {
            console.log('Error fetching activities:', error);
            Alert.alert('Error', 'Could not load activity feed');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchActivities();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchActivities();
    };

    const formatRelativeTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);

            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) {
                if (date.getDate() === now.getDate()) {
                    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                }
                return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            }

            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            if (
                date.getDate() === yesterday.getDate() &&
                date.getMonth() === yesterday.getMonth() &&
                date.getFullYear() === yesterday.getFullYear()
            ) {
                return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            }

            return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (e) {
            return '';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="Recent Activity"
                avatar="https://cdn-icons-png.flaticon.com/512/3675/3675805.png"
            />
            {loading && !refreshing ? (
                <ActivityIndicator size="large" color="#4361EE" style={styles.loader} />
            ) : (
                <>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        refreshControl={
                            <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#4361EE"
                            />
                        }
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.sectionTitle}>Activity Log</Text>
                        {activities.length > 0 ? (
                            activities.map((activity) => {
                                const isDeleted = activity.description.toLowerCase().includes('deleted');
                                const mySplit = activity.splits?.find(s => s.user === currentUserId)?.amount || 0;
                                const isPayer = activity.paidBy === currentUserId;
                                let receivableAmount = activity.amount - mySplit;
                                receivableAmount = Math.round(receivableAmount);
                                const isSettlement = activity.description.toLowerCase().includes('settled');
                                let avatarBg = '#F3F4F6';
                                let avatarEmoji = '📝';

                                if (isDeleted) {
                                    avatarBg = '#F3F4F6';
                                    avatarEmoji = '🗑️';
                                } else if (isSettlement) {
                                    avatarBg = '#E8F8F0'; // Soft green for settlements
                                    avatarEmoji = '🤝';
                                } else if (isPayer) {
                                    avatarBg = '#E8F8F0'; // Soft green
                                    avatarEmoji = '💸';
                                } else if (mySplit > 0) {
                                    avatarBg = '#FDF2F2'; // Soft red
                                    avatarEmoji = '🛍️';
                                }

                                return (
                                    <View key={activity._id} style={styles.activityCard}>
                                        <View style={styles.leftSection}>
                                            <View style={[styles.avatarPlaceholder, { backgroundColor: avatarBg }]}>
                                                <Text style={styles.avatarText}>{avatarEmoji}</Text>
                                            </View>

                                            <View style={styles.detailsContainer}>
                                                <Text style={isDeleted ? styles.deletedDescriptionText : styles.descriptionText}>
                                                    {activity.description}
                                                </Text>
                                                <Text style={styles.timeText}>
                                                    {formatRelativeTime(activity.createdAt)}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.rightSection}>
                                            {isDeleted ? (
                                                <View style={styles.deletedBadge}>
                                                    <Text style={styles.deletedText}>DELETED</Text>
                                                </View>
                                            ) : isSettlement ? (
                                                isPayer ? (
                                                    <>
                                                        <Text style={styles.contributionLabel}>you settled</Text>
                                                        <Text style={[styles.contributionAmount, { color: '#6B7280' }]}>
                                                            ₹{activity.amount}
                                                        </Text>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Text style={styles.contributionLabel}>received</Text>
                                                        <Text style={[styles.contributionAmount, { color: '#28a745' }]}>
                                                            +₹{activity.amount}
                                                        </Text>
                                                    </>
                                                )
                                            ) : isPayer ? (
                                                <>
                                                    <Text style={styles.contributionLabel}>you lent</Text>
                                                    <Text style={[styles.contributionAmount, { color: '#28a745' }]}>
                                                        +₹{receivableAmount}
                                                    </Text>
                                                </>
                                            ) : mySplit > 0 ? (
                                                <>
                                                    <Text style={styles.contributionLabel}>you borrowed</Text>
                                                    <Text style={[styles.contributionAmount, { color: '#dc3545' }]}>
                                                        -₹{mySplit}
                                                    </Text>
                                                </>
                                            ) : (
                                                <View style={styles.deletedBadge}>
                                                    <Text style={styles.deletedText}>NOT SPLIT</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                );
                            })
                        ) : (
                            <Text style={styles.emptyText}>
                                No recent activity in your groups yet.
                            </Text>
                        )}
                    </ScrollView>
                </>
            )
            }
        </SafeAreaView >
    );
};

export default Activity;
